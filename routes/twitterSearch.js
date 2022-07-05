const express = require("express");
const router = express.Router();
const Twitter = require("twitter");

router.post("/twittersearch", async (req, res) => {
  /* Get Tweets */
  const getTweets = async (
    consumerKey,
    consumerSecret,
    token,
    tokenSecret,
    userData
  ) => {
    try {
      const client = new Twitter({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        access_token_key: token,
        access_token_secret: tokenSecret,
      });

      const response = await client.get(
        `https://api.twitter.com/2/users/${userData.id}/tweets`,
        {
          expansions: "attachments.media_keys",
          "media.fields": "media_key,type,url",
          "tweet.fields": "attachments,created_at,public_metrics",
        }
      );
      const tweets = response?.data;
      const media = response?.includes?.media;
      res.send({ ...userData, tweets, media });
    } catch (err) {
      res.status(404).send("Not found");
    }
  };

  /* Get Userdata */
  const getUserData = async (
    consumerKey,
    consumerSecret,
    token,
    tokenSecret
  ) => {
    try {
      const client = new Twitter({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        access_token_key: token,
        access_token_secret: tokenSecret,
      });

      const response = await client.get(
        `https://api.twitter.com/2/users/by/username/${req.body.username}`,
        {
          "user.fields":
            "description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld",
        }
      );
      getTweets(consumerKey, consumerSecret, token, tokenSecret, response.data);
    } catch (err) {
      res.status(404).send("Not found");
    }
  };

  /* Get tokens */
  try {
    const { consumerKey, consumerSecret, token, tokenSecret } =
      await JSON.parse(req.secrets.twitter_tokens.defaultValue.value);
    getUserData(consumerKey, consumerSecret, token, tokenSecret);
  } catch (err) {
    res.status(404).send("Not found");
  }
});

module.exports = router;
