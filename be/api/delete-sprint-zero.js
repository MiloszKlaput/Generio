const axios = require('axios');
require('dotenv').config();

const apiAgileUrl = process.env.API_AGILE_URL;

async function deleteSprintZero(req, res) {
  try {
    const allSprintsUrl = `https://${req.query.jiraBaseUrl}.atlassian.net${apiAgileUrl}/board/${req.query.boardId}/sprint`;
    const config = {
      headers: { 'Content-Type': 'application/json' },
      auth: {
        username: req.query.userName,
        password: req.query.apiKey
      }
    };

    const allSprintsResponse = await axios.get(allSprintsUrl, config);
    const sprintZeroId = allSprintsResponse.data.values[0].id;
    const sprintZeroUrl = `https://${req.query.jiraBaseUrl}.atlassian.net${apiAgileUrl}/sprint/${sprintZeroId}`;

    const response = await axios.delete(sprintZeroUrl, config);

    return res.json({ data: response.data });

  } catch (error) {
    console.log(error);
    const errorMessage = error.response.data.errors ?? error.response.data.errorMessages;
    return res.status(500).json(errorMessage);
  }
}

module.exports = deleteSprintZero;
