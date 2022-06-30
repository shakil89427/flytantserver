const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

/* Send Career Mail */
router.post("/sendmailCareer", async (req, res) => {
  try {
    const { career_mail } = await JSON.parse(
      req.secrets.contact_mails.defaultValue.value
    );
    const { user, pass } = await JSON.parse(
      req.secrets.email_secrets.defaultValue.value
    );
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    const { ask, name, email, text, url } = await req.body;

    let mailOption = {
      from: user,
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
    const { user, pass } = await JSON.parse(
      req.secrets.email_secrets.defaultValue.value
    );
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    const { name, brandname, email, message, contact } = await req.body;

    let mailOption = {
      from: user,
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
    const { user, pass } = await JSON.parse(
      req.secrets.email_secrets.defaultValue.value
    );
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    const { ask, name, email, text } = await req.body;

    let mailOption = {
      from: user,
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
    const { user, pass } = await JSON.parse(
      req.secrets.email_secrets.defaultValue.value
    );
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    let mailOption = {
      from: user,
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
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
});

module.exports = router;
