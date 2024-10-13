const express = require('express');

import cors from 'cors';
import './index.css';
const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

let runs = [
  { id: 1, distance: 5.0, route: 'Park Route', date: '2024-09-17', time: '45' },
  { id: 2, distance: 3.5, route: 'Beach Route', date: '2024-09-16', time: '30' }
];


let routes = [
  { id: 1, name: 'Park Route', distance: 5.0 },
  { id: 2, name: 'Beach Route', distance: 3.5 }
];


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
