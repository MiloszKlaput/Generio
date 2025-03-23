const axios = require('axios');
require('dotenv').config();

const apiAgileUrl = process.env.API_AGILE_URL;

async function createSprint(req, res) {
  try {
    const url = `${req.body.jiraBaseUrl}${apiAgileUrl}/sprint`;
    const data = req.body.sprint;
    const config = {
      headers: { 'Content-Type': 'application/json' },
      auth: {
        username: req.body.userName,
        password: req.body.apiKey
      }
    };

    const response = await axios.post(url, data, config);
    return res.json({ data: response.data });

  } catch (error) {
    console.error('Error occurred: ', error.message);

    let errorMessage = 'Wystąpił nieznany błąd.';
    if (error.response) {
      errorMessage = error.response.data?.errors || error.response.data?.errorMessages || error.response.data || errorMessage;
    } else if (error.request) {
      errorMessage = 'Brak odpowiedzi z Jira API.';
    }

    return res.status(500).json({ error: errorMessage });
  }
}

module.exports = createSprint;
