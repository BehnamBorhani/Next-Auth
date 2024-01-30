import connectToDB from "@/configs/db";
import userModel from "@/models/user";
import { generateToken, hashPassword } from "@/utils/auth";
import { serialize } from "cookie";

const signUp = async (req, res) => {
  if (req.method !== "POST") {
    return false;
  }

  try {
    connectToDB();
    const { firstname, lastname, username, email, password } = req.body;
    if (
      !firstname.trim() ||
      !lastname.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      return res.status(422).json({ message: "data is not valid!!!" });
    }

    const isUserExist = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserExist) {
      return res
        .status(422)
        .json({ message: "this username or email is already exist!" });
    }

    const hashedPassword = await hashPassword(password);
    const token = generateToken({ email });

    const users = await userModel.find({});
    const newUser = await userModel.create({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      role: users.length > 0 ? "USER" : "ADMIN",
    });

    return res
      .setHeader(
        "Set-Cookie",
        serialize("token", token, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        })
      )
      .status(201)
      .json({ message: "user signup successfully :)", user: newUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "unknown internal server error" });
  }
};

export default signUp;
