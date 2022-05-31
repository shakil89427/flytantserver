const express = require("express");
const router = express.Router();
const axios = require("axios");
const firestore = require("../firebase/firestore");
const puppeteer = require("puppeteer");
const moment = require("moment");

router.post("/instainfo", async (req, res) => {
  try {
    const response1 = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      `client_id=${process.env.INSTAGRAM_CLIENT_ID}&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&grant_type=authorization_code&redirect_uri=${process.env.INSTAGRAM_REDIRECT_URI}&code=${req.body.code}`,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const response2 = await axios.get(
      "https://graph.instagram.com/access_token",
      {
        params: {
          grant_type: "ig_exchange_token",
          client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
          access_token: response1.data.access_token,
        },
      }
    );
    const expires_in = moment().unix() + response2.data.expires_in;

    const response3 = await axios.get("https://graph.instagram.com/me", {
      params: {
        fields: "id,username",
        access_token: response2.data.access_token,
      },
    });

    const userInfo = {
      username: response3.data.username,
      instaId: response3.data.id,
      tokenInfo: { access_token: response2.data.access_token, expires_in },
    };
    await firestore
      .collection("users")
      .doc(req.body.userId)
      .update({
        ["linkedAccounts.Instagram"]: userInfo,
      });

    res.send({ success: true });
  } catch (err) {
    res.status(404).send("Oh uh, something went wrong");
  }
});

router.post("/instadata", async (req, res) => {
  /* Get data */
  const getData = async (browser, page, username) => {
    try {
      await page.goto(`https://www.instagram.com/${username}`, {
        waitUntil: "networkidle0",
      });
      const pathname = await page.evaluate(() => location?.pathname);
      if (pathname?.includes("login")) {
        await firestore
          .collection("instagramCookie")
          .doc("cookie")
          .update({ cookie: [] });

        return res.status(200).send("Use stored data");
      }
      const data = await page.evaluate(
        () => document.querySelector("*").outerHTML
      );
      const temp = data
        .split("window._sharedData = ")[1]
        .split(";</script>")[0];
      const {
        biography,
        edge_follow,
        edge_followed_by,
        edge_owner_to_timeline_media,
        full_name,
        is_private,
        profile_pic_url,
      } = JSON.parse(temp).entry_data.ProfilePage[0].graphql.user;
      const finaldata = {
        biography,
        edge_follow,
        edge_followed_by,
        edge_owner_to_timeline_media,
        full_name,
        is_private,
        profile_pic_url,
      };
      await browser.close();
      res.send(finaldata);
    } catch (err) {
      res.status(200).send("Use stored data");
    }
  };

  /* Login on instagram */
  const login = async (browser, page, username) => {
    try {
      await page.goto("https://www.instagram.com/accounts/login/", {
        waitUntil: "networkidle0",
      });
      await page.type("input[name=username]", process.env.INSTAGRAM_USERNAME);
      await page.type("input[name=password]", process.env.INSTAGRAM_PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(5000);
      const pathname = await page.evaluate(() => location?.pathname);
      if (pathname?.includes("login")) {
        return res.status(200).send("Use stored data");
      }
      const cookiesObject = await page.cookies();
      await firestore
        .collection("instagramCookie")
        .doc("cookie")
        .update({ cookie: cookiesObject });
      getData(browser, page, username);
    } catch (err) {
      res.status(200).send("Use stored data");
    }
  };

  /* Start Browser and process login */
  const startBrowser = async (username) => {
    try {
      const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const [page] = await browser.pages();
      const cookieData = await firestore
        .collection("instagramCookie")
        .doc("cookie")
        .get();
      const cookie = cookieData?.data()?.cookie;
      if (cookie?.length > 5) {
        await page.setCookie(...cookie);
        getData(browser, page, username);
      } else {
        login(browser, page, username);
      }
    } catch (err) {
      res.status(200).send("Use stored data");
    }
  };

  /* Get username */
  const getUsername = async (access_token) => {
    try {
      const response = await axios.get("https://graph.instagram.com/me", {
        params: {
          fields: "username",
          access_token: access_token,
        },
      });
      startBrowser(response.data.username);
    } catch (err) {
      res.status(200).send("Use stored data");
    }
  };

  /* Update accessToken */
  const updateToken = async (access_token, userId) => {
    try {
      const response = await axios.get(
        "https://graph.instagram.com/refresh_access_token",
        {
          params: {
            grant_type: "ig_refresh_token",
            access_token,
          },
        }
      );
      const userInfo = {
        access_token: response.data.access_token,
        expires_in: moment().unix() + response.data.expires_in,
      };
      await firestore
        .collection("users")
        .doc(userId)
        .update({
          ["linkedAccounts.Instagram.tokenInfo"]: userInfo,
        });
      getUsername(userInfo.access_token);
    } catch (err) {
      res.status(200).send("Use stored data");
    }
  };

  /* Get usertoken from db */
  try {
    const userData = await firestore
      .collection("users")
      .doc(req.body.userId)
      .get();

    const { expires_in, access_token } =
      userData.data().linkedAccounts.Instagram.tokenInfo;

    if (moment().unix() + 604800 < expires_in) {
      getUsername(access_token);
    } else {
      updateToken(access_token, req.body.userId);
    }
  } catch (err) {
    res.status(200).send("Use stored data");
  }
});

module.exports = router;
