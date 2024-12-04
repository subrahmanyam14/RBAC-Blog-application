const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const connection = require("./config/connection.js");
const userRoute = require("./routes/authRoute.js");
const blogRoute = require("./routes/blogRoute.js");
const defaultAdmin = require("./utils/defaultAdmin.js");
require("dotenv").config();


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
    res.status(200).send(`Server is running upon the port: ${port}. This message for testing purpose only.`);
});
app.use("/auth", userRoute);
app.use("/blog", blogRoute);

app.listen(port, async () => {
    console.log(`Server is running upon the port: ${port}.`);
    await connection();
    await defaultAdmin();
})