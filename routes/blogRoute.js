const express = require("express");
const {storeFile} = require("../utils/fileStore");
const {userMiddleware, userAndAdminMiddleware, userAndEditorMiddleware, editorAndAdminMiddleware, roleMiddleware} = require("../middlewares/authMiddleware");
const {createBlog, updateBlog, deleteBlog, getApprovedAllBlogs, getPendingBlogs, getRejectedBlogs, getBlogsByUserId, updateBlogStatus} = require("../controller/blogController");

const router = express.Router();

router.post("/create-blog", roleMiddleware, storeFile("image"), createBlog );
router.put("/update-blog/:id", userAndEditorMiddleware, storeFile("image"), updateBlog);
router.delete("/delete-blog/:id", userAndAdminMiddleware, deleteBlog);
router.get("/get-all-blogs", getApprovedAllBlogs);
router.get("/get-pending-blogs", editorAndAdminMiddleware, getPendingBlogs);
router.get("/get-rejected-blogs", editorAndAdminMiddleware, getRejectedBlogs);
router.get("/get-my-blogs", roleMiddleware, getBlogsByUserId);
router.put("/update-blog-status/:id",editorAndAdminMiddleware, updateBlogStatus);

module.exports = router;