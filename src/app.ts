import express, { Express, json } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import ROUTES from "./routes";
import { requestLogger } from "./middlewares/request-logger.middleware";
import {
  requireToken,
  requireTokenPaths,
} from "./middlewares/require-token.middleware";

const app: Express = express();

//middlewares
app.use(json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(requestLogger);
app.all(requireTokenPaths, requireToken);

//routes
app.get("/api", ({}, res) =>
  res.status(200).json({ message: "Welcome to ZaraGoShop Api" })
);

app.use("/api", ROUTES);

app.use("/", ({}, res) => res.status(404).json({ message: "Not found" }));

export default app;
