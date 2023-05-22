import { Router } from "express";
import * as usersController from "../controllers/users.controller";

const UsersRoute = Router();

UsersRoute.post("/register", usersController.createUser);
UsersRoute.post("/login", usersController.loginUser);
UsersRoute.get("/users/:id", usersController.findUserById);
UsersRoute.get("/users", usersController.findAllUsers);
UsersRoute.patch("/users/:id", usersController.updateUserById);
UsersRoute.patch(
  "/users/update-password/:id",
  usersController.updateUserPasswordById
);

export default UsersRoute;
