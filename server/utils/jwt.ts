import jwt from "jsonwebtoken";
import { Response } from "express";
interface Payload {
  user: string;
  refreshToken?: string;
}
const createJWT = ({ payload }: { payload: Payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string);
  return token;
};
const isTokenValid = (token: string): object | string =>
  jwt.verify(token, process.env.JWT_SECRET as string);

const attachCookiesToResponse = ({
  res,
  user,
  refreshToken,
}: {
  res: Response;
  user: string;
  refreshToken: string;
}) => {
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });
  const longerExp = 1000 * 60 * 60 * 24 * 30;
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });
  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + longerExp),
  });
};
module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
