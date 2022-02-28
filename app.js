const express = require('express')
const sgMail = require('@sendgrid/mail')
const cors = require('cors')
const nodemailer = require('nodemailer')
const app = express();
const PORT = process.env.PORT || 5000;
// const PORT = 5000;
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
    }


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors());

app.post('/sendmailCareer', async (req, res) => {
    const { ask, name, email, text, url } = await req.body;
    sgMail.setApiKey(process.env.SGAPIKEY)
    var mailOptions = {
        from: process.env.SENDER_MAIL,
        to: process.env.CAREER_MAIL,
        subject: `Career: ${name}`,
        text: `${ask}\nEmail: ${email}\nMessage: ${text} \nResume: ${url}`,
    }
    sgMail.send(mailOptions)
        .then(() => {
            return res.send({ success: true });
        })
        .catch(() => {
            return res.send({ success: false });
        })
})
app.post('/sendmailBrandsContact', async (req, res) => {
    const { name, brandname, email, message, contact, code } = await req.body;
    console.log(req.body);
    sgMail.setApiKey(process.env.SGAPIKEY)
    var mailOptions = {
        from: process.env.SENDER_MAIL,
        to: process.env.BRANDCONTACT_MAIL,
        subject: `Brands: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nContact: +${code} ${contact}\nBrand Name: ${brandname}\nMessage: ${message}`,
    }
    sgMail.send(mailOptions)
        .then(() => {
            return res.send({ success: true });
        })
        .catch(() => {
            return res.send({ success: false });
        })
})



app.post('/sendmailContact', async (req, res) => {
    const { ask, name, email, text } = await req.body;
    // let transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         secure: true,
    //         user: process.env.SENDER_MAIL || 'someothermail',
    //         pass: process.env.SENDER_PASS || 'temperary-password',
    //     },
    // });
    sgMail.setApiKey(process.env.SGAPIKEY)
    var mailOptions = {
        from: process.env.SENDER_MAIL,
        to: process.env.CONTACT_MAIL,
        subject: `Contact: ${name}`,
        text: `Question: ${ask}\nEmail: ${email}\nMessage: ${text}`,
    }
    // transporter.sendMail(mailOptions, function (error, info) {
    //     if (error) {
    //         //   console.log(error);
    //         return res.send({ success: false, error: error });
    //     } else {
    //         // console.log('Email sent: ' + info.response);
    //         return res.send({ success: true });
    //     }
    // });
    sgMail.send(mailOptions)
        .then(() => {
            return res.send({ success: true });
        })
        .catch(() => {
            return res.send({ success: false });
        })
})
app.listen(PORT, () => {
    console.log('Connecter to the port 5000')
})