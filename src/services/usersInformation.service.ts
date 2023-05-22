import UserInformation from "../models/userInformation";
import CreateuserInformationDto from "../models/userInformation/dto/CreateUserInformationDto";

export const createUserInformation = async (
  createUserInformationDto: CreateuserInformationDto
) => {
  const userInformation = new UserInformation(createUserInformationDto);
  const doc = await userInformation.save();
  return doc;
};

export const findUserInformationById = async (id: string) => {
  const doc = await UserInformation.findById(id).populate("user");
  return doc;
};
