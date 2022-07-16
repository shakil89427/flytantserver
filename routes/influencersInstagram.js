const express = require("express");
const router = express.Router();
const axios = require("axios");
const moment = require("moment");

router.post("/influencersinstagram", async (req, res) => {
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
    const {
      edge_follow,
      edge_followed_by,
      edge_owner_to_timeline_media: { edges },
      profile_pic_url,
    } = user;

    let totalLikes = 0;
    let totalComments = 0;
    let totalPost = 0;
    let dates = [];
    let postPerWeek = 0;

    edges.forEach(
      ({
        node: { edge_liked_by, edge_media_to_comment, taken_at_timestamp },
      }) => {
        totalLikes = totalLikes + edge_liked_by.count;
        totalComments = totalComments + edge_media_to_comment.count;
        totalPost++;
        dates.push(taken_at_timestamp);
      }
    );

    if (dates?.length > 0) {
      const first = moment.unix(dates[dates?.length - 1]);
      const last = moment.unix(dates[0]);
      const duration = last.diff(first, "milliseconds");
      postPerWeek = Math.round((totalPost * 604800000) / duration);
    }

    const { data } = await axios.get(profile_pic_url, {
      responseType: "arraybuffer",
    });
    const image = Buffer.from(data, "binary").toString("base64");
    const finaldata = {
      following: edge_follow.count,
      followers: edge_followed_by.count,
      totalLikes,
      totalComments,
      totalPost,
      postPerWeek,
      image,
    };
    res.send(finaldata);
  } catch (err) {
    res.status(404).send("Not found");
  }
});

module.exports = router;
