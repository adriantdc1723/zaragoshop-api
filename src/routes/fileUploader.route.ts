import { Router } from "express";
import * as fileUploadController from "../controllers/fileUploader.controller";

const FileUploaderRoute = Router();

FileUploaderRoute.post(
  "/upload/product-image",
  fileUploadController.fileUpload
);

export default FileUploaderRoute;
