const express = require("express");
const router = express.Router();
const axios = require("axios");
const firestore = require("../firebase/firestore");
const puppeteer = require("puppeteer");

router.post("/instainfo", async (req, res) => {
  try {
    const response1 = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      `client_id=${process.env.INSTAGRAM_CLIENT_ID}&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&grant_type=authorization_code&redirect_uri=${process.env.INSTAGRAM_REDIRECT_URI}&code=${req.body.code}`,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const response2 = await axios.get("https://graph.instagram.com/me", {
      params: {
        fields: "id,username",
        access_token: response1.data.access_token,
      },
    });
    const userInfo = {
      username: response2.data.username,
      instaId: response2.data.id,
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
  const getData = async (page, browser) => {
    try {
      await page.goto(`https://www.instagram.com/${req.body.username}`, {
        waitUntil: "networkidle0",
      });
      const data = await page.evaluate(
        () => document.querySelector("*").outerHTML
      );
      await browser.close();
      const temp = data
        .split("window._sharedData = ")[1]
        .split(";</script>")[0];
      const valid = JSON.parse(temp).entry_data;
      res.send(valid);
    } catch (err) {
      res.status(200).send("Use stored data");
    }
  };

  /* Login on instagram */
  const login = async (page) => {
    try {
      await page.goto("https://www.instagram.com/accounts/login/", {
        waitUntil: "networkidle0",
      });
      await page.type("input[name=username]", process.env.INSTAGRAM_USERNAME);
      await page.type("input[name=password]", process.env.INSTAGRAM_PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(4000);
      const pathname = await page.evaluate(() => location?.pathname);
      if (pathname.includes("login")) {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      return false;
    }
  };

  /* Start Browser and process login */
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const [page] = await browser.pages();
    const firstAttempt = await login(page);
    if (firstAttempt) {
      return getData(page, browser);
    }
    const secondAttempt = await login(page);
    if (secondAttempt) {
      return getData(page, browser);
    }
    res.status(200).send("Use stored data");
  } catch (err) {
    res.status(200).send("Use stored data");
  }
});

module.exports = router;
