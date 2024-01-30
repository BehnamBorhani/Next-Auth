import connectToDB from "@/configs/db";
import userModel from "@/models/user";
import { verifyToken } from "@/utils/auth";

const me = async (req, res) => {
  if (req.method !== "GET") {
    return false;
  }

  try {
    connectToDB();
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "You are not login !!" });
    }

    const tokenPayload = verifyToken(token);
    if (!tokenPayload) {
      return res.status(401).json({ message: "You are not login !!" });
    }

    const user = await userModel.findOne(
      { email: tokenPayload.email },
      "firstname lastname email role"
    );
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "UnKnown Internal Server Erorr !!" });
  }
};

export default me;
