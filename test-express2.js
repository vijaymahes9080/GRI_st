const express = require('express');
const app = express();
app.get('/api/health', (req, res) => { console.log('health'); res.end(); });
app.get('*all', (req, res) => { console.log('catchall ' + req.url); res.end(); });
app.listen(3003, () => {
  const http = require('http');
  http.get('http://localhost:3003/', (res) => {
    console.log('Status:', res.statusCode);
    process.exit(0);
  });
});
