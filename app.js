if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express')
const sgMail = require('@sendgrid/mail')
const cors = require('cors')
const nodemailer = require('nodemailer')
const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors());

app.post('/sendmailCareer', async (req, res) => {
    const { ask, name, email, text, url } = await req.body;
    // let transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: process.env.SENDER_MAIL || 'asdf',
    //         pass: process.env.SENDER_PASS || 'sdf',
    //     },
    // });

    //     array.push(url);

    // array.forEach(function (data) {
    //         temp.push({
    //             path: data,
    //             filename: 'resume.pdf'
    //         });
    sgMail.setApiKey("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")
    var mailOptions = {
        // from: process.env.SENDER_MAIL,
        // to: process.env.CAREER_MAIL,
        from: "divyalana6@gmail.com",
        to: "priyanshuchaudhary148@gmail.com",
        subject: `Career: ${name}`,
        text: `${ask}\nEmail: ${email}\nMessage: ${text} \n Resume: ${url}`,
        // attachments: [
        //     {
        //         href: `${url}`
        //     }
        // ],
        // attachments: temp,
    }
    // transporter.sendMail(mailOptions, function (error, info) {
    //     if (error) {
    //         //   console.log(error);
    //         return res.send({ success: false });
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



app.post('/sendmailContact', async (req, res) => {
    const { ask, name, email, text } = await req.body;
    // let transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         // host: "herokuapp",
    //         port: 465,
    //         secure: true,
    //         user: process.env.SENDER_MAIL || 'someothermail',
    //         pass: process.env.SENDER_PASS || 'temperary-password',
    //     },
    // });
    sgMail.setApiKey("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")
    var mailOptions = {
        from: "divyalana6@gmail.com",
        to: "priyanshuchaudhary148@gmail.com",
        // from: process.env.SENDER_MAIL,
        // to: process.env.CONTACT_MAIL,
        subject: `Contact: ${name}`,
        text: `${ask}\nEmail: ${email}\nMessage: ${text}`,
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