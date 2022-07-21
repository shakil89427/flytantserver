const express = require("express");
const router = express.Router();
const admin = require("../firebase/admin");
const firestore = admin.firestore();

router.post("/getuser", async (req, res) => {
  const getFollowData = async (card) => {
    try {
      const response = await firestore
        .collection("users")
        .doc(req.body.cardId)
        .collection("followers")
        .doc(req?.body?.userId)
        .get();
      const finalData = response.data();
      if (finalData?.userId) {
        res.send({ card, follow: finalData });
      } else {
        res.send({ card, follow: {} });
      }
    } catch (err) {
      res.status(404).send("Not found");
    }
  };

  const getCardData = async () => {
    try {
      const response = await firestore
        .collection("users")
        .doc(req.body.cardId)
        .get();
      const { socialCardEnabled, socialCard, username } = response.data();
      if (socialCardEnabled) {
        const newData = { ...socialCard, username };
        if (!req?.body?.userId) {
          res.send({ card: newData, follow: {} });
        } else {
          getFollowData(newData);
        }
      } else {
        res.status(404).send("Not found");
      }
    } catch (err) {
      res.status(404).send("Not found");
    }
  };
  getCardData();
});

module.exports = router;
