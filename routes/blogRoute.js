const express = require("express");
const {storeFile} = require("../utils/fileStore");
const {userMiddleware, userAndAdminMiddleware, userAndEditorMiddleware, editorAndAdminMiddleware} = require("../middlewares/authMiddleware");
const {createBlog, updateBlog, deleteBlog, getApprovedAllBlogs, getPendingBlogs, getRejectedBlogs, getBlogsByUserId} = require("../controller/blogController");

const router = express.Router();

router.post("/create-blog", userMiddleware, storeFile("image"), createBlog );
router.put("/update-blog/:id", userAndEditorMiddleware, storeFile("image"), updateBlog);
router.delete("/delete-blog/:id", userAndAdminMiddleware, deleteBlog);
router.get("/get-all-blogs", getApprovedAllBlogs);
router.get("/get-pending-blogs", editorAndAdminMiddleware, getPendingBlogs);
router.get("/get-rejected-blogs", editorAndAdminMiddleware, getRejectedBlogs);
router.get("/get-my-blogs", userMiddleware, getBlogsByUserId);

module.exports = router;