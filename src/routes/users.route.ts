import { Router } from "express";
import * as usersController from "../controllers/users.controller";

const UsersRoute = Router();

UsersRoute.post("/users", usersController.createUser);

export default UsersRoute;
