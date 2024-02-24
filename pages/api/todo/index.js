import todoModel from "@/models/todo";
import userModel from "@/models/user";

const { default: connectToDB } = require("@/configs/db");
const { verifyToken } = require("@/utils/auth");

const handler = async (req, res) => {
  if (req.method === "GET") {
  }
  if (req.method === "POST") {
    connectToDB();
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "You are not login !!" });
    }

    const tokenPayload = verifyToken(token);
    if (!tokenPayload) {
      return res.status(401).json({ message: "You are not login !!" });
    }

    const user = await userModel.findOne({ email: tokenPayload.email });

    const { title, isCompleted } = req.body;
    const newTodo = await todoModel.create({
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
