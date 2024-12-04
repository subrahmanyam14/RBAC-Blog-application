const bcrypt = require("bcrypt");
const UserModel = require("../model/userModel");

module.exports = defaultAdmin = async () => {
    try {
        const userExist = await UserModel.findOne({ email: "admin@gmail.com" });
        if (!userExist) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("password", salt);
            await UserModel.create({ firstname: "BalaSubrahmanyam", lastname: "Dusanapudi", role: "admin", mobile: "+919392877127", password: hashedPassword, email: "admin@gmail.com", username: "admin" });
        }
        console.log("Default admin credentials are created...");
    } catch (error) {
        console.log("Error in the defaultAdmin, ", error);
    }
}