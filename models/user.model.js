import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  }
}, {
  timestamps: true
});

// ✅ Prevent model overwrite error in dev hot-reload
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
