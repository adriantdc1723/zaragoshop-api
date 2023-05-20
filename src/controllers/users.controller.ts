import { RequestHandler } from "express";
import status from "http-status";
import { bad, good } from "../utils/api-response";
import * as usersService from "../services/users.service";
import CreateUserDto from "../models/user/dto/CreateUserDto";
import {
  EMAIL_ADDRESS_ALREADY_USE,
  USERNAME_ALREADY_USE,
  USER_CREATED_SUCCESSFULLY,
} from "../constants/response-message";

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
