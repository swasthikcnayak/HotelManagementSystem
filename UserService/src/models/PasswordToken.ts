import mongoose, { Schema } from "mongoose";

const TokenSchema = new mongoose.Schema({
  userId: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  token: {
    required: true,
    type: String,
  },
  createdAt: { type: Date, expires: "60m", default: Date.now },
});

export default mongoose.model("PasswordToken", TokenSchema);
