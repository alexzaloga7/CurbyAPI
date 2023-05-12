const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
const fs = require("fs");

function readItemDetailsFile() {
  const itemDetailsFile = fs.readFileSync("./data/item-details.json");
  return JSON.parse(itemDetailsFile);
}

function writeItemDetailsFile(items) {
  fs.writeFileSync("./data/item-details.json", JSON.stringify(items));
}

router.get("/", (req, res) => {
  const items = readItemDetailsFile();
  res.json(items);
});

router.get("/:id", async (req, res) => {
  try {
    const items = readItemDetailsFile();
    const itemDetails = items.find(
      (itemDetails) => itemDetails.id === req.params.id
    );
    if (itemDetails) {
      res.json(itemDetails);
    } else {
      res.status(404).send("Item not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/:id", (req, res) => {
  const items = readItemDetailsFile();
  const index = items.findIndex((item) => item.id === req.params.id);

  if (index !== -1) {
    items.splice(index, 1);
    writeItemDetailsFile(items);
    res.send(`Item with ID: ${req.params.id} deleted successfully.`);
  } else {
    res
      .status(404)
      .json({ errorMessage: `Item with ID:${req.params.id} not found` });
  }
});

router.post("/", (req, res) => {
  const items = readItemDetailsFile();
  const { title, description, location } = req.body;

  let image = req.files.image;

  image.mv("./public/images/" + image.name, (err) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      const newItemUpload = {
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
      items.push(newItemUpload);

      writeItemDetailsFile(items);
      res.status(201).send("New item");
    }
  });
});
module.exports = router;
