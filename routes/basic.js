const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/basic", async (req, res) => {
  try {
    const response = await axios.get(
      `https://geolocation-db.com/json/${req.body.ip}`
    );
    res.send(response.data);
  } catch (err) {
    res.status(404).send("Not found");
  }
});

module.exports = router;
