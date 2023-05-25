import { Schema, Types, model } from "mongoose";
import { User } from "../../types/user";

const UserSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  refreshTokens: Array<{ tokenHash: string; invalid: boolean; }>
});

export const UserModel = model<User>('User', UserSchema);