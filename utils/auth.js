import { sign, verify } from "jsonwebtoken";

const { hash, compare } = require("bcryptjs");

const hashPassword = async (password) => {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
};

const generateToken = (data) => {
  const token = sign({ ...data }, process.env.PRIVATE_KEY, {
    algorithm: "HS256",
    expiresIn: "7d",
  });
  return token;
};

const verifyPassword = (password, hashedPassword) => {
  try {
    const validationResult = compare(password, hashedPassword);
    return validationResult;
  } catch (error) {
    console.log("verify token error => ", error);
    return false;
  }
};

export { hashPassword, generateToken, verifyPassword };
