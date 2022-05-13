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

/* Middlewares */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "https://flytanthome.web.app",
  })
);

/* Port listener */
app.listen(PORT, () => {
  console.log(`Listening to Port ${PORT}`);
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
