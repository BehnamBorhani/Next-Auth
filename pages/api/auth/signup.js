import connectToDB from "@/configs/db";
import userModel from "@/models/user";

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

    const users = await userModel.find({});
    const newUser = await userModel.create({
      firstname,
      lastname,
      username,
      email,
      password,
      role: users.length > 0 ? "USER" : "ADMIN",
    });

    return res
      .status(201)
      .json({ message: "user signup successfully :)", user: newUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "unknown internal server error" });
  }
};

export default signUp;
