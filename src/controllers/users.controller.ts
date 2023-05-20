import { RequestHandler } from "express";
import status from "http-status";
import { bad, good } from "../utils/api-response";
import * as usersService from "../services/users.service";
import CreateUserDto from "../models/user/dto/CreateUserDto";
import {
  EMAIL_ADDRESS_ALREADY_USE,
  USERNAME_ALREADY_USE,
  USERNAME_PASSWORD_NOT_MATCH,
  USER_CREATED_SUCCESSFULLY,
  USER_LOGIN_SUCCESS,
} from "../constants/response-message";
import jwt from "jsonwebtoken";

export const createUser: RequestHandler = async (req, res) => {
  const dto = req.body as CreateUserDto;
  try {
    if (await usersService.isEmailAddressExist(dto.emailAddress)) {
      return res
        .status(status.BAD_REQUEST)
        .json(bad(status.BAD_REQUEST, EMAIL_ADDRESS_ALREADY_USE));
    }

    if (await usersService.isUsernameExist(dto.username)) {
      return res
        .status(status.BAD_REQUEST)
        .json(bad(status.BAD_REQUEST, USERNAME_ALREADY_USE));
    }

    const data = await usersService.createUser(dto);
    return res
      .status(status.CREATED)
      .json(good(status.CREATED, data, USER_CREATED_SUCCESSFULLY));
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json(
        bad(status.INTERNAL_SERVER_ERROR, status[status.INTERNAL_SERVER_ERROR])
      );
  }
};

export const loginUser: RequestHandler = async (req, res) => {
  const dto = req.body;
  try {
    const user = await usersService.verifyUser(dto.username, dto.password);
    if (!user) {
      return res
        .status(status.BAD_REQUEST)
        .json(bad(status.BAD_REQUEST, USERNAME_PASSWORD_NOT_MATCH));
    }
    const token = jwt.sign(user, process.env.JWT_SECRET || "secret");
    return res
      .status(status.OK)
      .json(good(status.OK, { accessToken: token }, USER_LOGIN_SUCCESS));
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json(
        bad(status.INTERNAL_SERVER_ERROR, status[status.INTERNAL_SERVER_ERROR])
      );
  }
};
