// unauthorized.ts
import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "./custom-api";

class UnauthorizedErrorFound extends CustomAPIError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnauthorizedErrorFound;
