const bcrypt = require("bcrypt");
const UserModel = require("../model/userModel");
const UserDetails = require("../model/userDetailsModel");

module.exports = defaultAdmin = async () => {
    try {
        const userExist = await UserModel.findOne({ email: "admin@gmail.com" });
        if (!userExist) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("password", salt);
            const newUser = await UserModel.create({ firstname: "BalaSubrahmanyam", lastname: "Dusanapudi", role: "admin", mobile: "+919392877127", password: hashedPassword, email: "admin@gmail.com", username: "admin", profilePicture: process.env.DEFAULT_PROFILE });
            const newUserDetails = new UserDetails({userId: newUser._id, noOfUnSuccessfullAttempts: 0, date: null, islocked: false, isBlocked: false});
        await newUserDetails.save();
        }
        console.log("Default admin credentials are created...");
    } catch (error) {
        console.log("Error in the defaultAdmin, ", error);
    }
}