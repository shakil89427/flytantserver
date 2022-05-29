const express = require("express");
const router = express.Router();
const axios = require("axios");
const firestore = require("../firebase/firestore");

router.post("/instainfo", async (req, res) => {
  try {
    const response1 = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      `client_id=${process.env.INSTAGRAM_CLIENT_ID}&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&grant_type=authorization_code&redirect_uri=${process.env.INSTAGRAM_REDIRECT_URI}&code=${req.body.code}`,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const response2 = await axios.get("https://graph.instagram.com/me", {
      params: {
        fields: "id,username",
        access_token: response1.data.access_token,
      },
    });
    const userInfo = {
      username: response2.data.username,
      instaId: response2.data.id,
    };
    await firestore
      .collection("users")
      .doc(req.body.userId)
      .update({
        ["linkedAccounts.Instagram"]: userInfo,
      });

    res.send({ success: true });
  } catch (err) {
    res.status(404).send("Oh uh, something went wrong");
  }
});

router.post("/instadata", async (req, res) => {
  try {
    const response = await axios.get(
      `https://www.instagram.com/${req.body.username}/?__a=1`
    );
    const temp = response.data
      .split("window._sharedData = ")[1]
      .split(";</script>")[0];
    const valid = JSON.parse(temp).entry_data;
    res.send(valid);
  } catch (err) {
    res.status(200).send("Temporary 200 for keep good flow on frontend");
  }
});

module.exports = router;
