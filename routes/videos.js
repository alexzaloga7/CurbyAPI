const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
const fs = require("fs");

function readVideoDetailsFile() {
  const videoDetailsFile = fs.readFileSync("./data/video-details.json");
  return JSON.parse(videoDetailsFile);
}

function writeVideoDetailsFile(videos) {
  fs.writeFileSync("./data/video-details.json", JSON.stringify(videos));
}

router.get("/", (req, res) => {
  const videos = readVideoDetailsFile();
  res.json(videos);
});

router.get("/:id", async (req, res) => {
  try {
    const videos = readVideoDetailsFile();
    const videoDetails = videos.find(
      (videoDetails) => videoDetails.id === req.params.id
    );
    if (videoDetails) {
      res.json(videoDetails);
    } else {
      res.status(404).send("Video not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", (req, res) => {
  const videos = readVideoDetailsFile();
  const { title, description, location } = req.body;

  let image = req.files.image;

  image.mv("./public/images/" + image.name, (err) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      const newVideoUpload = {
        id: uuid(),
        title,
        channel: "Mean Girls",
        image: `http://localhost:3001/images/${image.name}`,
        description,
        views: "4",
        likes: "4",
        duration: "4:01",
        video: "https://project-2-api.herokuapp.com/stream",
        timestamp: Date.now(),
        location,
        comments: [
          {
            id: uuid(),
            name: "Gretchen Wieners",
            comment: "That was so fetch",
            likes: 0,
            timestamp: Date.now(),
          },
          {
            id: uuid(),
            name: "Karen Smith",
            comment: "On Wednesdays we wear pink",
            likes: 0,
            timestamp: Date.now(),
          },
          {
            id: uuid(),
            name: "Damian",
            comment: "That’s why her hair is so big. It’s full of secrets.",
            likes: 0,
            timestamp: Date.now(),
          },
        ],
      };
      videos.push(newVideoUpload);

      writeVideoDetailsFile(videos);
      res.status(201).send("New video");
    }
  });
});
module.exports = router;
