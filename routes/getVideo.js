const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/getvideo", async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://player.vimeo.com/video/${req.body.videoId}/config`
    );
    res.send(data);
  } catch (err) {
    res.status(404).send("Not Found");
  }
});

module.exports = router;
