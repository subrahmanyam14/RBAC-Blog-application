const e = require("express");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "editor","admin"],
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
    },
    
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);