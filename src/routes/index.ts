import { Router } from "express";
import UsersRoute from "./users.route";
import UsersInformationRoute from "./usersInformation.route";
import FileUploadRoute from "./fileUploader.route";

const ROUTES: Router[] = [UsersRoute, UsersInformationRoute, FileUploadRoute];

export default ROUTES;
