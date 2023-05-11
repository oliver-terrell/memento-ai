const axios = require('axios');
const cheerio = require('cheerio');
import { getAspectPercentages } from 'util/marshal';

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

async function analyze(url) {
  const visibleText = await scrapeVisibleText(url);

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

module.exports = async (req, res) => {
    const { url } = req.query;
  
    if (!url) {
      return res.status(400).json({ error: 'Missing URL parameter' });
    }
  
    try {
      // TODO: move the display and calculation logic from memento-ext to here for reuse
      const data = await analyze(url);
      const aspectPercentages = getAspectPercentages(data);
      res.json(aspectPercentages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
