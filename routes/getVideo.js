const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/getvideo", async (req, res) => {
  try {
    const {
      data: {
        request: {
          files: { progressive },
        },
      },
    } = await axios.get(
      `https://player.vimeo.com/video/${req.body.videoId}/config`
    );
    res.send(progressive);
  } catch (err) {
    res.status(404).send("Not Found");
  }
});

module.exports = router;
