// index.ts
import { CustomAPIError } from "./custom-api";
import UnauthenticatedError from "./unauthenticated";
import NotFoundError from "./not-found";
import BadRequestError from "./bad-request";
import UnauthorizedErrorFound from "./unauthorizedError";

module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedErrorFound,
};
