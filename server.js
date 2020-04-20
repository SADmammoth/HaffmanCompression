import express from 'express';
import path from 'path';

const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(__dirname + '/dist'));
app.use(express.json());

app.get('/input.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/input.txt'));
});

app.get('/encoded.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/encoded.txt'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port);
