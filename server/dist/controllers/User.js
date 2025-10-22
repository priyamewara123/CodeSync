import { User } from "../model/User.js";
export const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // 1️⃣ Check required fields
        if (!name || !email || !password) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }
        // 2️⃣ Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(409).json({ error: "User already exists with this email" });
            return;
        }
        // 3️⃣ Create new user
        const newUser = new User({ name, email, password });
        await newUser.save();
        // 4️⃣ Send success response
        res.status(201).json({
            message: "User registered successfully",
            user: newUser,
        });
    }
    catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Server error during signup" });
    }
};
//# sourceMappingURL=User.js.map