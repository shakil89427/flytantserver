const express = require("express");
const router = express.Router();
const Twitter = require("twitter");

router.post("/twittersearch", async (req, res) => {
  try {
    const { consumerKey, consumerSecret, token, tokenSecret } =
      await JSON.parse(req.secrets.twitter_tokens.defaultValue.value);
    const client = new Twitter({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      access_token_key: token,
      access_token_secret: tokenSecret,
    });
    const response = await client.get("statuses/user_timeline.json", {
      user_id: req.body.id,
      count: 20,
    });
    res.send(response);
  } catch (err) {
    res.status(404).send("Not found");
  }
});

module.exports = router;
