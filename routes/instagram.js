const express = require("express");
const router = express.Router();
const axios = require("axios");
const admin = require("../firebase/admin");
const firestore = admin.firestore();
const moment = require("moment");

router.post("/instainfo", async (req, res) => {
  try {
    const { instagram_app_id, instagram_secret, redirect_uri } =
      await JSON.parse(req.secrets.instagram_keys.defaultValue.value);

    const response1 = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      `client_id=${instagram_app_id}&client_secret=${instagram_secret}&grant_type=authorization_code&redirect_uri=${redirect_uri}&code=${req.body.code}`,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const response2 = await axios.get(
      "https://graph.instagram.com/access_token",
      {
        params: {
          grant_type: "ig_exchange_token",
          client_secret: instagram_secret,
          access_token: response1.data.access_token,
        },
      }
    );

    const response3 = await axios.get("https://graph.instagram.com/me", {
      params: {
        fields: "id,username",
        access_token: response2.data.access_token,
      },
    });

    await firestore
      .collection("users")
      .doc(req.body.userId)
      .update({
        "linkedAccounts.Instagram.access_token": response2.data.access_token,
        "linkedAccounts.Instagram.expires_in":
          moment().unix() + response2.data.expires_in,
        "linkedAccounts.Instagram.username": response3.data.username,
        "linkedAccounts.Instagram.instaId": response3.data.id,
      });

    res.send({ success: true });
  } catch (err) {
    res.status(404).send("Oh uh, something went wrong");
  }
});

router.post("/instadata", async (req, res) => {
  const getData = async (username, userId) => {
    try {
      const {
        data: {
          data: { user },
        },
      } = await axios.get(
        `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 105.0.0.11.118 (iPhone11,8; iOS 12_3_1; en_US; en-US; scale=2.00; 828x1792; 165586599)",
          },
        }
      );
      const {
        biography,
        edge_follow,
        edge_followed_by,
        edge_owner_to_timeline_media: { count, edges },
        full_name,
        is_private,
        profile_pic_url,
      } = user;
      const timeline = edges.map(
        ({
          node: {
            edge_liked_by,
            edge_media_to_caption,
            edge_media_to_comment,
            id,
            taken_at_timestamp,
            thumbnail_src,
          },
        }) => {
          return {
            node: {
              edge_liked_by,
              edge_media_to_caption,
              edge_media_to_comment,
              id,
              taken_at_timestamp,
              thumbnail_src,
            },
          };
        }
      );
      const finaldata = {
        details: {
          graphql: {
            user: {
              biography,
              edge_follow,
              edge_followed_by,
              edge_owner_to_timeline_media: { count, edges: timeline },
              full_name,
              is_private,
              profile_pic_url,
            },
          },
        },
      };
      await firestore.collection("users").doc(userId).update({
        "linkedAccounts.Instagram.details": finaldata.details,
      });
      res.send(finaldata);
    } catch (err) {
      res.status(200).send("Use stored data");
    }
  };

  /* Get username */
  const getUsername = async (access_token, userId, oldUsername) => {
    try {
      const {
        data: { username },
      } = await axios.get("https://graph.instagram.com/me", {
        params: {
          fields: "username",
          access_token,
        },
      });
      getData(username, userId);
    } catch (err) {
      getData(oldUsername, userId);
    }
  };

  /* Update accessToken */
  const updateToken = async (oldToken, userId, oldUsername) => {
    try {
      const response = await axios.get(
        "https://graph.instagram.com/refresh_access_token",
        {
          params: {
            grant_type: "ig_refresh_token",
            access_token: oldToken,
          },
        }
      );
      const access_token = response.data.access_token;
      const expires_in = moment().unix() + response.data.expires_in;
      await firestore.collection("users").doc(userId).update({
        "linkedAccounts.Instagram.access_token": access_token,
        "linkedAccounts.Instagram.expires_in": expires_in,
      });
      getUsername(access_token, userId, oldUsername);
    } catch (err) {
      getData(oldUsername, userId);
    }
  };

  /* Get usertoken from db */
  try {
    const userData = await firestore
      .collection("users")
      .doc(req.body.userId)
      .get();

    const instagram = userData.data().linkedAccounts.Instagram;

    if (instagram?.access_token && instagram?.expires_in) {
      if (moment().unix() + 604800 > instagram?.expires_in) {
        getUsername(
          instagram?.access_token,
          req.body.userId,
          instagram?.username
        );
      } else {
        updateToken(
          instagram?.access_token,
          req.body.userId,
          instagram?.username
        );
      }
    } else {
      getData(instagram?.username, req.body.userId);
    }
  } catch (err) {
    res.status(200).send("Use stored data");
  }
});

module.exports = router;
