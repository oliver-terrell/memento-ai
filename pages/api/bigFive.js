import axios from "axios";

export default async function bigFive(req, res) {
  const rapidAPIKey = process.env.RAPIDAPI_API_KEY;
  const rapidAPIEndpoint = "https://big-five-personality-insights.p.rapidapi.com/api/big5";
  const rapidAPIHost = 'big-five-personality-insights.p.rapidapi.com';

  try {
    const options = {
        method: 'POST',
        url: rapidAPIEndpoint,
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': rapidAPIKey,
          'X-RapidAPI-Host': rapidAPIHost
        },
        data: [
          {
            id: '1',
            language: 'en',
            text: req.body.query
          }
        ]
    };

    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(error.response?.status || 500).json({ message: error.message });
  }
};
