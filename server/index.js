require("dotenv").config();
const express = require("express");
const { connectToMongoDB, disconnectFromMongoDB } = require("./database"); // Import disconnect
const path = require('path');

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

// Import and use routes
const router = require("./routes");
app.use("/api", router);

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    console.log("Starting server..."); // Added log
    await connectToMongoDB();
    console.log("MongoDB connection successful."); // Added log
    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    console.log("Server listening..."); // Added log

    // Handle server close events.
    process.on('SIGINT', async () => {
      console.log('SIGINT signal received: closing HTTP server');
      server.close(async () => {
        console.log('HTTP server closed');
        await disconnectFromMongoDB();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error("Server startup error:", error); // Enhanced log
    process.exit(1); // Exit on failure
  }
};

startServer();