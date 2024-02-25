import UserModel from "@/models/user";
import { generateToken, verifyPassword } from "@/utils/auth";
import { serialize } from "cookie";

const { default: connectToDB } = require("@/configs/db");

const signIn = async (req, res) => {
  if (req.method !== "POST") {
    return false;
  }

  try {
    connectToDB();
    const { identifier, password } = req.body;
    if (!identifier.trim() || !password.trim()) {
      return res.status(422).json({ message: "data is not valid!!!" });
    }

    const user = await UserModel.findOne({
      $or: [{ username: identifier }, { password: identifier }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found !!" });
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res
        .status(422)
        .json({ message: "username or password is not correct !!" });
    }

    const token = generateToken({ email: user.email });

    return res
      .setHeader(
        "Set-Cookie",
        serialize("token", token, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        })
      )
      .status(200)
      .json({ message: "User Logged In Successfully :))" });
  } catch (error) {
    console.log("signIn error => ", error);
    return res
      .status(500)
      .json({ message: "UnKnown Internal Server Erorr !!" });
  }
};

export default signIn;
