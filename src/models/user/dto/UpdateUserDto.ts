import { Types } from "mongoose";

export default class UpdateUserDto {
  username?: string;
  emailAddress?: string;
  password?: string;
}
