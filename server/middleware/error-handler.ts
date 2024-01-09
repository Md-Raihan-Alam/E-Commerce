import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "../errors/custom-api";
interface ValidationErrorType extends CustomAPIError {
  errors: Record<string, { message: string }>;
}

interface DuplicateErrorType extends CustomAPIError {
  keyValue: Record<string, any>;
}

interface CastErrorType extends CustomAPIError {
  value: any;
}
const errorHandlerMiddleware = (
  err: CustomAPIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };
  if (err.name === "ValidationError") {
    const validationError = err as ValidationErrorType;
    customError.msg = Object.values(validationError.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = 400;
  }
  if (err.code && err.code === 11000) {
    const duplicateError = err as DuplicateErrorType;
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }
  if (err.name === "CastError") {
    const castError = err as CastErrorType;
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = 404;
  }
  return res.status(customError.statusCode).json({ msg: customError.msg });
};
module.exports = errorHandlerMiddleware;
