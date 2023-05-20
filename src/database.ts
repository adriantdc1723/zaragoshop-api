import { Mongoose } from "mongoose";

const database: Mongoose = new Mongoose();

//event listener
database.connection.once("open", () =>
  console.log("[database]: Connected to", database.connection.db.databaseName)
);
database.connection.on("error", (error: Error) =>
  console.log("[database]: Error:", error.message)
);

export default database;
