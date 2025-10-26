import express from "express";
import { signupUser , loginUser} from "../controllers/User.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/signup",signupUser);
router.post("/login",verifyToken, loginUser);
router.get("/profile", verifyToken, async (req, res) => {
  res.json({ message: "Welcome, authenticated user!" });
});


export default router;
