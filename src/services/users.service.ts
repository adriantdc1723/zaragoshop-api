import { Types } from "mongoose";
import User from "../models/user";
import CreateUserDto from "../models/user/dto/CreateUserDto";
import UpdateUserDto from "../models/user/dto/UpdateUserDto";
import { UpdateUserPasswordDto } from "../models/user/dto/UpdateUserPasswordDto";

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

export const findUserById = async (id: string) => {
  const doc = await User.findById(id).populate("userInformation");
  return doc;
};

export const findAllUsers = async () => {
  const docs = await User.find();
  return docs;
};

export const updateUserById = async (
  id: string,
  updateUserDto: Partial<UpdateUserDto> & Pick<UpdateUserDto, "password">
) => {
  const { password, ...patch } = updateUserDto;
  const updatedDoc = await User.findByIdAndUpdate(id, patch);
  return updatedDoc;
};

export const updateUserPasswordById = async (
  id: string,
  updateUserPasswordDto: UpdateUserPasswordDto
) => {
  return await User.updateUserPasswordById(id, updateUserPasswordDto);
};
