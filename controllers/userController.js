import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// ================= REGISTER =================
export const Register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "Fill all input fields" });
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};



// ================= LOGIN =================
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Fill all input fields" });
        }

        const user = await User.findOne({ email });
        console.log("user",user)
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,              // required on Render (HTTPS)
            sameSite: "None",          // required for cross-origin
            path: "/",        
            partitioned: true          // required otherwise Chrome rejects
        });

        res.status(200).json({ 
            role: user.role,
            name:user.name,
            message: "Login successfully" 
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};



// ================= USER ROLE CHECK =================
export const UserRole = (req, res) => {
    try {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        res.status(200).json({ 
            role: req.user.role, 
            name: req.user.name 
        });

    } catch (error) {
        console.error("UserRole Error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};



// ================= LOGOUT =================
export const logOut = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: "/",   // ⭐ MUST match login cookie path
            partitioned: true 
        });

        res.status(200).json({ message: "User logged out successfully" });

    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Logout failed" });
    }
};
