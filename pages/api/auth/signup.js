import connectToDB from "@/configs/db";
import userModel from "@/models/user";
import otpModel from "@/models/otp";
import { generateToken, hashPassword } from "@/utils/auth";
import { serialize } from "cookie";
import request from "request";

const signUp = async (req, res) => {
  if (req.method !== "POST") {
    return false;
  }

  try {
    connectToDB();
    const { firstname, lastname, username, email, phone, password } = req.body;
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

    const date = new Date();
    const expTime = date.getTime() + 300000;
    const code = Math.floor(Math.random() * 99999);
    const hashedPassword = await hashPassword(password);
    request.post(
      {
        url: "http://ippanel.com/api/select",
        body: {
          op: "pattern",
          user: "09921558293",
          pass: "sabzLearn12!@",
          fromNum: "3000505",
          toNum: phone,
          patternCode: "jqcrkffb9sevvss",
          inputData: [{ "verification-code": code }],
        },
        json: true,
      },
      async function (error, response, body) {
        console.log(req.body);

        if (!error && response.statusCode === 200) {
          //YOU‌ CAN‌ CHECK‌ THE‌ RESPONSE‌ AND SEE‌ ERROR‌ OR‌ SUCCESS‌ MESSAGE

          await otpModel.create({
            firstname,
            lastname,
            username,
            email,
            password: hashedPassword,
            phone,
            code,
            expTime,
          });

          return res
            .status(201)
            .json({ message: "Code Sent Successfully :))", code });
        } else {
          console.log("whatever you want");
          return res.status(500).json({ message: "UnKnown Error !!" });
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "unknown internal server error" });
  }
};

export default signUp;
