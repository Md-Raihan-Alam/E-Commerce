"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { isTokenValid, attachCookiesToResponse } = require("../utils");
const { UnauthenticatedError } = require("../errors");
const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new UnauthenticatedError("Unautorized to access this route");
        }
        next();
    };
};
module.exports = {
    authorizePermissions,
};
