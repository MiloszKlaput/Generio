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

async function getBoardId(req, res) {
  try {
    const url = `${apiAgileUrl}/board`;
    const config = {
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    };

    const response = await axios.get(url, config);

    return res.json({ data: response.data.values[0].id });

  } catch (error) {
    console.log(error.response.data.errors);
    return res.status(500).json(error.response.data.errors);
  }
}

module.exports = getBoardId;
