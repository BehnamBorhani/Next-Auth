const { hash } = require("bcryptjs");

const hashPassword = async (password) => {
  const hashedPassword = await hash(password, 2024);
  return hashedPassword;
};

export { hashPassword };
