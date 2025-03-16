// server
const express = require('express');
// allows CORS
const cors = require('cors');

const createProject = require('./api/create-project.js');
const getBoardId = require('./api/get-board-id.js');
const createSprint = require('./api/create-sprint.js');
const createIssues = require('./api/create-issues.js');
const moveIssuesToSprint = require('./api/move-issues-to-sprint.js');
const moveIssuesToEpic = require('./api/move-issues-to-epic.js');
const deleteProject = require('./api/delete-project.js');
const deleteSprintZero = require('./api/delete-sprint-zero.js');

const port = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cors());

app.post('/create-project', (req, res) => createProject(req, res));
app.get('/get-board-id', (req, res) => getBoardId(req, res));
app.post('/create-sprint', (req, res) => createSprint(req, res));
app.post('/create-issues', (req, res) => createIssues(req, res));
app.post('/move-issues-to-epic', (req, res) => moveIssuesToEpic(req, res));
app.post('/move-issues-to-sprint', (req, res) => moveIssuesToSprint(req, res));
app.post('/delete-project', (req, res) => deleteProject(req, res));
app.get('/delete-sprint-zero', (req, res) => deleteSprintZero(req, res));

app.listen(port, () => console.log(`Server is running on port ${port}`));
