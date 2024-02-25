import TodoModel from "@/models/todo";

const { default: connectToDB } = require("@/configs/db");

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

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      const removedTodo = await TodoModel.findOneAndDelete({ _id: id });
      return res
        .status(200)
        .json({ message: "Todo removed successfully!", todo: removedTodo });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "unknown internal server error" });
    }
  }
};
export default handler;
