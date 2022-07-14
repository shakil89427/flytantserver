const express = require("express");
const router = express.Router();
const admin = require("../firebase/admin");
const firestore = admin.firestore();

router.get("/products", async (req, res) => {
  try {
    const { docs } = await firestore.collection("products").get();
    const finalData = docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    res.send(finalData);
  } catch (err) {
    res.status(404).send("Not found");
  }
});

module.exports = router;
