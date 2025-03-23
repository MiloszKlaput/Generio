const axios = require('axios');
require('dotenv').config();

const apiAgileUrl = process.env.API_AGILE_URL;

async function getBoardId(req, res) {
  try {
    const url = `${req.query.jiraBaseUrl}${apiAgileUrl}/board?projectKeyOrId=${req.query.projectKey}`;
    const config = {
      headers: { 'Content-Type': 'application/json' },
      auth: {
        username: req.query.userName,
        password: req.query.apiKey
      }
    };

    const response = await axios.get(url, config);

    return res.json({ data: response.data.values[0].id });

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

module.exports = getBoardId;
