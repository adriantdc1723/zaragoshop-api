import User from "../models/user";
import CreateUserDto from "../models/user/dto/CreateUserDto";

export const createUser = async (createUserDto: CreateUserDto) => {
  const user = new User(createUserDto);
  const doc = await user.save();
  return doc;
};

export const isEmailAddressExist = async (emailAddress: string = "") => {
  return await User.isEmailAddressExist(emailAddress);
};

export const isUsernameExist = async (username: string = "") => {
  return await User.isEmailAddressExist(username);
};

export const verifyUser = async (
  username: string = "",
  password: string = ""
) => {
  return await User.verifyUser(username, password);
};
