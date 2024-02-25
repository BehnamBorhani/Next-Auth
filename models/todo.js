import mongoose from "mongoose";
import UserModel from "./user";

const todoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const TodoModel = mongoose.models.Todo || mongoose.model("Todo", todoSchema);

export default TodoModel;
