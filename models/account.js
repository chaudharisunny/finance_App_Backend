import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true }, // better Number instead of String
    name: { type: String, required: true }
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", AccountSchema);

export default Account;
