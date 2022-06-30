const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
require("dotenv").config();

/* Send Career Mail */
router.post("/sendmailCareer", async (req, res) => {
  try {
    const { career_mail } = await JSON.parse(
      req.secrets.contact_mails.defaultValue.value
    );
    const { clientId, clientSecret, refreshToken } = await JSON.parse(
      req.secrets.gmail_keys.defaultValue.value
    );

    const myOAuth2Client = new OAuth2(
      clientId,
      clientSecret,
      "https://developers.google.com/oauthplayground"
    );
    myOAuth2Client.setCredentials({ refresh_token: refreshToken });
    const accessToken = await myOAuth2Client.getAccessToken();

    const { ask, name, email, text, url } = await req.body;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId,
        clientSecret,
        refreshToken,
        accessToken,
      },
    });

    let mailOption = {
      from: process.env.EMAIL,
      to: career_mail,
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
router.post("/sendmailBrandsContact", async (req, res) => {
  try {
    const { brandcontact_mail } = await JSON.parse(
      req.secrets.contact_mails.defaultValue.value
    );
    const { clientId, clientSecret, refreshToken } = await JSON.parse(
      req.secrets.gmail_keys.defaultValue.value
    );

    const myOAuth2Client = new OAuth2(
      clientId,
      clientSecret,
      "https://developers.google.com/oauthplayground"
    );
    myOAuth2Client.setCredentials({ refresh_token: refreshToken });
    const accessToken = await myOAuth2Client.getAccessToken();

    const { name, brandname, email, message, contact } = await req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId,
        clientSecret,
        refreshToken,
        accessToken,
      },
    });

    let mailOption = {
      from: process.env.EMAIL,
      to: brandcontact_mail,
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
router.post("/sendmailContact", async (req, res) => {
  try {
    const { contact_mail } = await JSON.parse(
      req.secrets.contact_mails.defaultValue.value
    );
    const { clientId, clientSecret, refreshToken } = await JSON.parse(
      req.secrets.gmail_keys.defaultValue.value
    );

    const myOAuth2Client = new OAuth2(
      clientId,
      clientSecret,
      "https://developers.google.com/oauthplayground"
    );
    myOAuth2Client.setCredentials({ refresh_token: refreshToken });
    const accessToken = await myOAuth2Client.getAccessToken();
    const { ask, name, email, text } = await req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId,
        clientSecret,
        refreshToken,
        accessToken,
      },
    });
    let mailOption = {
      from: process.env.EMAIL,
      to: contact_mail,
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
router.post("/welcomemail", async (req, res) => {
  try {
    const { clientId, clientSecret, refreshToken } = await JSON.parse(
      req.secrets.gmail_keys.defaultValue.value
    );

    const myOAuth2Client = new OAuth2(
      clientId,
      clientSecret,
      "https://developers.google.com/oauthplayground"
    );
    myOAuth2Client.setCredentials({ refresh_token: refreshToken });
    const accessToken = await myOAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId,
        clientSecret,
        refreshToken,
        accessToken,
      },
    });
    let mailOption = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Welcome to Flytant",
      text: `You have registered successfully`,
    };

    transporter.sendMail(mailOption, (err, success) => {
      if (err) {
        res.send({ success: false });
      } else {
        res.send({ success: true });
      }
    });
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
  }
});

module.exports = router;
