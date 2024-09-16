import bycrypt from "bcrypt";
import { VendorPayload } from "../dto";
import jwt from "jsonwebtoken";
import { APP_SECRET } from "../config";

export const GenerateSalt = async () => {
  return await bycrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bycrypt.hash(password, salt);
};

export const ValidatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSignature = (payload: VendorPayload) => {
  return jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
};
