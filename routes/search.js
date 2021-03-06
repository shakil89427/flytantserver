const express = require("express");
const router = express.Router();
const axios = require("axios");
const { randomUUID } = require("crypto");
const Twitter = require("twitter");

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
          category: "Instagram",
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
          category: "Youtube",
          channelId,
          description,
          thumbnails,
          channelTitle,
        });
      } catch (err) {}
    });
  };

  const modifyTwitter = (items) => {
    items?.forEach((item) =>
      allData.push({ randomId: randomUUID(), category: "Twitter", ...item })
    );
  };

  /* Search for data */
  const searchData = async () => {
    const promises = [];
    const { cx, api_key } = await JSON.parse(
      req.secrets.google_search_keys.defaultValue.value
    );
    const youtubeKeys = await JSON.parse(
      req.secrets.youtube_keys.defaultValue.value
    );
    const { consumerKey, consumerSecret, token, tokenSecret } =
      await JSON.parse(req.secrets.twitter_tokens.defaultValue.value);

    const instagram = axios.get("https://www.googleapis.com/customsearch/v1", {
      params: {
        q: keyword,
        cx,
        key: api_key,
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
        key: youtubeKeys.api_key,
      },
    });

    const client = new Twitter({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      access_token_key: token,
      access_token_secret: tokenSecret,
    });
    const twitter = await client.get("users/search.json", { q: keyword });

    promises.push(instagram, youtube, twitter);

    try {
      const response = await Promise.allSettled(promises);
      response.forEach((item, index) => {
        if (item?.status === "fulfilled" && index === 0) {
          modifyInstagram(item?.value?.data?.items);
        }
        if (item?.status === "fulfilled" && index === 1) {
          modifyYoutube(item?.value?.data?.items);
        }
        if (item?.status === "fulfilled" && index === 2) {
          modifyTwitter(item?.value);
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
