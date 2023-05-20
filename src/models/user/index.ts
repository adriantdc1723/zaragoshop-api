import { Model } from "mongoose";
import database from "../../database";

export interface IUser {
  username: string;
  emailAddress: string;
  password: string;
}

export interface UserModel extends Model<IUser> {
  isEmailAddressExist: (emailAddress: string) => Promise<boolean>;
  isUsernameExist: (username: string) => Promise<boolean>;
}

export const userSchema = new database.Schema<IUser, UserModel>(
  {
    username: { type: String, required: true, unique: true },
    emailAddress: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret, options) {
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.password;
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

//statics
userSchema.static(
  "isEmailAddressExist",
  async function isEmailAddressExist(emailAddress: string = "") {
    if (!emailAddress) {
      throw new Error("No Email address provided");
    }
    const User = this;
    const count = await User.find({ emailAddress }).count();
    if (count) {
      return true;
    }
    return false;
  }
);

userSchema.static(
  "isUsernameExist",
  async function isUsernameExist(username: string = "") {
    if (!username) {
      throw new Error("No Username provided");
    }
    const User = this;
    const count = await User.find({ username }).count();
    if (count) {
      return true;
    }
    return false;
  }
);

const User = database.model<IUser, UserModel>("User", userSchema);

export default User;
