const axios = require('axios');
require('dotenv').config();

const apiBaseUrl = process.env.API_BASE_URL;
const apiRestUrl = apiBaseUrl + process.env.API_REST_URL;
const apiUserName = process.env.API_USER_NAME;
const apiKeyValue = process.env.API_KEY_VALUE;
const apiAgileUrl = apiBaseUrl + process.env.API_AGILE_URL;

const auth = {
  username: apiUserName,
  password: apiKeyValue
};

async function testApi(req, res) {
  try {
    const url = `${apiRestUrl}/issuetype/project?projectId=10003`;
    const config = {
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    };

    const response = await axios.get(url, config);

    console.log(response.data);
    return res.json({ data: response.data });

  } catch (error) {
    console.error('Błąd podczas pobierania issueTypes:', error.response ? error.response.data : error.message);
    return res.status(error.response ? error.response.status : 500).json({
      error: error.response ? error.response.data : 'Internal Server Error'
    });
  }
}

module.exports = testApi;
