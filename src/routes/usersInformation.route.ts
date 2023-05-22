import { Router } from "express";
import * as usersController from "../controllers/usersInformation.controller";

const UsersInformationRoute = Router();

UsersInformationRoute.post(
  "/usersInformation",
  usersController.createUserInformation
);

UsersInformationRoute.get(
  "/usersInformation/:id",
  usersController.findUserInformationByUserId
);

export default UsersInformationRoute;
