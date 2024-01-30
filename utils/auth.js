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

const verifyPassword = async (password, hashedPassword) => {
  const isValid = await compare(password, hashedPassword);
  return isValid;
};

const verifyToken = (token) => {
  try {
    const validationResult = verify(token, process.env.PRIVATE_KEY);
    return validationResult;
  } catch (error) {
    console.log("verify token error => ", error);
    return false;
  }
};

export { hashPassword, generateToken, verifyPassword, verifyToken };
