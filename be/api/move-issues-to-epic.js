const axios = require('axios');
require('dotenv').config();

const apiBaseUrl = process.env.API_BASE_URL;
const apiAgileUrl = apiBaseUrl + process.env.API_AGILE_URL;

async function moveIssuesToEpic(req, res) {
  try {
    const url = `${apiAgileUrl}/epic/${req.body.epicId}/issue`;
    const data = { issues: req.body.issues };
    const config = {
      headers: { 'Content-Type': 'application/json' },
      auth: {
        username: req.body.userName,
        password: req.body.apiKey
      }
    };

    const response = await axios.post(url, data, config);
    return res.status(200).json(response.data);

  } catch (error) {
    const errorMessage = error.response.data.errors ?? error.response.data.errorMessages;
    return res.status(500).json(errorMessage);
  }
}

module.exports = moveIssuesToEpic;
