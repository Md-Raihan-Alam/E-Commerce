import { Request, Response, NextFunction } from "express";
const { isTokenValid, attachCookiesToResponse } = require("../utils");
const { UnauthenticatedError } = require("../errors");
interface AuthRequest extends Request {
  user?: any;
}
const authorizePermissions = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthenticatedError("Unautorized to access this route");
    }
    next();
  };
};
module.exports = {
  authorizePermissions,
};
