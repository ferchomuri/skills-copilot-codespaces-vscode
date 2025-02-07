// Create web server
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { Configuration, OpenAIApi } = require("openai");
const cors = require('cors');

// Set up CORS
app.use(cors());
// Set up body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Set up static file serving
app.use(express.static(path.join(__dirname, 'public')));
// Set up OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
// Define the API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
// Define the API endpoint
app.post('/api/submit', (req, res) => {
  const { name, email, comment } = req.body;
  const id = uuidv4();
  const timestamp = new Date().toISOString();
  const data = { id, name, email, comment, timestamp };
  fs.readFile('comments.json', (err, fileData) => {
    if (err) {
      console.error('Error reading comments.json:', err);
      return res.status(500).send('Internal Server Error');
    }
    let comments = [];
    try {
      comments = JSON.parse(fileData);
    } catch (parseErr) {
      console.error('Error parsing comments.json:', parseErr);
    }
    comments.push(data);
    fs.writeFile('comments.json', JSON.stringify(comments), (err) => {
      if (err) {
        console.error('Error writing to comments.json:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.status(200).send('Comment submitted successfully');
    });
  });
});
// Define the API endpoint
app.get('/api/comments', (req, res) => {
  fs.readFile('comments.json', (err, data) => {
    if (err) {
      console.error('Error reading comments.json:', err);
      return res.status(500).send('Internal Server Error');
    }
    try {
      const comments = JSON.parse(data);
      res.json(comments);
    } catch (parseErr) {
      console.error('Error parsing comments.json:', parseErr);
      res.status(500).send('Internal Server Error');
    }
  });
});
// Define the API endpoint
app.post('/api/clear', (req, res) => {
  fs.writeFile('comments.json', JSON.stringify([]), (err) => {
    if (err) {
      console.error('Error clearing comments.json:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(200).send('Comments cleared successfully');
  });
});