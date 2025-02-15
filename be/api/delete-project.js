const axios = require('axios');
require('dotenv').config();

const apiBaseUrl = process.env.API_BASE_URL;
const apiRestUrl = apiBaseUrl + process.env.API_REST_URL;
const apiUserName = process.env.API_USER_NAME;
const apiKeyValue = process.env.API_KEY_VALUE;

const auth = {
  username: apiUserName,
  password: apiKeyValue
};

async function deleteProject(req, res) {
  try {
    const projectKey = req.body.projectKey;
    const url = `${apiRestUrl}/project/${projectKey}`;
    const config = {
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    };

    const response = await axios.delete(url, config);
    return res.json({ data: response.data });

  } catch (error) {
    console.log(error.response.data);
    let errors;
    if (error.response.data.errors) {
      errors = error.response.data.errors;
    }
    if (error.response.data.errorMessages) {
      errors = error.response.data.errorMessages;
    }

    return res.status(500).json(errors);
  }
}

module.exports = deleteProject;
