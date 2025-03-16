const axios = require('axios');
require('dotenv').config();

const apiRestUrl = process.env.API_REST_URL;

async function createProject(req, res) {
  try {
    const url = `https://${req.body.jiraBaseUrl}.atlassian.net${apiRestUrl}/project`;
    const data = req.body.project;
    const config = {
      headers: { 'Content-Type': 'application/json' },
      auth: {
        username: req.body.userName,
        password: req.body.apiKey
      }
    };

    const response = await axios.post(url, data, config);

    return res.json({ data: response.data });

  } catch (error) {
    console.log(error);
    const errorMessage = error.response.data.errors ?? error.response.data.errorMessages;
    return res.status(500).json(errorMessage);
  }
}

module.exports = createProject;
