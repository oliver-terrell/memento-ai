import { openai, configuration } from "./base.js";

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured.",
      }
    });
    return;
  }

  const query = req.body.query;
  const bigFiveData = req.body.bigFiveData;

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt({query: query, bigFiveData: bigFiveData}),
      temperature: 0.8,
      max_tokens: 256,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(components={}) {
  return `
  Pretend you are a psychologist and a trusted friend, and that we are having a simple conversation over tea.
  Why do you think my input, which is here wrapped in empty xml tags: </> ${components.query || '{{ error: no text found }}'} </>
  Embodies the following Big Five personality trait profile (wrapped in empty xml tags), where scores for each trait are percentages? <> ${components.bigFiveData || '{{ error: no traits found }}'} </>?
  Tell me what parts of the text might correspond to each score, and why. Keep your response to a couple sentences. You don't need to touch on everything. 
  Reference the text input as something like "your words" instead of "text" or "input". Also, be nice, and touch on at least two notable big five traits.
  `;
}
