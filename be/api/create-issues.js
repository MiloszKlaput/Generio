const axios = require('axios');
require('dotenv').config();

const apiBaseUrl = process.env.API_BASE_URL;
const apiRestUrl = apiBaseUrl + process.env.API_REST_URL;

async function createIssues(req, res) {
  try {
    const url = `${apiRestUrl}/issue/bulk`;
    const data = { issueUpdates: req.body.issues };
    const config = {
      headers: { 'Content-Type': 'application/json' },
      auth: {
        username: req.body.userName,
        password: req.body.apiKey
      }
    };

    const response = await axios.post(url, data, config);
    return res.json(response.data);

  } catch (error) {
    const errorMessage = error.response.data.errors ?? error.response.data.errorMessages;
    return res.status(500).json({ errorMessage });
  }
}

module.exports = createIssues;
