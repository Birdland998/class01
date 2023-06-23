const line = require('@line/bot-sdk');
const express = require('express');
require('dotenv').config();


const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = new line.Client(config);

const app = express();
const port = process.env.PORT || 3000;

const imageUrls = {
  Monday: 'https://i.pinimg.com/originals/28/81/94/2881949ad8307a58827412d6d7887a84.png',
  Tuesday: 'https://i.pinimg.com/originals/29/46/b0/2946b020979cd113b22653fe8ae91aa4.png',
  Wednesday: 'https://i.pinimg.com/originals/9a/a9/0c/9aa90c15249ffae4dbfca6b3d52052dd.png',
  Thursday: 'https://i.pinimg.com/originals/b2/68/52/b26852700501e21e3e9e72e4b620800b.png',
  Friday: 'https://i.pinimg.com/originals/61/8d/7e/618d7ec95758d204c7518bef80a140e9.png'
};

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.post('/webhook', async (req, res) => {
  const events = req.body.events;
  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userId = event.source.userId;
      const text = event.message.text;
      await processText(userId, text);
    }
  }
  res.sendStatus(200);
});

async function processText(userId, text) {
  const imageUrl = imageUrls[text];
  if (imageUrl) {
    await client.pushMessage(userId, { type: 'image', originalContentUrl: imageUrl, previewImageUrl: imageUrl });
  } else {
    await client.pushMessage(userId, { type: 'text', text: 'Sorry, I cannot send pictures for that request.' });
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
