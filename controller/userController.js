const bcrypt = require("bcrypt");
const UserModel = require("../model/userModel");
const UserDetails = require("../model/userDetailsModel");
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
const DEFAULT_PROFILE = process.env.DEFAULT_PROFILE  || "uploads\\image-1733369760022-501097310.png";

const signUp = async ( req, res ) => {
    try {
        const { username, email, password, mobile, firstname, lastname } = req.body;
        if( !username || !email || !password || !mobile || !firstname || !lastname )
        {
            return res.status(400).send({error: "All the fields are required..."});
        }
        let userExists = await UserModel.findOne({username});
        if( userExists )
        {
            return res.status(509).send({error: "Username is already exists with the user..."});
        }
        userExists = await UserModel.findOne({email});
        if(userExists)
        {
            return res.status(509).send({error: "email already exists with the user..."});
        }
        let profilePicture = DEFAULT_PROFILE;
        if(req.file && req.file.length > 0){
            profilePicture = req.file.path;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new UserModel({username, email, firstname, lastname, mobile, password: hashedPassword, role: "user", profilePicture });
        await newUser.save();
        const newUserDetails = new UserDetails({userId: newUser._id, noOfUnSuccessfullAttempts: 0, date: null, islocked: false, isBlocked: false});
        await newUserDetails.save();
        await generateTokenAndSetCookie( newUser, res );
        return res.status(201).send({message: "User registered successfully..."});

    } catch (error) {
        console.log("Error in the SignUp ", error);
        return res.status(500).send({error: "Internal server error..."});
    }
}





const signUpAdmin = async (req, res) => {
    try {
        const { username, email, password, mobile, firstname, lastname } = req.body;
        if (!username || !email || !password || !mobile || !firstname || !lastname) {
            return res.status(400).send({ error: "All the fields are required..." });
        }

        let userExists = await UserModel.findOne({ username });
        if (userExists) {
            return res.status(509).send({ error: "Username already exists with the user..." });
        }

        userExists = await UserModel.findOne({ email });
        if (userExists) {
            return res.status(509).send({ error: "Email already exists with the user..." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let profilePicture = DEFAULT_PROFILE;
        if(req.file && req.file.length > 0){
            profilePicture = req.file.path;
        }

        const newUser = new UserModel({
            username,
            email,
            firstname,
            lastname,
            mobile,
            password: hashedPassword,
            role: "admin",
            profilePicture,
        });

        await newUser.save();

        const newUserDetails = new UserDetails({
            userId: newUser._id,
            noOfUnSuccessfullAttempts: 0,
            date: null,
            islocked: false,
            isBlocked: false,
        });

        await newUserDetails.save();
        await generateTokenAndSetCookie(newUser, res);

        return res.status(201).send({ message: "User registered successfully..." });
    } catch (error) {
        console.error("Error in the SignUp ", error);
        return res.status(500).send({ error: "Internal server error..." });
    }
};


const signUpEditor = async ( req, res ) => {
    try {
        const { username, email, password, mobile, firstname, lastname } = req.body;
        if( !username || !email || !password || !mobile || !firstname || !lastname )
        {
            return res.status(400).send({error: "All the fields are required..."});
        }
        let userExists = await UserModel.findOne({username});
        if( userExists )
        {
            return res.status(509).send({error: "Username is already exists with the user..."});
        }
        userExists = await UserModel.findOne({email});
        if(userExists)
        {
            return res.status(509).send({error: "email already exists with the user..."});
        }
        let profilePicture = DEFAULT_PROFILE;
        if (req.file && req.file.path) {
            profilePicture = req.file.path;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new UserModel({username, email, firstname, lastname, mobile, password: hashedPassword, role: "editor", profilePicture: profilePicture });
        await newUser.save();
        const newUserDetails = new UserDetails({userId: newUser._id, noOfUnSuccessfullAttempts: 0, date: null, islocked: false, isBlocked: false});
        await newUserDetails.save();
        await generateTokenAndSetCookie( newUser, res );
        return res.status(201).send({message: "User registered successfully..."});

    } catch (error) {
        console.log("Error in the SignUp ", error);
        return res.status(500).send({error: "Internal server error..."});
    }
}



const signIn = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        // Validate input fields
        if (!emailOrUsername || !password) {
            return res.status(400).send({ error: "All fields are required." });
        }

        // Find user by email or username
        const user = await UserModel.findOne({
            $or: [{ username: emailOrUsername }, { email: emailOrUsername }],
        });

        if (!user) {
            return res.status(404).send({ error: "User not found." });
        }

        // Fetch user details
        const userDetails = await UserDetails.findOne({ userId: user._id });

        if (!userDetails) {
            return res.status(500).send({ error: "User details not found." });
        }

        if(userDetails.isBlocked) {
            return res.status(403).send({ error: "Your account has been blocked. Please contact the admin." });
        }

        const currentTime = new Date();

        // Check if the account is locked
        if (userDetails.islocked) {
            const lockDuration = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
            const unlockTime = new Date(userDetails.date.getTime() + lockDuration);

            if (currentTime < unlockTime) {
                const remainingTime = Math.ceil((unlockTime - currentTime) / (60 * 1000)); // in minutes
                return res.status(403).send({
                    error: `Account is locked. Try again in ${remainingTime} minutes.`,
                });
            }

            // Unlock the account after the lock duration
            await UserDetails.updateOne(
                { userId: user._id },
                { islocked: false, noOfUnSuccessfullAttempts: 0, date: null }
            );
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            const noOfUnSuccessfullAttempts = userDetails.noOfUnSuccessfullAttempts + 1;

            if (noOfUnSuccessfullAttempts >= 5) {
                await UserDetails.updateOne(
                    { userId: user._id },
                    { islocked: true, date: currentTime }
                );
                return res.status(403).send({ error: "Account locked due to multiple failed login attempts. Please try again after 3 hours." });
            }

            await UserDetails.updateOne(
                { userId: user._id },
                { noOfUnSuccessfullAttempts, date: currentTime }
            );

            return res.status(401).send({ error: "Invalid password." });
        }

        // Reset unsuccessful attempts on successful login
        await UserDetails.updateOne(
            { userId: user._id },
            { noOfUnSuccessfullAttempts: 0, date: null }
        );

        // Generate token and set cookie
        await generateTokenAndSetCookie(user, res);

        return res.status(200).send({ message: "User logged in successfully." });
    } catch (error) {
        console.error("Error in signIn:", error.message);
        return res.status(500).send({ error: "Internal server error." });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).send({ error: "User not found." });
        }
        user.profilePicture = `${BASE_URL}/${user.profilePicture}`;
        return res.status(200).send({ user });
    } catch (error) {
        console.error("Error in getUserProfile:", error.message);
        return res.status(500).send({ error: "Internal server error." });
    }
};

const getAllUserProfiles = async (req, res) => {
    try {
        const { page=1 } = req.query;
        const limit = 10;
        const skip = ( page - 1) * limit;

        const users = await UserModel.find().select("-password").skip(skip).limit(limit);

        const totalUsers = await UserModel.countDocuments();

        const totalPages = Math.ceil(totalUsers / limit);

        const totalUsersWithProfiles = users.map((user) => ({...user.toObject(), profilePicture: `${BASE_URL}/${user.profilePicture}`}))

        return res.status(200).send({
            users: totalUsersWithProfiles,
            currentPage: Number(page),
            totalPages,
            totalUsers,
        });
    } catch (error) {
        console.error("Error in getAllUserProfiles:", error.message);
        return res.status(500).send({ error: "Internal server error." });
    }
};



const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).send({message: "Logged out successfully..."});
    } catch (error) {
        console.log("Error occur in the Logout: ", error);
        res.status(500).send({
            error: "Internal server error..."
        });
    }
}

module.exports = { signUp, signUpAdmin, signUpEditor, signIn, logout, getUserProfile, getAllUserProfiles };
