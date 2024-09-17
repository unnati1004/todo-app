// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const todoRoutes = require("./route/todoRoute"); // Import the routes

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection URL
const url = "mongodb+srv://unnatigandhi999:rE2NN7XyfQKgCuqR@cluster0.xwl7u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB using mongoose
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Use the todo routes
app.use("/api", todoRoutes);

// Example route
app.get("/message", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// Start the server
app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
