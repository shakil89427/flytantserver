const express = require("express");
const router = express.Router();
const admin = require("../firebase/admin");
const firestore = admin.firestore();

router.post("/contactinfo", async (req, res) => {
  try {
    const { id, ...rest } = req.body;
    await firestore
      .collection("users")
      .doc(id)
      .collection("contacts")
      .add(rest);
    res.send("success");
  } catch (err) {
    res.status(404).send("Not found");
  }
});

module.exports = router;
