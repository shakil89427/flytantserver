const express = require("express");
const router = express.Router();
const axios = require("axios");
const firestore = require("../firebase/firestore");
const moment = require("moment");

router.post("/twitterinfo", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.twitter.com/2/oauth2/token",
      `client_id=${process.env.TWITTER_OAUTH2_CLIENT_ID}&grant_type=authorization_code&redirect_uri=${process.env.TWITTER_REDIRECT_URI}&code=${req.body.code}&code_verifier=challenge`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const expires_in = moment().unix() + response.data.expires_in;
    await firestore
      .collection("users")
      .doc(req.body.userId)
      .update({
        ["linkedAccounts.Twitter"]: { ...response.data, expires_in },
      });

    res.send({ success: true });
  } catch (err) {
    res.status(404).send("Oh, something went wrong");
  }
});

router.post("/twitterdata", async (req, res) => {
  // load user twitter data
  const getData = async (access_token) => {
    try {
      const response = await axios.get("https://api.twitter.com/2/users/me", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          "user.fields":
            "description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld",
        },
      });
      const response2 = await axios.get(
        `https://api.twitter.com/2/users/${response.data.data.id}/tweets`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          params: {
            expansions: "attachments.media_keys",
            "media.fields": "media_key,type,url",
            "tweet.fields": "attachments,created_at,public_metrics",
          },
        }
      );
      const tweets = response2?.data?.data;
      const media = response2?.data?.includes?.media;
      res.send({ ...response.data.data, tweets, media });
    } catch (err) {
      res.status(404).send("Oh, something went wrong");
    }
  };

  // get user token
  const loadTokens = async (refresh_token) => {
    try {
      const response3 = await axios.post(
        "https://api.twitter.com/2/oauth2/token",
        `refresh_token=${refresh_token}&grant_type=refresh_token&client_id=${process.env.TWITTER_OAUTH2_CLIENT_ID}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const expires_in = moment().unix() + response3.data.expires_in;
      await firestore
        .collection("users")
        .doc(req.body.userId)
        .update({
          ["linkedAccounts.Twitter"]: { ...response3.data, expires_in },
        });
      getData(response3.data.access_token);
    } catch (err) {
      res.status(401).send("Authentication required");
    }
  };

  // Get user initial info
  const getUser = async () => {
    try {
      const userData = await firestore
        .collection("users")
        .doc(req.body.userId)
        .get();
      const { expires_in, access_token, refresh_token } =
        userData.data().linkedAccounts.Twitter;
      if (moment().unix() + 120 >= expires_in) {
        loadTokens(refresh_token);
      } else {
        getData(access_token);
      }
    } catch (err) {
      res.status(404).send("Oh, something went wrong");
    }
  };
  getUser();
});

module.exports = router;
