const axios = require('axios');
require('dotenv').config();

const apiAgileUrl = process.env.API_AGILE_URL;

async function deleteSprintZero(req, res) {
  try {
    const allSprintsUrl = `${req.query.jiraBaseUrl}${apiAgileUrl}/board/${req.query.boardId}/sprint`;
    const config = {
      headers: { 'Content-Type': 'application/json' },
      auth: {
        username: req.query.userName,
        password: req.query.apiKey
      }
    };

    const allSprintsResponse = await axios.get(allSprintsUrl, config);
    const sprintZeroId = allSprintsResponse.data.values[0].id;
    const sprintZeroUrl = `${req.query.jiraBaseUrl}${apiAgileUrl}/sprint/${sprintZeroId}`;

    const response = await axios.delete(sprintZeroUrl, config);

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

module.exports = deleteSprintZero;
