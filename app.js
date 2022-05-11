const express = require("express");
const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");
const cors = require("cors");
const axios = require("axios");
const { initializeApp } = require("firebase/app");
const { doc, getFirestore, getDoc, updateDoc } = require("firebase/firestore");
const app = express();
const PORT = process.env.PORT || 5000;
if (process?.env?.NODE_ENV !== "production") {
  require("dotenv").config();
}
initializeApp({
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID,
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

/* Port listener */
app.listen(PORT, () => {
  console.log(`Listening to Port ${PORT}`);
});

/* Basic route for test */
app.get("/", (req, res) => {
  res.send("Server Running");
});

async function run() {
  /* Send Career Mail */
  app.post("/sendmailCareer", async (req, res) => {
    try {
      const { ask, name, email, text, url } = await req.body;
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      let mailOption = {
        from: process.env.EMAIL,
        to: process.env.CAREER_MAIL,
        subject: `Career: ${name}`,
        text: `${ask}\nEmail: ${email}\nMessage: ${text} \nResume: ${url}`,
      };

      transporter.sendMail(mailOption, (err, success) => {
        if (err) {
          res.send({ success: false });
        } else {
          res.send({ success: true });
        }
      });
    } catch (err) {
      res.send({ success: false });
    }
  });

  /* Send Brand contact mail */
  app.post("/sendmailBrandsContact", async (req, res) => {
    try {
      const { name, brandname, email, message, contact } = await req.body;

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      let mailOption = {
        from: process.env.EMAIL,
        to: process.env.BRANDCONTACT_MAIL,
        subject: `Brands: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nContact: ${contact}\nBrand Name: ${brandname}\nMessage: ${message}`,
      };

      transporter.sendMail(mailOption, (err, success) => {
        if (err) {
          res.send({ success: false });
        } else {
          res.send({ success: true });
        }
      });
    } catch (err) {
      res.send({ success: false });
    }
  });

  /* Send contact mail */
  app.post("/sendmailContact", async (req, res) => {
    try {
      const { ask, name, email, text } = await req.body;

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      let mailOption = {
        from: process.env.EMAIL,
        to: process.env.CONTACT_MAIL,
        subject: `Contact: ${name}`,
        text: `Question: ${ask}\nEmail: ${email}\nMessage: ${text}`,
      };

      transporter.sendMail(mailOption, (err, success) => {
        if (err) {
          res.send({ success: false });
        } else {
          res.send({ success: true });
        }
      });
    } catch (err) {
      console.log(err);
      res.send({ success: false });
    }
  });

  /* Send contact mail */
  app.post("/welcomemail", async (req, res) => {
    try {
      sgMail.setApiKey(process.env.SGAPIKEY);
      let msg = {
        from: process.env.SENDER_MAIL,
        to: req.body.email,
        subject: "Welcome to Flytant",
        text: `You have registered successfully`,
      };
      const response = await sgMail.send(msg);
      res.send(response);
    } catch (err) {
      res.status(500).send({ message: "Something went wrong" });
    }
  });

  /* Get instagram tokens and basic info */
  app.post("/instainfo", async (req, res) => {
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

      const db = getFirestore();
      const userRef = doc(db, "users", req.body.userId);
      await updateDoc(userRef, {
        ["linkedAccounts.Instagram"]: userInfo,
      });

      res.send({ success: true });
    } catch (err) {
      res.status(404).send("Oh uh, something went wrong");
    }
  });

  /* Get instagram user info */
  app.post("/instadata", async (req, res) => {
    try {
      const response = await axios.get(
        `https://www.instagram.com/${req.body.username}/channel/?_a=1`
      );
      res.send(response.data);
    } catch (err) {
      res.status(404).send("oh, something went wrong");
    }
  });

  /* Get toutube channelId */
  app.post("/youtubeinfo", async (req, res) => {
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
      const db = getFirestore();
      const userRef = doc(db, "users", req.body.userId);
      await updateDoc(userRef, {
        ["linkedAccounts.Youtube"]: { channelId: response.data.items[0].id },
      });
      res.send({ success: true });
    } catch (err) {
      res.status(404).send("Oh uh, something went wrong");
    }
  });

  /* Get youtube data */
  app.post("/youtubedata", async (req, res) => {
    try {
      const response1 = await axios.get(
        "https://www.googleapis.com/youtube/v3/channels",
        {
          params: {
            id: req.body.channelId,
            part: "snippet,statistics",
            key: process.env.GOOGLE_API_KEY,
          },
        }
      );

      const response2 = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            part: "id",
            channelId: req.body.channelId,
            maxResults: 20,
            order: "date",
            type: "video",
            key: process.env.GOOGLE_API_KEY,
          },
        }
      );

      if (response2?.data?.items?.length > 0) {
        const videoIds = response2.data.items.map((item) => item.id.videoId);
        const response3 = await axios.get(
          "https://www.googleapis.com/youtube/v3/videos",
          {
            params: {
              part: "snippet,statistics",
              id: videoIds.toString(),
              key: process.env.GOOGLE_API_KEY,
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

  /* Get twitter token and basic info */
  app.post("/twitterinfo", async (req, res) => {
    try {
      const response = await axios.post(
        "https://api.twitter.com/2/oauth2/token",
        `client_id=${process.env.TWITTER_OAUTH2_CLIENT_ID}&grant_type=authorization_code&redirect_uri=${process.env.TWITTER_REDIRECT_URI}&code=${req.body.code}&code_verifier=challenge`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const expires_in = Date.now() + response.data.expires_in * 1000;
      const db = getFirestore();
      const userRef = doc(db, "users", req.body.userId);
      await updateDoc(userRef, {
        ["linkedAccounts.Twitter"]: { ...response.data, expires_in },
      });
      res.send({ success: true });
    } catch (err) {
      res.status(404).send("Oh, something went wrong");
    }
  });

  /* Get twitter data */
  app.post("/twitterdata", async (req, res) => {
    const db = getFirestore();
    const userRef = doc(db, "users", req?.body?.userId);
    // load user twitter data
    const getData = async (access_token) => {
      try {
        const response = await axios.get("https://api.twitter.com/2/users/me", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          params: {
            "user.fields":
              "description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld",
          },
        });
        const response2 = await axios.get(
          `https://api.twitter.com/2/users/${response.data.data.id}/tweets`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
            params: {
              expansions: "attachments.media_keys",
              "media.fields": "media_key,type,url",
              "tweet.fields": "attachments,created_at,public_metrics",
            },
          }
        );
        const tweets = response2?.data?.data;
        const media = response2?.data?.includes?.media;
        res.send({ ...response.data.data, tweets, media });
      } catch (err) {
        res.status(404).send("Oh, something went wrong");
      }
    };

    // get user token
    const loadTokens = async (refresh_token) => {
      try {
        const response3 = await axios.post(
          "https://api.twitter.com/2/oauth2/token",
          `refresh_token=${refresh_token}&grant_type=refresh_token&client_id=${process.env.TWITTER_OAUTH2_CLIENT_ID}`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        const expires_in = Date.now() + response3.data.expires_in * 1000;
        await updateDoc(userRef, {
          ["linkedAccounts.Twitter"]: { ...response3.data, expires_in },
        });
        getData(response3.data.access_token);
      } catch (err) {
        res.status(401).send("Authentication required");
      }
    };

    // Get user initial info
    const getUser = async () => {
      try {
        const userData = await getDoc(userRef);
        const { expires_in, access_token, refresh_token } =
          userData.data().linkedAccounts.Twitter;
        if (Date.now() + 300000 >= expires_in) {
          loadTokens(refresh_token);
        } else {
          getData(access_token);
        }
      } catch (err) {
        res.status(404).send("Oh, something went wrong");
      }
    };
    getUser();
  });

  /* Get tiktok token */
  app.post("/tiktokinfo", async (req, res) => {
    try {
      const response = await axios.post(
        "https://open-api.tiktok.com/oauth/access_token",
        `client_key=${process.env.TIKTOK_CLIENT_KEY}&grant_type=authorization_code&client_secret=${process.env.TIKTOK_CLIENT_SECRET}&code=${req.body.code}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const expires_in = Date.now() + response.data.expires_in * 1000;
      const db = getFirestore();
      const userRef = doc(db, "users", req.body.userId);
      await updateDoc(userRef, {
        ["linkedAccounts.Tiktok"]: { ...response.data.data, expires_in },
      });
      res.send({ success: true });
    } catch (err) {
      res.status(404).send("Oh, something went wrong");
    }
  });

  /* Get tiktok data */
  app.post("/tiktokdata", async (req, res) => {
    const db = getFirestore();
    const userRef = doc(db, "users", req?.body?.userId);

    // get user data
    const getData = async (open_id, access_token) => {
      const response = await axios.post(
        "https://open-api.tiktok.com/user/info/",
        {
          open_id,
          access_token,
          fields: [
            "open_id",
            "union_id",
            "avatar_url",
            "avatar_url_100",
            "avatar_url_200",
            "avatar_large_url",
            "display_name",
          ],
        }
      );
      const response2 = await axios.post(
        "https://open-api.tiktok.com/video/list",
        {
          open_id,
          access_token,
          fields: [
            "embed_html",
            "embed_link",
            "like_count",
            "comment_count",
            "share_count",
            "view_count",
            "title",
          ],
        }
      );
      res.send({ user: response.data, vid: response2.data });
    };

    const getUser = async () => {
      try {
        const userData = await getDoc(userRef);
        const { expires_in, access_token, refresh_token, open_id } =
          userData.data().linkedAccounts.Tiktok;
        if (Date.now() + 300000 >= expires_in) {
          // loadTokens(refresh_token);
          console.log("hi");
        } else {
          getData(open_id, access_token);
        }
      } catch (err) {
        res.status(404).send("Oh, something went wrong");
      }
    };
    getUser();
  });
}
run().catch(console.dir);
