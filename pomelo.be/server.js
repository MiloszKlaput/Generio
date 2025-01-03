const express = require('express'); //server
const cors = require('cors'); //allows CORS
const axios = require('axios'); //http client

require('dotenv').config();

const port = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cors());

const apiBaseUrl = process.env.API_BASE_URL;
const apiUserName = process.env.API_USER_NAME;
const apiKeyValue = process.env.API_KEY_VALUE;

const auth = {
  username: apiUserName,
  password: apiKeyValue
};

app.post('/issues', async (req, res) => {
  try {
    const config = {
      method: 'post',
      url: `${apiBaseUrl}/issue/bulk`,
      headers: { 'Content-Type': 'application/json' },
      auth: auth,
      data: { issueUpdates: req.body }
    };

    const response = await axios.request(config);
    res.json({ data: response.data });
  } catch (error) {
    res.status(500).json({ error })
  }
});

// test api
app.get('/api', async (req, res) => {
  try {
    const config = {
      method: 'get',
      url: `${apiBaseUrl}/issue/createmeta/KIWI/issuetypes/10003`,
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    };

    const response = await axios.request(config);

    res.json({ data: response.data });
  } catch (error) {
    res.status(500).json({ error })
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
