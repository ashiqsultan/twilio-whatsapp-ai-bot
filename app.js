require('dotenv').config();
const express = require('express');
const waHandler = require('./functions/wa');
const app = express();
const port = 3000;
const { MessagingResponse } = require('twilio').twiml;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/wa', async (req, res) => {
  console.log('req.body', req.body);
  const message = await waHandler(req.body);
  const twiml = new MessagingResponse();
  twiml.message(message);
  res.set('Content-Type', 'text/xml');
  res.send(twiml.toString()).status(200);
});

app.listen(port, () => {
  console.log(`App listening at port: ${port}`);
});
