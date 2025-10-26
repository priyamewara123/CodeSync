import { Request, Response, CookieOptions } from "express";
import { User } from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
interface SignupBody {
  name: string;
  email: string;
  hashpassword: string;
}
interface LoginBody {
  email: string;
  password: string;
}

export const signupUser = async (
  req: Request<{}, {}, SignupBody>,
  res: Response
): Promise<void> => {
  try {
    const { name, email, hashpassword } = req.body;

    // 1️⃣ Check required fields
    if (!name || !email || !hashpassword) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    // 2️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: "User already exists with this email" });
      return;
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(hashpassword, saltRounds);


    // 3️⃣ Create new user
    const newUser = new User({
      name,
      email,
     hashpassword: hashedPassword,
    });
    await newUser.save();

    // 4️⃣ Send success response
    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error during signup" });
  }
};

export const loginUser = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // 2️⃣ Check if user exists
    const user = await User.findOne({ email });
    if (!user || !user.hashpassword) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.hashpassword);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // 4️⃣ Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };
    res.cookie("token", token, cookieOptions);

    // 5️⃣ Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};


