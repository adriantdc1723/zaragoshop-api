import { RequestHandler } from "express";
import status from "http-status";
import jwt from "jsonwebtoken";
import { bad } from "../utils/api-response";
import { INVALID_TOKEN, NO_TOKEN } from "../constants/response-message";

export const requireToken: RequestHandler = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(status.UNAUTHORIZED)
      .json(bad(status.UNAUTHORIZED, NO_TOKEN));
  }
  try {
    if (jwt.verify(token, process.env.JWT_SECRET || "secret")) next();
  } catch (error: any) {
    type TJwtErrorMessage = "jwt expired" | "invalid signature";
    const errMsg = error.message as TJwtErrorMessage;
    switch (errMsg) {
      case "jwt expired":
        return res
          .status(status.UNAUTHORIZED)
          .json(bad(status.UNAUTHORIZED, "Token expired"));

      case "invalid signature":
        return res
          .status(status.UNAUTHORIZED)
          .json(bad(status.UNAUTHORIZED, "Invalid token"));
      default:
        return res
          .status(status.INTERNAL_SERVER_ERROR)
          .json(
            bad(
              status.INTERNAL_SERVER_ERROR,
              status[status.INTERNAL_SERVER_ERROR]
            )
          );
    }
  }
};

export const requireTokenPaths: string[] = [
  "/api/users*",
  "/api/usersInformation*",
];
