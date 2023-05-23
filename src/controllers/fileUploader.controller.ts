import { RequestHandler } from "express";
import status from "http-status";
import { bad, good } from "../utils/api-response";
import multer from "multer";
import mime from "mime";
import { UPLOAD_SUCCESSFUL } from "../constants/response-message";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/data/uploads");
  },
  filename: (req, file, callback) => {
    const filename = "file_" + Date.now() + `.${mime.extension(file.mimetype)}`;
    callback(null, filename);
  },
});

export const fileUpload: RequestHandler = async (req, res) => {
  const upload = multer({ storage }).single("file");
  try {
    upload(req, res, function (error) {
      if (error instanceof multer.MulterError) {
        return res
          .status(status.INTERNAL_SERVER_ERROR)
          .json(bad(status.INTERNAL_SERVER_ERROR, error.message));
      } else if (error) {
        return res
          .status(status.INTERNAL_SERVER_ERROR)
          .json(bad(status.INTERNAL_SERVER_ERROR, error.message));
      }
      return res
        .status(status.OK)
        .json(good(status.OK, req.file || {}, UPLOAD_SUCCESSFUL));
    });
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json(
        bad(status.INTERNAL_SERVER_ERROR, status[status.INTERNAL_SERVER_ERROR])
      );
  }
};
