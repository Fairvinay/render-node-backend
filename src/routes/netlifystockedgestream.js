const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const userId = req.query.userId;
  const roomId = req.query.roomId;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const timerId = setInterval(() => {
    res.write(`data: hello ${userId} in room ${roomId} at ${new Date().toUTCString()}\n\n`);
  }, 1000);

  req.on("close", () => {
    clearInterval(timerId);
  });
});

// SSE endpoint
router.get("/sse", (req, res) => {
  const userId = req.query.userId;
  const roomId = req.query.roomId;

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send a "hello" event every 1 second
  const timerId = setInterval(() => {
    res.write(`data: hello ${userId} in room ${roomId} at ${new Date().toUTCString()}\n\n`);
  }, 1000);

  // Handle client disconnect
  req.on("close", () => {
    clearInterval(timerId);
  });
});



module.exports = router;