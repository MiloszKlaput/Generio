const axios = require('axios');
require('dotenv').config();

const apiBaseUrl = process.env.API_BASE_URL;
const apiRestUrl = apiBaseUrl + process.env.API_REST_URL;

async function deleteProject(req, res) {
  try {
    const projectKey = req.body.projectKey;
    const url = `${apiRestUrl}/project/${projectKey}`;
    const config = {
      headers: { 'Content-Type': 'application/json' },
      auth: {
        username: req.body.userName,
        password: req.body.apiKey
      }
    };

    const response = await axios.delete(url, config);
    return res.json({ data: response.data });

  } catch (error) {
    const errorMessage = error.response.data.errors ?? error.response.data.errorMessages;
    return res.status(500).json(errorMessage);
  }
}

module.exports = deleteProject;
