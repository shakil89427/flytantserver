const express = require("express");
const router = express.Router();
const admin = require("../firebase/admin");
const firestore = admin.firestore();

router.get("/getcourse", async (req, res) => {
  try {
    const allData = await firestore.collection("courses").get();
    res.send(allData.docs[0].data());
  } catch (err) {
    res.status(404).send("Oh, something went wrong");
  }
});

module.exports = router;
