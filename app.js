/* Require packages */
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const admin = require("./firebase/admin");

/* Local file */
const skipPaths = require("./skipPaths/skipPaths");

/* Require routes */
const instagram = require("./routes/instagram");
const youtube = require("./routes/youtube");
const twitter = require("./routes/twitter");
const tiktok = require("./routes/tiktok");
const sendEmail = require("./routes/sendEmail");
const basic = require("./routes/basic");
const razorpay = require("./routes/razorPay");
const subscribe = require("./routes/subscribe");
const getImage = require("./routes/getImage");
const getVideo = require("./routes/getVideo");
const getCourse = require("./routes/getCourse");
const getUser = require("./routes/getUser");
const search = require("./routes/search");
const instagramSearch = require("./routes/instagramSearch");

/* Middlewares */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

/* Fetch all tokens from remoteconfig */
app.all("*", async (req, res, next) => {
  try {
    const matched = skipPaths?.find((item) => item === req.path);
    if (matched) {
      next();
    } else {
      const config = admin.remoteConfig();
      const { parameters } = await config.getTemplate();
      req.secrets = parameters;
      next();
    }
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

/* Basic route for test */
app.get("/", (req, res) => {
  res.send("Server Running");
});

/* Use routes */
app.use(instagram);
app.use(youtube);
app.use(twitter);
app.use(tiktok);
app.use(sendEmail);
app.use(basic);
app.use(razorpay);
app.use(subscribe);
app.use(getImage);
app.use(getVideo);
app.use(getCourse);
app.use(getUser);
app.use(search);
app.use(instagramSearch);

/* Port listener */
app.listen(PORT, () => {
  console.log(`Listening to Port ${PORT}`);
});
