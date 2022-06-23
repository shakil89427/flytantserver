const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/search", async (req, res) => {
  const keyword = req?.body?.keyword;

  /* Modify instagram data */
  const modifyInstagram = (items) => {
    let temp = [];
    items?.forEach((item) => {
      try {
        const metatags = item.pagemap.metatags[0];
        const bio = item.snippet
          .toLowerCase()
          .includes?.("see instagram photos and videos from")
          ? ""
          : item.snippet;
        const profileImage = metatags["og:image"];
        const username = metatags["og:url"]
          .split("https://www.instagram.com/")[1]
          .split("/")[0];
        const followers = parseInt(
          metatags["og:description"]
            .toLowerCase()
            .split("followers")[0]
            .replace(/\D/g, "")
        );
        const following = parseInt(
          metatags["og:description"]
            .toLowerCase()
            .split("followers")[1]
            .split("following")[0]
            .replace(/\D/g, "")
        );
        temp.push({ bio, profileImage, username, followers, following });
      } catch (err) {}
    });
    return temp;
  };

  const modifyYoutube = (items) => {
    let temp = [];
    items?.forEach((item) => {
      try {
        const {
          etag,
          snippet: {
            publishedAt,
            channelId,
            title,
            description,
            thumbnails,
            channelTitle,
            liveBroadcastContent,
            publishTime,
          },
        } = item;
        temp.push({
          etag,
          publishedAt,
          channelId,
          title,
          description,
          thumbnails,
          channelTitle,
          liveBroadcastContent,
          publishTime,
        });
      } catch (err) {}
    });
    return temp;
  };

  /* Search for data */
  const searchData = async () => {
    const promises = [];
    const instagram = axios.get("https://www.googleapis.com/customsearch/v1", {
      params: {
        q: keyword,
        cx: process.env.GOOGLE_SEARCH_CX,
        key: process.env.GOOGLE_SEARCH_API_KEY,
      },
    });
    const youtube = axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        q: keyword,
        part: "id,snippet",
        channelType: "any",
        order: "rating",
        type: "channel",
        maxResults: 50,
        key: process.env.GOOGLE_API_KEY,
      },
    });
    const twitter = axios.get("http://api.twitter.com/1.1/users/search.json", {
      params: {
        q: keyword,
        page: 1,
      },
    });

    promises.push(instagram, youtube, twitter);

    try {
      const response = await Promise.allSettled(promises);
      let allData = {};
      response.forEach((item, index) => {
        if (item?.status === "fulfilled" && index === 0) {
          allData.instagram = modifyInstagram(item?.value?.data?.items);
        }
        if (item?.status === "fulfilled" && index === 1) {
          allData.youtube = modifyYoutube(item?.value?.data?.items);
        }
        if (item?.status === "fulfilled" && index === 2) {
          allData.twitter = item?.value?.data;
        }
      });
      res.send(allData);
    } catch (err) {
      res.status(404).send("Something went wrong");
    }
  };

  /* Check keyword present or not */
  if (keyword && keyword?.length > 0) {
    searchData();
  } else {
    res.status(404).send("Please send any keyword");
  }
});

module.exports = router;
