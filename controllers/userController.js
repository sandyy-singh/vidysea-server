import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "fill all input fields " })
        }
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "user is already exist" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        })
        res.status(201).json({ message: "user registered successfully" })
    } catch (err) {
        res.status(500).json({ message: "erver error" })
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {

        if (!email || !password) {
            return res.status(400).json({ message: "Fill all input fields" });
        }

        const user = await User.findOne({ email });
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
            httpOnly: true, secure: true,              // required for https
            sameSite: "None",
        });
        res.json({ role: user.role, message: "login successfully" });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const UserRole = (req, res) => {
    console.log(req.user.name)
    try {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        res.status(200).json({ role: req.user.role, name: req.user.name });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const logOut = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,              // required for https
            sameSite: "None",
            // secure: process.env.NODE_ENV === "production", // optional
        });
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Logout failed" });
    }
};

