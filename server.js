const PORT = process.env.PORT || 8080; // If process.env.PORT is undefined, fall back to 8080

const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(
  cors({
    origin: "https://sse-example.webflow.io",
  })
);

// Middleware to parse JSON POST requests
app.use(express.json());

// Store connected clients
const clients = [];

app.get("/events", (req, res) => {
  // Set headers to establish an SSE connection
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://sse-example.webflow.io"
  );
  res.flushHeaders();

  // Send an initial event
  const welcomeData = JSON.stringify({ message: "Welcome to the SSE server!" });
  res.write(`data: ${welcomeData}\n\n`);

  // Add this client to the clients list
  clients.push(res);

  // If the client closes the connection, remove them from the clients list
  req.on("close", () => {
    const index = clients.indexOf(res);
    if (index !== -1) {
      clients.splice(index, 1);
    }
    res.end();
  });
});

app.post("/send-message", (req, res) => {
  const token = req.headers.authorization;

  if (!token || token !== `Bearer ${process.env.TOKEN}`) {
    return res.status(403).json({ error: "Invalid token" });
  }

  // Get all fields from the POST request
  const { alert, message, link } = req.body;

  // Convert the fields into a JSON string
  const dataToSend = JSON.stringify({ alert, message, link });

  // Broadcast the received data to all connected clients
  clients.forEach((clientRes) => {
    clientRes.write(`data: ${dataToSend}\n\n`);
  });

  res.json({ status: "Message sent to all clients" });
});

app.listen(8080, () => {
  console.log("Server started on http://localhost:8080");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
