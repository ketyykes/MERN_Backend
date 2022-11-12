const todos = require("./routes/todos");
const signUp = require("./routes/signUp");
const signIn = require("./routes/signIn");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use("/api/todos", todos);
app.use("/api/signup", signUp);
app.use("/api/signin", signIn);

app.get("/", (req, res) => {
  res.send("welcome to our todos api");
});

const connection_string = process.env.CONNECTION_STRING;
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

mongoose
  .connect(connection_string)
  .then((client) => {
    console.log("MongoDB connection established");
  })
  .catch((err) => {
    console.log(err);
    console.error("MongoDB connection failed");
  });
