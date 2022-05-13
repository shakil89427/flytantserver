const express = require("express");
const router = express.Router();
const axios = require("axios");
const { doc, getFirestore, updateDoc } = require("firebase/firestore");
const db = getFirestore();

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
    const userRef = doc(db, "users", req.body.userId);
    await updateDoc(userRef, {
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
      `https://www.instagram.com/${req.body.username}/channel/?__a=1`
    );
    res.send(response.data);
  } catch (err) {
    res.status(404).send("oh, something went wrong");
  }
});

module.exports = router;
