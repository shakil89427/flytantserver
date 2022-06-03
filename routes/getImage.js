const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/getimage", async (req, res) => {
  try {
    const { data } = await axios.get(req.body.url, {
      responseType: "arraybuffer",
    });
    const image = Buffer.from(data, "binary").toString("base64");
    res.send({ image });
  } catch (err) {
    res.status(404).send("Not Found");
  }
});

module.exports = router;
