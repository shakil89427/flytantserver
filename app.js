/* Require packages */
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;

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
const getUser = require("./routes/getUser");

/* Middlewares */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

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
app.use(getUser);

/* Port listener */
app.listen(PORT, () => {
  console.log(`Listening to Port ${PORT}`);
});
