const express = require("express");
const router = express.Router();
const admin = require("../firebase/admin");
const firestore = admin.firestore();

router.get("/getcourse", async (req, res) => {
  try {
    const { docs } = await firestore.collection("courses").get();
    const final = docs.map((item) => item.data());
    res.send(final);
  } catch (err) {
    res.status(404).send("Oh, something went wrong");
  }
});

module.exports = router;
