import OtpModel from "@/models/otp";
import UserModel from "@/models/user";
import { generateToken } from "@/utils/auth";
import { serialize } from "cookie";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return false;
  }

  const { phone: phoneNumber, code } = req.body;

  const { expTime, firstname, lastname, username, email, phone, password } =
    await OtpModel.findOne(
      { phone: phoneNumber, code },
      "-_id -code -createdAt -updatedAt -__v"
    );

  if (expTime) {
    const date = new Date();
    const now = date.getTime(); // 8 - 10 || 12 - 10

    if (expTime > now) {
      const users = await UserModel.find({});
      const newUser = await UserModel.create({
        firstname,
        lastname,
        username,
        email,
        phone,
        password,
        role: users.length > 0 ? "USER" : "ADMIN",
      });

      await OtpModel.findOneAndDelete({ phone: phoneNumber, code });

      const token = generateToken({ email });

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
    } else {
      return res.status(410).json({ message: "Code is expired !!" });
    }
  } else {
    return res.status(409).json({ message: "Code is not correct !!" });
  }
};

export default handler;
