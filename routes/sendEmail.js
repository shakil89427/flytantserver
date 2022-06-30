const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

/* Send Career Mail */
router.post("/sendmailCareer", async (req, res) => {
  try {
    const { career_mail } = await JSON.parse(
      req.secrets.contact_mails.defaultValue.value
    );
    const secrets = await JSON.parse(
      req.secrets.email_secrets.defaultValue.value
    );
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: secrets.email,
        pass: secrets.password,
      },
    });

    const { ask, name, email, text, url } = await req.body;

    let mailOption = {
      from: secrets.email,
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
    const secrets = await JSON.parse(
      req.secrets.email_secrets.defaultValue.value
    );
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: secrets.email,
        pass: secrets.password,
      },
    });

    const { name, brandname, email, message, contact } = await req.body;

    let mailOption = {
      from: secrets.email,
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
    const secrets = await JSON.parse(
      req.secrets.email_secrets.defaultValue.value
    );

    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: secrets.email,
        pass: secrets.password,
      },
    });

    let mailOption = {
      from: secrets.email,
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
    const secrets = await JSON.parse(
      req.secrets.email_secrets.defaultValue.value
    );
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: secrets.email,
        pass: secrets.password,
      },
    });
    let mailOption = {
      from: secrets.email,
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
