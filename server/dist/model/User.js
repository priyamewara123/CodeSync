import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true, required: true, index: true },
    hashpassword: { type: String },
    createdAt: { type: Date, default: Date.now }
});
export const User = mongoose.model("User", userSchema);
//# sourceMappingURL=User.js.map