const videodetails = require("./data/video-details.json");
const videoRoutes = require("./routes/videos");
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const port = process.env.PORT || process.argv[2] || 3001;
const path = require("path");
const fileupload = require("express-fileupload");

app.use(cors());
app.use(express.json());
app.use(fileupload());
app.use(express.static(path.join(__dirname, "public")));

app.use("/videos", videoRoutes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
