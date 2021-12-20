if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors());

app.post('/sendmailCareer', async (req, res) => {
    const { ask, name, email, text, url } = await req.body;
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'priyachaudhary272.pc@gmail.com',
            pass: '272272272',
            // user: process.env.SENDER_MAIL || 'priyachaudhary272.pc@gmail.com',
            // pass: process.env.SENDER_PASS || '272272272',
        },
    });
    var mailOptions = {
        from: process.env.SENDER_MAIL,
        to: process.env.CAREER_MAIL,
        subject: `Career: ${name}`,
        text: `${ask}\nEmail: ${email}\nMessage: ${text}`,
        attachments:[
            {
                href: `${url}`
            }
        ],
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            //   console.log(error);
            return res.send({ success: false });
        } else {
            // console.log('Email sent: ' + info.response);
            return res.send({ success: true });
        }
    });
    return res.send({ success: true })
})
app.post('/sendmailContact', async (req, res) => {
    const { ask, name, email, text } = await req.body;
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_MAIL || 'someothermail',
            pass: process.env.SENDER_PASS || 'temperary-password',
            // user: 'priyachaudhary272.pc@gmail.com',
            // pass: '272272272',
        },
    });
    var mailOptions = {
        // from: "priyachaudhary272.pc@gmail.com",
        // to: "priyanshuchaudhary148@gmail.com",
        from: process.env.SENDER_MAIL,
        to: process.env.CONTACT_MAIL,
        subject: `Contact: ${name}`,
        text: `${ask}\nEmail: ${email}\nMessage: ${text}`,
}
      transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        //   console.log(error);
        return res.send({ success: false });
    } else {
        // console.log('Email sent: ' + info.response);
        return res.send({ success: true });
    }
});
return res.send({ success: true })
})
app.listen(PORT, () => {
    console.log('Connecter to the port 5000')
})