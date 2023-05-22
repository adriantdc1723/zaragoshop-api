import dotenv from "dotenv";
import app from "./app";
import database from "./database";
dotenv.config();

const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const port = process.env.PORT || 8999;

const uri = `mongodb+srv://${dbUsername}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`;

const bootstrap = async (): Promise<void> => {
  try {
    await database.connect(uri);
    app
      .listen(port, () => console.log("[server]: Listening at port", port))
      .on("error", (error) => console.log("[server]: Error:", error.message));
  } catch (err) {}
};

bootstrap();
