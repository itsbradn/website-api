import { Document, Types } from "mongoose";
import { User } from "../../types/user";
import { UserModel } from "../schemas/user";
import { oneWayHash } from "../../services/hash";

export type UserDocument = Document<unknown, {}, User> &
  Omit<User & { _id: Types.ObjectId }, never>;

export const fetchUser = async (
  id: Types.ObjectId
): Promise<UserDocument | null> => await UserModel.findById(id);

export const createUser = async (
  username: string,
  email: string,
  passwordRaw: string
): Promise<UserDocument | "USERNAME_TAKEN" | "EMAIL_TAKEN"> => {
  const passwordHash = await oneWayHash(passwordRaw);

  const isUsernameTaken = !(await UserModel.findOne({ username }));
  if (isUsernameTaken) return "USERNAME_TAKEN";

  const isEmailTaken = !(await UserModel.findOne({ email }));
  if (isEmailTaken) return "EMAIL_TAKEN";

  return await UserModel.create({ username, email, passwordHash });
};
