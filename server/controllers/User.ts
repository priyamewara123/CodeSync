import { Request, Response } from "express";
import { User } from "../model/User.js";
import bcrypt from "bcryptjs";
interface SignupBody {
  name: string;
  email: string;
  hashpassword: string;
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
