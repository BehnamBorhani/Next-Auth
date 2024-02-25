import TodoModel from "@/models/todo";
import UserModel from "@/models/user";

const { default: connectToDB } = require("@/configs/db");
const { verifyToken } = require("@/utils/auth");

const handler = async (req, res) => {
  connectToDB();
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "You are not login !!" });
  }

  const tokenPayload = verifyToken(token);
  if (!tokenPayload) {
    return res.status(401).json({ message: "You are not login !!" });
  }

  const user = await UserModel.findOne({ email: tokenPayload.email });

  if (req.method === "GET") {
    const todos = await TodoModel.find({ user: user._id });
    return res.status(200).json(todos);
  }
  if (req.method === "POST") {
    const { title, isCompleted } = req.body;
    const newTodo = await TodoModel.create({
      title,
      isCompleted,
      user: user._id,
    });

    return res
      .status(201)
      .json({ message: "Todo created successfully", newTodo });
  } else {
    return false;
  }
};

export default handler;
