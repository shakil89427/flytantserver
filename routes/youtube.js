const express = require("express");
const router = express.Router();
const axios = require("axios");
const admin = require("../firebase/admin");
const firestore = admin.firestore();

router.post("/youtubeinfo", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        headers: { Authorization: `Bearer ${req.body.token}` },
        params: {
          part: "id",
          mine: true,
        },
      }
    );
    await firestore
      .collection("users")
      .doc(req.body.userId)
      .update({
        ["linkedAccounts.Youtube"]: { channelId: response.data.items[0].id },
      });
    res.send({ success: true });
  } catch (err) {
    res.status(404).send("Oh uh, something went wrong");
  }
});

router.post("/youtubedata", async (req, res) => {
  try {
    const { api_key } = await JSON.parse(
      req.secrets.youtube_keys.defaultValue.value
    );

    const response1 = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        params: {
          id: req.body.channelId,
          part: "snippet,statistics",
          key: api_key,
        },
      }
    );

    const response2 = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "id",
          channelId: req.body.channelId,
          maxResults: 50,
          order: "date",
          type: "video",
          key: api_key,
        },
      }
    );

    if (response2?.data?.items?.length > 0) {
      const videoIds = response2.data.items.map((item) => item.id.videoId);
      const response3 = await axios.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {
          params: {
            part: "snippet,statistics,player,contentDetails",
            id: videoIds.toString(),
            key: api_key,
          },
        }
      );
      res.send({
        ...response1.data.items[0],
        videos: response3.data.items,
      });
    } else {
      res.send({ ...response1.data.items[0], videos: [] });
    }
  } catch (err) {
    res.status(404).send("Oh, something went wrong");
  }
});

module.exports = router;
