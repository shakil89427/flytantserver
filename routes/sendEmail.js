const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

/* Send Career Mail */
router.post("/sendmailCareer", async (req, res) => {
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
router.post("/sendmailBrandsContact", async (req, res) => {
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
router.post("/sendmailContact", async (req, res) => {
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
router.post("/welcomemail", async (req, res) => {
  try {
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
