const BlogModel = require("../model/blogModel");

const BASE_URL = process.env.BASE_URL || "http://localhost:5000"; 

const createBlog = async ( req, res ) => {
    try {
        const { title, description } = req.body;
        if( !title || !description )
        {
            return res.status(400).send({error: "All the fields are required..."});
        }
        const userId = req.user._id;
        const image = req.file.path;
        const newBlog = new BlogModel({title, description, userId, image});
        await newBlog.save();
        return res.status(201).send({message: "Blog created successfully...", newBlog});
    } catch (error) {
        console.log("Error in the createBlog, ", error);
        return res.status(500).send({error: "Internal Server Error..."});
    }
}

const updateBlog = async ( req, res ) => {
    try {
        const { title, description } = req.body;
        const blogId = req.params.id;
        const blog = await BlogModel.findById(blogId);
        if( !blog )
        {
            return res.status(404).send({error: "Blog not found"});
        }
        blog.title = title;
        blog.description = description;
        if( req.file && req.file.path )
        {
            blog.image = req.file.path;
        }
        await blog.save();
        blog.image = `${BASE_URL}/${blog.image}`;
        return res.status(200).send({message: "Blog updated successfully...", blog});
    } catch (error) {
        console.log("Error in the updateBlog, ", error);
        return res.status(500).send({error: "Internal Server Error..."});
    }
}

const updateBlogStatus = async ( req, res ) => {
    try {
        const blogId = req.params.id;
        const blog = await BlogModel.findById(blogId);
        if( !blog )
        {
            return res.status(404).send({error: "Blog not found"});
        }
        blog.status = req.body.status;
        await blog.save();
        return res.status(200).send({message: "Blog status updated successfully..."});
    } catch (error) {
        console.log("Error in the updateBlogStatus, ", error);
        return res.status(500).send({error: "Internal Server Error..."});
    }
}

const deleteBlog = async ( req, res ) => {
    try {
        const blogId = req.params.id;
        const blog = await BlogModel.findById(blogId);
        if( !blog )
        {
            return res.status(404).send({error: "Blog not found"});
        }
        await blog.remove();
        return res.status(200).send({message: "Blog deleted successfully..."});
    } catch (error) {
        console.log("Error in the deleteBlog, ", error);
        return res.status(500).send({error: "Internal Server Error..."});
    }
}

const getApprovedAllBlogs = async ( req, res ) => {
    try {
        const { page=1, limit=10 } = req.query;
        const skip = ( page - 1) * limit;
        const blogs = await BlogModel.find({status: "Published"}).skip(skip).limit(limit).select("-userId");
        const totalBlogs = await BlogModel.countDocuments({status: "Published"});
        const totalPages = Math.ceil(totalBlogs / limit);
        const blodsWithImageULRS = blogs.map((blog) => ({
            ...blog.toObject(),
            image: `${BASE_URL}/${blog.image}`
        }))
        return res.status(200).send({blogs: blodsWithImageULRS, currentPage: Number(page), totalPages, totalBlogs});
    } catch (error) {
        console.log("Error in the getAllBlogs, ", error);   
        return res.status(500).send({error: "Internal Server Error..."});
    }
}

const getPendingBlogs = async ( req, res ) => {
    try {
        const { page=1, limit=10 } = req.query;
        const skip = ( page - 1) * limit;
        const blogs = await BlogModel.find({status: "Pending"}).skip(skip).limit(limit).select("-userId");
        const totalBlogs = await BlogModel.countDocuments({status: "Pending"});
        const totalPages = Math.ceil(totalBlogs / limit);
        const blodsWithImageULRS = blogs.map((blog) => ({
            ...blog.toObject(),
            image: `${BASE_URL}/${blog.image}`
        }));
        return res.status(200).send({blogs: blodsWithImageULRS, currentPage: Number(page), totalPages, totalBlogs});
    } catch (error) {
        console.log("Error in the getPendingBlogs, ", error);
        return res.status(500).send({error: "Internal Server Error..."});
    }
}

const getRejectedBlogs = async ( req, res ) => {
    try {
        const { page=1, limit=10 } = req.query;
        const skip = ( page - 1) * limit;
        const blogs = await BlogModel.find({status: "Rejected"}).skip(skip).limit(limit).select("-userId");
        const totalBlogs = await BlogModel.countDocuments({status: "Rejected"});
        const totalPages = Math.ceil(totalBlogs / limit);
        const blodsWithImageULRS = blogs.map((blog) => ({
            ...blog.toObject(),
            image: `${BASE_URL}/${blog.image}`
        }));
        return res.status(200).send({blogs: blodsWithImageULRS, currentPage: Number(page), totalPages, totalBlogs});
    } catch (error) {
        console.log("Error in the getPendingBlogs, ", error);
        return res.status(500).send({error: "Internal Server Error..."});
    }
}



const getBlogsByUserId = async ( req, res ) => {
    try {
        const { page=1, limit=10 } = req.query;
        const userId = req.user._id;
        const skip = ( page - 1) * limit;
        const blogs = await BlogModel.find({userId}).skip(skip).limit(limit).select("-userId");
        const totalBlogs = await BlogModel.countDocuments({userId});
        const totalPages = Math.ceil(totalBlogs / limit);
        const blodsWithImageULRS = blogs.map((blog) => ({
            ...blog.toObject(),
            image: `${BASE_URL}/${blog.image}`
        }));
        return res.status(200).send({blogs: blodsWithImageULRS, currentPage: Number(page), totalPages, totalBlogs});
    } catch (error) {
        console.log("Error in the getBlogsByUserId, ", error);
        return res.status(500).send({error: "Internal Server Error..."});
    }
}

module.exports = {createBlog, updateBlog, deleteBlog, getApprovedAllBlogs, getPendingBlogs, getRejectedBlogs, getBlogsByUserId, updateBlogStatus};