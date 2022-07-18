const express = require("express");
const router = express.Router();
const axios = require("axios");
const moment = require("moment");

router.post("/influencersinstagram", async (req, res) => {
  /* Fetch Images */
  const getImage = async (url, updatedData) => {
    try {
      const { data } = await axios.get(url, {
        responseType: "arraybuffer",
      });
      const image = Buffer.from(data, "binary").toString("base64");
      updatedData.image = image;
      res.send(updatedData);
    } catch (err) {
      res.send(updatedData);
    }
  };

  /* Modify Data */
  const modifyData = (user) => {
    let totalLikes = 0;
    let totalComments = 0;
    let totalPost = 0;
    let dates = [];
    let postPerWeek = 0;
    user?.edge_owner_to_timeline_media.edges?.forEach((item) => {
      try {
        const { edge_liked_by, edge_media_to_comment, taken_at_timestamp } =
          item?.node;
        totalLikes = totalLikes + edge_liked_by.count;
        totalComments = totalComments + edge_media_to_comment.count;
        totalPost++;
        dates.push(taken_at_timestamp);
      } catch (err) {}
    });

    try {
      if (dates?.length > 0) {
        const first = moment.unix(dates[dates?.length - 1]);
        const last = moment.unix(dates[0]);
        const duration = last.diff(first, "milliseconds");
        postPerWeek = Math.round((totalPost * 604800000) / duration);
      }
    } catch (err) {}
    const updatedData = {
      following: user?.edge_follow?.count,
      followers: user?.edge_followed_by?.count,
      totalLikes,
      totalComments,
      totalPost,
      postPerWeek,
      image: "",
    };
    getImage(user?.profile_pic_url, updatedData);
  };

  /* Fetch Data */
  const fetchData = async () => {
    try {
      const {
        data: {
          data: { user },
        },
      } = await axios.get(
        `https://i.instagram.com/api/v1/users/web_profile_info/?username=${req.body.username}`,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 105.0.0.11.118 (iPhone11,8; iOS 12_3_1; en_US; en-US; scale=2.00; 828x1792; 165586599)",
          },
        }
      );
      modifyData(user);
    } catch (err) {
      res.status(404).send("Not found");
    }
  };

  /* Run fetch */
  fetchData();
});

module.exports = router;
