const express = require("express");
const router = express.Router();

//USERS
//Index Route
router.get("/", (req, res) => {
  res.send("Get for users");
});

//Show Route
router.get("/:id", (req, res) => {
  res.send("Get for user id");
});

//Post Route
router.post("/", (req, res) => {
  res.send("Post for users");
});

//Delete Route
router.delete("/:id", (req, res) => {
  res.send("delete for user id");
});

module.exports = router;
