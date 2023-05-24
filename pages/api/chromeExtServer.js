const axios = require('axios');
const cheerio = require('cheerio');
import { openai } from "./base.js";
import { getAspectPercentagesDisplay } from 'util/display';
import { getAspectPercentages } from 'util/marshal';
import { generatePrompt } from "util/prompts.js";

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

async function getTextSummary(visibleText, aspectPercentages) {
  try {
    const prompt = generatePrompt({query: visibleText, aspectPercentages: aspectPercentages}, true);
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
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

module.exports = async (req, res) => {
    const { url } = req.query;
  
    if (!url) {
      return res.status(400).json({ error: 'Missing URL parameter' });
    }
  
    try {
      const visibleText = await scrapeVisibleText(url);
      const bigFiveData = await analyzeBigFive(visibleText);
      const aspectPercentages = getAspectPercentages(bigFiveData);
      const textSummary = await getTextSummary(visibleText, aspectPercentages);
      const aspectPercentagesOutput = getAspectPercentagesDisplay(bigFiveData, true);
      res.json({aspectPercentages: aspectPercentagesOutput, textSummary: textSummary});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
