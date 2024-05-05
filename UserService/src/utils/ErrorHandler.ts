import BaseError from "./Error";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "./ErrorCode";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(
    "Error message from the centralized error-handling component",
    err
  );
  if (err instanceof BaseError)
    return res.status(err.httpCode).json(JSON.parse(err.message));
  return res
    .status(500)
    .send({ errors: [{ message: "Something went wrong" }] });
};

export const handleMongoError = (err: any) => {
  if (err.code === 11000)
    throw new BaseError(
      "DUPLICATE ENTRY",
      HttpStatusCode.BAD_REQUEST,
      JSON.stringify({ error: `Account alread exist` })
    );
  throw new BaseError(
    "MONGO ERROR",
    HttpStatusCode.INTERNAL_SERVER,
    JSON.stringify({ error: err.errmsg })
  );
};
