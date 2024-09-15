const express = require('express');
const cors = require('cors');
const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

let runs = [];
let routes = [];

// Runs endpoints
app.get('/runs', (req, res) => {
  res.json(runs);
});

app.post('/runs', (req, res) => {
  runs.push(req.body);
  res.json({ status: 'success' });
});

// Routes endpoints
app.get('/routes', (req, res) => {
  res.json(routes);
});

app.post('/routes', (req, res) => {
  routes.push(req.body);
  res.json({ status: 'success' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
