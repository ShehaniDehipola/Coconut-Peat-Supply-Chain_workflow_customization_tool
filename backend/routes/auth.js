const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser, changePassword,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/change-password", changePassword)

module.exports = router;
