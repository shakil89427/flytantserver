const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
require("dotenv").config();

router.post("/createpayment", async (req, res) => {
  try {
    const { key_id, key_secret } = await JSON.parse(
      req.secrets.razorpay_keys.defaultValue.value
    );
    const { ammount, currency, notes } = req.body;
    const instance = new Razorpay({ key_id, key_secret });
    const options = {
      amount: ammount * 100,
      currency,
      notes,
    };
    const { id } = await instance.orders.create(options);
    if (id) {
      res.send({ id });
    } else {
      res.status(400).send("Something went wrong");
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

module.exports = router;
