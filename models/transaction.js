import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  item: { type: String, required: true },
  category: { type: String, required: true },
  payment: { type: String, required: true },
  transactionType: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true }
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
