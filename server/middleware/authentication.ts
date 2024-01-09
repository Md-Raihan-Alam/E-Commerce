import { Request, Response, NextFunction } from "express";
const { isTokenValid, attachCookiesToResponse } = require("../utils");
const Token = require("../models/Token");
const { UnauthenticatedError } = require("../errors");
interface AuthRequest extends Request {
  user?: any;
}
const authneticateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken, accessToken } = req.signedCookies;
  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }
    const payload = isTokenValid(refreshToken);
    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });
    // console.log(existingToken);
    if (!existingToken || !existingToken?.isValid) {
      throw new UnauthenticatedError("Authentication Invalid");
    }
    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });
    req.user = payload.user;
    next();
  } catch (error) {
    console.log(error);
    throw new UnauthenticatedError("Authentication Invalid");
  }
};
const authorizePermissions = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthenticatedError("Unautorized to access this route");
    }
    next();
  };
};
module.exports = {
  authneticateUser,
  authorizePermissions,
};
