import { RequestHandler } from "express";
import * as usersInformationService from "../services/usersInformation.service";
import { bad, good } from "../utils/api-response";
import status from "http-status";
import CreateuserInformationDto from "../models/userInformation/dto/CreateUserInformationDto";

export const createUserInformation: RequestHandler = async (req, res) => {
  const dto = req.body as CreateuserInformationDto;
  try {
    const data = await usersInformationService.createUserInformation(dto);
    return res
      .status(status.CREATED)
      .json(good(status.CREATED, data, status[status.CREATED]));
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json(
        bad(status.INTERNAL_SERVER_ERROR, status[status.INTERNAL_SERVER_ERROR])
      );
  }
};

export const findUserInformationByUserId: RequestHandler = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await usersInformationService.findUserInformationById(id);
    return res.status(status.OK).json(good(status.OK, data, status[status.OK]));
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json(
        bad(status.INTERNAL_SERVER_ERROR, status[status.INTERNAL_SERVER_ERROR])
      );
  }
};
