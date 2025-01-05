const express = require('express'); //server
const cors = require('cors'); //allows CORS
const axios = require('axios'); //http client

require('dotenv').config();

const port = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cors());

const apiBaseUrl = process.env.API_BASE_URL;
const apiRestUrl = apiBaseUrl + process.env.API_REST_URL;
const apiAgileUrl = apiBaseUrl + process.env.API_AGILE_URL;
const apiUserName = process.env.API_USER_NAME;
const apiKeyValue = process.env.API_KEY_VALUE;
const leadAccountId = process.env.LEAD_ACCOUNT_ID;

const auth = {
  username: apiUserName,
  password: apiKeyValue
};

// create project
app.post('/create-project', async (req, res) => {
  req.body.leadAccountId = leadAccountId;
  try {
    const config = {
      method: 'post',
      url: `${apiRestUrl}/project`,
      headers: { 'Content-Type': 'application/json' },
      auth: auth,
      data: req.body
    };

    const response = await axios.request(config);
    res.json({ data: response.data });
  } catch (error) {
    res.status(500).json(error.response.data.errors)
    console.log(error.response.data.errors);
  }
});

// get sprint zero
app.get('/get-sprint-zero', async (req, res) => {
  try {
    const boardsConfig = {
      method: 'get',
      url: `${apiAgileUrl}/board`,
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    };

    const boardZeroResponse = await axios.request(boardsConfig);
    const boardZeroId = boardZeroResponse.data.values[0].id;

    const sprintZeroConfig = {
      method: 'get',
      url: `${apiAgileUrl}/board/${boardZeroId}/sprint`,
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    };

    const response = await axios.request(sprintZeroConfig);
    const sprintZero = response.data.values[0];

    res.json({ data: sprintZero });
  } catch (error) {
    res.status(500).json(error.response.data.errors)
    console.log(error.response.data.errors);
  }
});

// create sprint
app.post('/create-sprint', async (req, res) => {
  try {
    const config = {
      method: 'post',
      url: `${apiAgileUrl}/sprint`,
      headers: { 'Content-Type': 'application/json' },
      auth: auth,
      data: req.body
    };

    const response = await axios.request(config);
    res.json({ data: response.data });
  } catch (error) {
    res.status(500).json(error.response.data.errors)
    console.log(error.response.data.errors);
  }
});

// create issues
app.post('/create-issues', async (req, res) => {
  try {
    const config = {
      method: 'post',
      url: `${apiRestUrl}/issue/bulk`,
      headers: { 'Content-Type': 'application/json' },
      auth: auth,
      data: { issueUpdates: req.body }
    };

    const response = await axios.request(config);
    res.json({ data: response.data });
  } catch (error) {
    res.status(500).json(error.response.data.errors)
    console.log(error.response.data.errors);
  }
});

// test api
app.get('/test-api', async (req, res) => {
  try {
    const config = {
      method: 'get',
      url: `${apiRestUrl}/issue/createmeta/KIWI/issuetypes/10003`,
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    };

    const response = await axios.request(config);

    res.json({ data: response.data });
  } catch (error) {
    res.status(500).json(error.response.data.errors)
    console.log(error.response.data.errors);
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
