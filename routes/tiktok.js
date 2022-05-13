const express = require("express");
const router = express.Router();
const axios = require("axios");
const { doc, getFirestore, getDoc, updateDoc } = require("firebase/firestore");
const db = getFirestore();

router.post("/tiktokinfo", async (req, res) => {
  try {
    const response = await axios.post(
      "https://open-api.tiktok.com/oauth/access_token",
      `client_key=${process.env.TIKTOK_CLIENT_KEY}&grant_type=authorization_code&client_secret=${process.env.TIKTOK_CLIENT_SECRET}&code=${req.body.code}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const expires_in = Date.now() + response.data.data.expires_in * 1000;
    const userRef = doc(db, "users", req.body.userId);
    await updateDoc(userRef, {
      ["linkedAccounts.Tiktok"]: { ...response.data.data, expires_in },
    });
    res.send({ success: true });
  } catch (err) {
    res.status(404).send("Oh, something went wrong");
  }
});

/* Get tiktok data */
router.post("/tiktokdata", async (req, res) => {
  const userRef = doc(db, "users", req?.body?.userId);

  // get user data
  const getData = async (open_id, access_token) => {
    try {
      const response = await axios.post(
        "https://open-api.tiktok.com/user/info/",
        {
          open_id,
          access_token,
          fields: [
            "open_id",
            "union_id",
            "avatar_url",
            "avatar_url_100",
            "avatar_url_200",
            "avatar_large_url",
            "display_name",
          ],
        }
      );
      const response2 = await axios.post(
        "https://open-api.tiktok.com/video/list",
        {
          open_id,
          access_token,
          fields: [
            "like_count",
            "comment_count",
            "share_count",
            "view_count",
            "title",
            "cover_image_url",
            "video_description",
            "id",
          ],
        }
      );
      res.send({
        ...response?.data?.data?.user,
        videos: response2?.data?.data?.videos || [],
      });
    } catch (err) {
      res.status(404).send("Oh, something went wrong");
    }
  };

  // get tokens
  const loadTokens = async (refresh_token) => {
    try {
      const response3 = await axios.post(
        "https://open-api.tiktok.com/oauth/refresh_token",
        `refresh_token=${refresh_token}&client_key=${process.env.TIKTOK_CLIENT_KEY}&grant_type=refresh_token`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const expires_in = Date.now() + response3.data.data.expires_in * 1000;
      await updateDoc(userRef, {
        ["linkedAccounts.Tiktok"]: { ...response3.data.data, expires_in },
      });
      const { open_id, access_token } = response3.data.data;
      getData(open_id, access_token);
    } catch (err) {
      res.status(401).send("Authentication required");
    }
  };

  // get user info
  const getUser = async () => {
    try {
      const userData = await getDoc(userRef);
      const { expires_in, access_token, refresh_token, open_id } =
        userData.data().linkedAccounts.Tiktok;
      if (Date.now() + 300000 >= expires_in) {
        loadTokens(refresh_token);
      } else {
        getData(open_id, access_token);
      }
    } catch (err) {
      res.status(404).send("Oh, something went wrong");
    }
  };
  getUser();
});

module.exports = router;
