"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pagination = (model) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let page = 1;
        let limit = 5;
        if (req.query.page !== undefined) {
            page = Number(req.query.page);
        }
        if (req.query.limit !== undefined) {
            limit = Number(req.query.limit);
        }
        let results = { result: null };
        let startIndex = (page - 1) * limit;
        let endIndex = page * limit;
        if (endIndex < (yield model.countDocuments().exec())) {
            results.next = {
                page: page + 1,
                limit: limit,
            };
        }
        else {
            results.next = {
                page: -1,
                limit: limit,
            };
        }
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit,
            };
        }
        else {
            results.previous = {
                page: -1,
                limit: limit,
            };
        }
        try {
            results.result = yield model
                .find()
                .select("-password -subtotal -clientSecret  -updatedAt")
                .limit(limit)
                .skip(startIndex)
                .exec();
            // Tell TypeScript that Response object has a paginationResult property
            // console.log(results);
            res.paginationResult = results;
            next();
        }
        catch (error) {
            console.log(error);
        }
    });
};
module.exports = pagination;
