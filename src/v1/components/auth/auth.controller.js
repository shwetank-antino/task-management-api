import User from '../../../models/user.model.js';
import { signToken, verifyToken } from '../../../utils/jwt-token.js';
import bcrypt from 'bcrypt';

export async function registerUser(req, res) {
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const accessToken = signToken({ id: user._id, email: user.email, role: user.role }, '7m');
        const refreshToken = signToken({ id: user._id, email: user.email, role: user.role }, '15d');

        const { password: _, ...userWithoutPassword } = user.toObject();

        res.status(200).cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 15 * 24 * 60 * 60 * 1000,
        })
        .json({accessToken, refreshToken, userWithoutPassword});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function refreshToken(req, res) {
    const { refreshToken } = req.cookies;
    try {
        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }
        const decoded = verifyToken(refreshToken);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        const newAccessToken = signToken({ id: user._id, email: user.email, role: user.role }, '7m');
        res.status(200).json({ accessToken: newAccessToken, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function logoutUser(req, res) {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });
    res.status(200).json({ message: 'Logged out successfully' });
}