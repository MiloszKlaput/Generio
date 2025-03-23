const axios = require('axios');
require('dotenv').config();

const apiRestUrl = process.env.API_REST_URL;

async function createProject(req, res) {
  try {
    const url = `${req.body.jiraBaseUrl}${apiRestUrl}/project`;
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
    console.error('Error occurred: ', error.message);

    let errorMessage = 'Wystąpił nieznany błąd.';
    if (error.response) {
      errorMessage = error.response.data?.errors || error.response.data?.errorMessages || error.response.data || errorMessage;
    } else if (error.request) {
      errorMessage = 'Brak odpowiedzi z Jira API.';
    }

    return res.status(500).json({ error: errorMessage });
  }
}

module.exports = createProject;
