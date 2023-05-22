import {
  HydratedDocument,
  Model,
  ToObjectOptions,
  Types,
  Schema,
} from "mongoose";
import database from "../../database";
import bcrypt from "bcrypt";
import { userInformationSchema } from "../userInformation";

export type TUserAccountType = "native" | "sso";

export interface IUser {
  username: string;
  emailAddress: string;
  password: string;
  accountType: TUserAccountType;
  userInformation: Types.ObjectId;
}

export interface UserModel extends Model<IUser> {
  updateUserPasswordById: (
    id: string,
    update: Partial<IUser> & Pick<IUser, "password">
  ) => Promise<HydratedDocument<IUser> | null>;
  isEmailAddressExist: (emailAddress: string) => Promise<boolean>;
  isUsernameExist: (username: string) => Promise<boolean>;
  verifyUser: (
    username: string,
    password: string
  ) => Promise<HydratedDocument<IUser> | null>;
}

export const userSchema = new database.Schema<IUser, UserModel>(
  {
    username: { type: String, required: true, unique: true },
    emailAddress: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accountType: { type: String, default: "native" },
    userInformation: { type: Schema.Types.ObjectId, ref: "UserInformation" },
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
    toObject: {
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
  async function isEmailAddressExist(
    emailAddress: string = ""
  ): Promise<boolean> {
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
  async function isUsernameExist(username: string = ""): Promise<boolean> {
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

userSchema.static(
  "verifyUser",
  async function verifyUser(username: string = "", password: string = "") {
    try {
      const user = await User.findOne({ username });
      if (user) {
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
          return null;
        }
        return user;
      }
      return null;
    } catch (error: any) {
      throw error;
    }
  }
);

userSchema.static(
  "updateUserPasswordById",
  async function updateUserPasswordById(
    id: string,
    update: Partial<IUser> & Pick<IUser, "password">
  ) {
    const { password } = update;
    try {
      const updatedHashedPassword = await bcrypt.hash(password, 10);
      return await this.findByIdAndUpdate(id, {
        password: updatedHashedPassword,
      });
    } catch (error) {
      throw new Error("Cannot update password");
    }
  }
);

//pre hooks
userSchema.pre("save", async function (next) {
  const user = this;
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
  } catch (error) {
    throw new Error("Error hashing password");
  }
});

const User = database.model<IUser, UserModel>("User", userSchema);

export default User;
