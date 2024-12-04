const UserModel = require("../model/userModel");
const jwt = require("jsonwebtoken");

const adminMiddleware = async (req, res, next) => {
    const token = req.cookies.jwt;
    if(!token)
    {
        return res.status(401).send({ error: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded)
    {
        return res.status(401).send({ error: "Unauthorized" });
    }
    const user = await UserModel.findById(decoded.user_id);
    if(!user || user.role !== "admin")
    {
        return res.status(401).send({ error: "Unauthorized" });
    }
    req.user = user;
    next();
}



const editorMiddleware = async (req, res, next) => {
    const token = req.cookies.jwt;
    if(!token)
    {
        return res.status(401).send({ error: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded)
    {
        return res.status(401).send({ error: "Unauthorized" });
    }
    const user = await UserModel.findById(decoded.user_id);
    if(!user || user.role !== "editor")
    {
        return res.status(401).send({ error: "Unauthorized" });
    }
    req.user = user;
    next();
}






const userMiddleware = async (req, res, next) => {
    const token = req.cookies.jwt;
    if(!token)
    {
        return res.status(401).send({ error: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded)
    {
        return res.status(401).send({ error: "Unauthorized" });
    }
    const user = await UserModel.findById(decoded.user_id);
    if(!user || user.role !== "user")
    {
        return res.status(401).send({ error: "Unauthorized" });
    }
    req.user = user;
    next();
}

const userAndEditorMiddleware = async (req, res, next) => {
    try {
        // Check if the JWT token exists in cookies
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).send({ error: "Unauthorized" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).send({ error: "Unauthorized" });
        }

        // Find the user in the database
        const user = await UserModel.findById(decoded.user_id);
        if (!user) {
            return res.status(401).send({ error: "Unauthorized" });
        }

        // Allow access for users with role 'user' or 'admin'
        if (user.role !== "user" && user.role !== "editor" ) {
            return res.status(403).send({ error: "Forbidden: Insufficient permissions" });
        }

        // Attach user data to request object
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in roleMiddleware: ", error);
        return res.status(500).send({ error: "Internal server error..." });
    }
};

const userAndAdminMiddleware = async (req, res, next) => {
    try {
        // Check if the JWT token exists in cookies
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).send({ error: "Unauthorized" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).send({ error: "Unauthorized" });
        }

        // Find the user in the database
        const user = await UserModel.findById(decoded.user_id);
        if (!user) {
            return res.status(401).send({ error: "Unauthorized" });
        }

        // Allow access for users with role 'user' or 'admin'
        if (user.role !== "user" && user.role !== "editor" ) {
            return res.status(403).send({ error: "Forbidden: Insufficient permissions" });
        }

        // Attach user data to request object
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in roleMiddleware: ", error);
        return res.status(500).send({ error: "Internal server error..." });
    }
};


const editorAndAdminMiddleware = async (req, res, next) => {
    try {
        // Check if the JWT token exists in cookies
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).send({ error: "Unauthorized" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).send({ error: "Unauthorized" });
        }

        // Find the user in the database
        const user = await UserModel.findById(decoded.user_id);
        if (!user) {
            return res.status(401).send({ error: "Unauthorized" });
        }

        // Allow access for users with role 'user' or 'admin'
        if (user.role !== "user" && user.role !== "editor" ) {
            return res.status(403).send({ error: "Forbidden: Insufficient permissions" });
        }

        // Attach user data to request object
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in roleMiddleware: ", error);
        return res.status(500).send({ error: "Internal server error..." });
    }
};



module.exports = {userMiddleware, editorMiddleware, adminMiddleware, userAndEditorMiddleware, userAndAdminMiddleware, editorAndAdminMiddleware};
