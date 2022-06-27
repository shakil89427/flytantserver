const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/instagramsearch", async (req, res) => {
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
      biography,
      edge_follow,
      edge_followed_by,
      edge_owner_to_timeline_media: { count, edges: timeline },
      full_name,
      is_private,
      profile_pic_url,
    };
    res.send(finaldata);
  } catch (err) {
    res.status(404).send("Not found");
  }
});

module.exports = router;
