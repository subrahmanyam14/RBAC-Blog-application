const mongoose = require("mongoose");


const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to mongoDB");
    } catch (error) {
        console.log("Error while server connecting to mongoDB: ", error);
    }
}

module.exports = connection;