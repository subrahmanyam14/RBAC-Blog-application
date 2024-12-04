const express = require("express");
const { signUp, signUpAdmin, signUpEditor, signIn, logout, getUserProfile, getAllUserProfiles } = require("../controller/userController");
const {  adminMiddleware, userMiddleware } = require("../middlewares/authMiddleware");
const { storeFile } = require("../utils/fileStore");

const router = express.Router();

router.post("/signup", storeFile("image"), signUp);
router.post("/signup/admin", storeFile("image"), adminMiddleware, signUpAdmin);
router.post("/signup/editor", storeFile("image"), adminMiddleware, signUpEditor);
router.post("/signin", signIn);
router.get("/logout", logout);
router.get("/profile", userMiddleware, getUserProfile);
router.get("/allprofiles", adminMiddleware, getAllUserProfiles);

module.exports = router;