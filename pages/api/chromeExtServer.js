const axios = require('axios');
const cheerio = require('cheerio');
import { openai, configuration } from "./base.js";
import { getAspectPercentagesDisplay } from 'util/display';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const RAPIDAPI_SECRET_KEY = process.env.RAPIDAPI_API_KEY;
const RAPIDAPI_ENDPOINT = process.env.RAPIDAPI_ENDPOINT;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;

async function scrapeVisibleText(url) {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
  
      // Remove script and style elements
      $('script, style').remove();
  
      const visibleText = $('body').text().trim();
      return visibleText;
    } catch (error) {
      console.error('Error scraping visible text:', error);
      return null;
    }
  }

async function analyzeBigFive(visibleText) {
  try {
    const options = {
        method: 'POST',
        url: RAPIDAPI_ENDPOINT,
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': RAPIDAPI_SECRET_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST
        },
        data: [
          {
            id: '1',
            language: 'en',
            text: visibleText
          }
        ]
    }
    const response = await axios.request(options);

    return response.data;
  } catch (error) {
    throw new Error('An error occurred while processing the request.');
  }
}

async function getTextSummary(visibleText, bigFiveData) {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt({query: visibleText, bigFiveData: bigFiveData}),
      temperature: 0.8,
      max_tokens: 256,
    });
    return completion.data.choices[0].text;
  } catch(error) {
      console.error(`Error with OpenAI API request: ${error.message}`);
      return {
        error: {
          message: 'An error occurred during your request.',
        }
    };
  }
}

function generatePrompt(components={}) { 
  return `
  Pretend you are a psychologist and a trusted friend, and that we are having a simple conversation over tea.
  Why do you think this page, the text of which is here wrapped in empty xml tags: </> ${components.query || '{{ error: no text found }}'} </>
  Embodies the following Big Five personality trait profile (wrapped in empty xml tags), where scores for each trait are percentages?  <> ${components.bigFiveData || '{{ error: no traits found }}'} </>?
  Tell me what parts of the text might correspond to each score, and why. Keep your response to a couple sentences. You don't need to touch on everything. 
  Reference the text input as something like "this page" instead of "text" or "input". Also, be nice, and touch on at least two notable big five traits.
  `;
}

module.exports = async (req, res) => {
    const { url } = req.query;
  
    if (!url) {
      return res.status(400).json({ error: 'Missing URL parameter' });
    }
  
    try {
      const visibleText = await scrapeVisibleText(url);
      const bigFiveData = await analyzeBigFive(visibleText);
      const textSummary = await getTextSummary(visibleText, bigFiveData);
      const bigFiveOutput = getAspectPercentagesDisplay(bigFiveData, true);
      res.json({bigFiveOutput: bigFiveOutput, textSummary: textSummary});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
