// server
const express = require('express');
// allows CORS
const cors = require('cors');

const axios = require('axios');
require('dotenv').config();

const testApi = require('./api/test-api.js');
const createProject = require('./api/create-project.js');
const getSprintZero = require('./api/get-sprint-zero.js');
const createSprint = require('./api/create-sprint.js');
const createIssues = require('./api/create-issues.js');

const port = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cors());

app.get('/test-api', (req, res) => testApi(req, res));
app.post('/create-project', (req, res) => createProject(req, res));
app.get('/get-sprint-zero', (req, res) => getSprintZero(req, res));
app.post('/create-sprint', (req, res) => createSprint(req, res));
app.post('/create-issues', (req, res) => createIssues(req, res));

app.listen(port, () => console.log(`Server is running on port ${port}`));
