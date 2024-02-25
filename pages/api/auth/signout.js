import { serialize } from "cookie";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return false;
  }

  return res
    .setHeader(
      "Set-Cookie",
      serialize("token", "", {
        path: "/",
        maxAge: 0,
      })
    )
    .status(200)
    .json({ message: "User logged out successfully!" });
};
export default handler;
