const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
require("dotenv").config();

router.post("/createpayment", async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const options = {
      amount: 50000,
      currency: "INR",
      receipt: "order_rcptid_11",
    };
    const response = await instance.orders.create(options);
    if (response.id) {
      res.send(response);
    } else {
      res.status(400).send("Something went wrong");
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

module.exports = router;
