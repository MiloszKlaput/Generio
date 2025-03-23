const axios = require('axios');
require('dotenv').config();

const apiAgileUrl = process.env.API_AGILE_URL;

async function updateSprint(req, res) {
  try {
    const {
      jiraBaseUrl,
      userName,
      apiKey,
      sprintId,
      state,
      name,
      startDate,
      endDate
    } = req.body;

    const url = `${jiraBaseUrl}${apiAgileUrl}/sprint/${sprintId}`;
    const data = { name, state, startDate, endDate };
    const config = {
      headers: { 'Content-Type': 'application/json' },
      auth: {
        username: userName,
        password: apiKey
      }
    };

    // Jeżeli chcemy przełęczyć sprint state na closed
    // Musimy najpierw ustawić active
    // Dopiero za drugim razem ustawić closed
    if (data.state === 'closed') {
      data.state = 'active';
      await axios.put(url, data, config);

      data.state = 'closed';
      const response = await axios.put(url, data, config);

      return res.json({ data: response.data });
    }

    const response = await axios.put(url, data, config);
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

module.exports = updateSprint;
