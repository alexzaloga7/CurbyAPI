require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("welcome to /");
});

app.listen(8080, () => {
  console.log(`Server started on port 8080`);
});
