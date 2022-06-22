const express = require("express");
const router = express.Router();
const firestore = require("../firebase/firestore");

router.post("/getuser", async (req, res) => {
  try {
    const userData = await firestore
      .collection("users")
      .doc(req.body.userId)
      .get();
    res.send(userData.data());
  } catch (err) {
    res.status(404).send("Not found");
  }
});

module.exports = router;
