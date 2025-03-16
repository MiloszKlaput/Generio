const axios = require('axios');
require('dotenv').config();

const apiAgileUrl = process.env.API_AGILE_URL;

async function getBoardId(req, res) {
  try {
    const url = `https://${req.query.jiraBaseUrl}.atlassian.net${apiAgileUrl}/board?projectKeyOrId=${req.query.projectKey}`;
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
    console.log(error);
    const errorMessage = error.response.data.errors ?? error.response.data.errorMessages;
    return res.status(500).json(errorMessage);
  }
}

module.exports = getBoardId;
