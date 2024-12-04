const mongoose = require("mongoose");

const userDetailSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    noOfUnSuccessfullAttempts: {
        type: Number,
        default: 0        
    },
    date: {
        type: Date,
        default: null,
    },
    islocked: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

module.exports = mongoose.model("UserDetails", userDetailSchema);
