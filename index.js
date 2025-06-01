// File: index.js
const express = require('express');
const cors = require('cors');
const { getTranscript } = require('youtube-transcript');

const app = express();
app.use(cors());

app.get('/transcript', async (req, res) => {
  const { url, removeTimestamps } = req.query;
  try {
    const videoId = extractVideoId(url);
    const transcript = await getTranscript(videoId);
    let text = transcript.map(line => removeTimestamps === 'true' ? line.text : `[${line.start.toFixed(1)}s] ${line.text}`).join('\n');
    res.send(text);
  } catch (error) {
    res.status(500).send('Lỗi: Không thể lấy bản chép lời.');
  }
});

function extractVideoId(url) {
  const regex = /(?:v=|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regex);
  if (!match) throw new Error('Không tìm thấy video ID');
  return match[1];
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server chạy ở cổng ${PORT}`));
