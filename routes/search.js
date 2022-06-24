const express = require("express");
const router = express.Router();
const axios = require("axios");
const { randomUUID } = require("crypto");

router.post("/search", async (req, res) => {
  const keyword = req?.body?.keyword;
  const allData = [];

  /* Modify instagram data */
  const modifyInstagram = (items) => {
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
        allData.push({
          randomId: randomUUID(),
          category: "instagram",
          bio,
          profileImage,
          username,
          followers,
          following,
        });
      } catch (err) {}
    });
  };

  const modifyYoutube = (items) => {
    items?.forEach((item) => {
      try {
        const {
          snippet: { channelId, description, thumbnails, channelTitle },
        } = item;
        allData.push({
          randomId: randomUUID(),
          category: "youtube",
          channelId,
          description,
          thumbnails,
          channelTitle,
        });
      } catch (err) {}
    });
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

    promises.push(instagram, youtube);

    try {
      const response = await Promise.allSettled(promises);
      response.forEach((item, index) => {
        if (item?.status === "fulfilled" && index === 0) {
          modifyInstagram(item?.value?.data?.items);
        }
        if (item?.status === "fulfilled" && index === 1) {
          modifyYoutube(item?.value?.data?.items);
        }
      });
      res.send(allData);
    } catch (err) {
      res.status(404).send("Something went wrong");
    }
  };

  /* Check keyword exist or not */
  if (keyword && keyword?.length > 0) {
    searchData();
  } else {
    res.status(404).send("Please send any keyword");
  }
});

module.exports = router;
