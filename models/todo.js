import mongoose from "mongoose";
import userModel from "./user";

const todoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    required: true,
  },
  title: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const todoModel = mongoose.models.Todo || mongoose.model("Todo", todoSchema);

export default todoModel;
