import jwt from "jsonwebtoken";
const isTokenValid = (token: string): object | string =>
  jwt.verify(token, process.env.JWT_SECRET as string);

module.exports = {
  isTokenValid,
};
