const express = require("express");
const router = express.Router();
const admin = require("../firebase/admin");
const firestore = admin.firestore();

router.post("/getuser", async (req, res) => {
  try {
    const userData = await firestore
      .collection("users")
      .doc(req.body.userId)
      .get();
    const { socialCardEnabled, socialCard, username } = userData.data();
    if (socialCardEnabled) {
      const newData = { ...socialCard, username };
      res.send(newData);
    } else {
      res.status(404).send("Not found");
    }
  } catch (err) {
    res.status(404).send("Not found");
  }
});

module.exports = router;
