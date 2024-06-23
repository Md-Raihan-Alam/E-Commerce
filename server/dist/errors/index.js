"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
const custom_api_1 = require("./custom-api");
const unauthenticated_1 = __importDefault(require("./unauthenticated"));
const not_found_1 = __importDefault(require("./not-found"));
const bad_request_1 = __importDefault(require("./bad-request"));
const unauthorizedError_1 = __importDefault(require("./unauthorizedError"));
module.exports = {
    CustomAPIError: custom_api_1.CustomAPIError,
    UnauthenticatedError: unauthenticated_1.default,
    NotFoundError: not_found_1.default,
    BadRequestError: bad_request_1.default,
    UnauthorizedErrorFound: unauthorizedError_1.default,
};
