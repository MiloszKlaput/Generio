const express = require('express'); //server
const cors = require('cors'); //allows CORS
const axios = require('axios'); //http client

require('dotenv').config();

const port = process.env.PORT || 8000;

const app = express();

app.use(cors());

const apiBaseUrl = process.env.API_BASE_URL;
const apiUserName = process.env.API_USER_NAME;
const apiKeyValue = process.env.API_KEY_VALUE;

const authorization = btoa(`${apiUserName}:${apiKeyValue}`);

app.get('/api', async (req, res) => {
  try {
    const config = {
      method: 'get',
      url: `${apiBaseUrl}/issue/SCRUM-1`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authorization}`
      }
    };

    const response = await axios.request(config);

    res.json({ data: response.data });
  } catch (error) {
    res.status(500).json({ error })
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
