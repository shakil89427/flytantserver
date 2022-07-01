const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/getvideo", async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://player.vimeo.com/video/${req.body.videoId}/config`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 105.0.0.11.118 (iPhone11,8; iOS 12_3_1; en_US; en-US; scale=2.00; 828x1792; 165586599)",
        },
      }
    );
    console.log(data);
    res.send(data);
  } catch (err) {
    res.status(404).send("Not Found");
  }
});

module.exports = router;
