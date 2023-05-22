import { Schema, Types } from "mongoose";
import database from "../../database";

export interface IUserInformation {
  firstName: string;
  middleName?: string;
  lastName: string;
  user: Types.ObjectId;
}

export const userInformationSchema = new database.Schema<IUserInformation>(
  {
    firstName: { type: String, require: true },
    middleName: String,
    lastName: { type: String, require: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    toObject: {
      transform(doc, ret, options) {
        delete ret.user;
        delete ret._id;
        delete ret.__v;
      },
    },
    toJSON: {
      transform(doc, ret, options) {
        delete ret.user;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const UserInformation = database.model<IUserInformation>(
  "UserInformation",
  userInformationSchema
);

export default UserInformation;
