import { Router } from "express";
import * as usersController from "../controllers/users.controller";

const UsersRoute = Router();

UsersRoute.post("/users", usersController.createUser);
UsersRoute.post("/login", usersController.loginUser);

export default UsersRoute;
