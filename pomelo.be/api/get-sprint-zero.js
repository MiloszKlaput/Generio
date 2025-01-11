const axios = require('axios');
require('dotenv').config();

const apiBaseUrl = process.env.API_BASE_URL;
const apiAgileUrl = apiBaseUrl + process.env.API_AGILE_URL;
const apiUserName = process.env.API_USER_NAME;
const apiKeyValue = process.env.API_KEY_VALUE;

const auth = {
  username: apiUserName,
  password: apiKeyValue
};

async function getSprintZero(req, res) {
  try {
    const boardsUrl = `${apiAgileUrl}/board`;
    const boardsConfig = {
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    };

    const boardZeroResponse = await axios.get(boardsUrl, boardsConfig);
    const boardZeroId = boardZeroResponse.data.values[0].id;

    const sprintZeroUrl = `${apiAgileUrl}/board/${boardZeroId}/sprint`;
    const sprintZeroConfig = {
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    };

    const response = await axios.get(sprintZeroUrl, sprintZeroConfig);
    const sprintZero = response.data.values[0];

    return res.json({ data: sprintZero });

  } catch (error) {
    console.log(error.response.data.errors);
    return res.status(500).json(error.response.data.errors);
  }
}

module.exports = getSprintZero;
