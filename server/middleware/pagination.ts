import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";

interface Results {
  next?: { page: number; limit: number };
  previous?: { page: number; limit: number };
  result: any[] | null;
}
declare module "express-serve-static-core" {
  interface Response {
    paginationResult?: any;
  }
}

const pagination = (model: Model<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let page = 1;
    let limit = 5;

    if (req.query.page !== undefined) {
      page = Number(req.query.page);
    }

    if (req.query.limit !== undefined) {
      limit = Number(req.query.limit);
    }

    let results: Results = { result: null };
    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;

    if (endIndex < (await model.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    } else {
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
    } else {
      results.previous = {
        page: -1,
        limit: limit,
      };
    }

    try {
      results.result = await model
        .find()
        .select("-password -subtotal -clientSecret  -updatedAt")
        .limit(limit)
        .skip(startIndex)
        .exec();
      // Tell TypeScript that Response object has a paginationResult property
      // console.log(results);
      res.paginationResult = results;
      next();
    } catch (error: any) {
      console.log(error);
    }
  };
};

module.exports = pagination;
