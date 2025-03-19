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
    let errorMessage = '';
    if (error.response) {
      errorMessage = error.response.data.errors ?? error.response.data.errorMessages;
      console.error("Error response: ", errorMessage);
    } else if (error.request) {
      errorMessage = 'Wystąpił nieznany błąd.'
      console.error("No response received: ", error.request);
    } else {
      errorMessage = 'Wystąpił nieznany błąd.'
      console.error("Error during request setup: ", error.message);
    }
    return res.status(500).json(errorMessage);
  }
}

module.exports = getBoardId;
