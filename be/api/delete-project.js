const axios = require('axios');
require('dotenv').config();

const apiRestUrl = process.env.API_REST_URL;

async function deleteProject(req, res) {
  try {
    const projectKey = req.body.projectKey;
    const url = `${req.body.jiraBaseUrl}${apiRestUrl}/project/${projectKey}`;
    const config = {
      headers: { 'Content-Type': 'application/json' },
      auth: {
        username: req.body.userName,
        password: req.body.apiKey
      }
    };

    const response = await axios.delete(url, config);
    return res.json(response.data);

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

module.exports = deleteProject;
