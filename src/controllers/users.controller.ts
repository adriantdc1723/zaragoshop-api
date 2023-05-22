import { RequestHandler } from "express";
import status from "http-status";
import { bad, good } from "../utils/api-response";
import * as usersService from "../services/users.service";
import CreateUserDto from "../models/user/dto/CreateUserDto";
import {
  EMAIL_ADDRESS_ALREADY_USE,
  INVALID_ID,
  USERNAME_ALREADY_USE,
  USERNAME_PASSWORD_NOT_MATCH,
  USER_CREATED_SUCCESSFULLY,
  USER_DOES_NOT_EXIST,
  USER_LOGIN_SUCCESS,
  USER_PASSWORD_UPDATED,
  USER_UPDATED,
} from "../constants/response-message";
import jwt, { SignOptions } from "jsonwebtoken";
import { Types } from "mongoose";
import UpdateUserDto from "../models/user/dto/UpdateUserDto";
import database from "../database";
import { UpdateUserPasswordDto } from "../models/user/dto/UpdateUserPasswordDto";

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

    const token = jwt.sign(
      user.toObject(),
      process.env.JWT_SECRET || "secret",
      { expiresIn: "30d" }
    );
    return res
      .status(status.OK)
      .json(good(status.OK, { accessToken: token, user }, USER_LOGIN_SUCCESS));
  } catch (error: any) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json(
        bad(status.INTERNAL_SERVER_ERROR, status[status.INTERNAL_SERVER_ERROR])
      );
  }
};

export const findUserById: RequestHandler = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await usersService.findUserById(id);
    return res.status(status.OK).json(good(status.OK, data, status[status.OK]));
  } catch (error: any) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json(
        bad(status.INTERNAL_SERVER_ERROR, status[status.INTERNAL_SERVER_ERROR])
      );
  }
};

export const findAllUsers: RequestHandler = async ({}, res) => {
  try {
    const data = await usersService.findAllUsers();
    return res.status(status.OK).json(good(status.OK, data, status[status.OK]));
  } catch (error: any) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json(bad(status.INTERNAL_SERVER_ERROR, error.message));
  }
};

export const updateUserById: RequestHandler = async (req, res) => {
  const id = req.params.id;
  const dto = req.body as UpdateUserDto;
  try {
    //check if its a valid id
    if (!database.isValidObjectId(id) || !database.isObjectIdOrHexString(id)) {
      return res
        .status(status.BAD_REQUEST)
        .json(bad(status.BAD_REQUEST, INVALID_ID));
    }
    //check if users id is existing
    if (!(await usersService.findUserById(id))) {
      return res
        .status(status.NOT_FOUND)
        .json(bad(status.NOT_FOUND, USER_DOES_NOT_EXIST));
    }
    const data = usersService.updateUserById(id, dto);
    return res
      .status(status.ACCEPTED)
      .json(good(status.ACCEPTED, data, USER_UPDATED));
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json(
        bad(status.INTERNAL_SERVER_ERROR, status[status.INTERNAL_SERVER_ERROR])
      );
  }
};

export const updateUserPasswordById: RequestHandler = async (req, res) => {
  const id = req.params.id;
  const dto = req.body as UpdateUserPasswordDto;
  try {
    const data = await usersService.updateUserPasswordById(id, dto);
    return res
      .status(status.ACCEPTED)
      .json(good(status.ACCEPTED, data, USER_PASSWORD_UPDATED));
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json(
        bad(status.INTERNAL_SERVER_ERROR, status[status.INTERNAL_SERVER_ERROR])
      );
  }
};
