const express = require("express");
const router = express.Router();
const firestore = require("../firebase/firestore");

router.post("/subscribe", async (req, res) => {
  try {
    const email = req.body.email;
    await firestore.collection("marketingEmails").add({ email });
    res.status(200).send("Success");
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
});

module.exports = router;
