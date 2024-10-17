import bycrypt from 'bcrypt';
import { AuthPayload, VendorPayload } from '../dto';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../config';
import { Request } from 'express';

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
  return jwt.sign(payload, APP_SECRET, { expiresIn: '1d' });
};

export const ValidateSignature = async (req: Request) => {
  const signature = req.get('Authorization');

  if (signature) {
    const payload = (await jwt.verify(
      signature.split(' ')[1],
      APP_SECRET
    )) as AuthPayload;

    req.user = payload;

    return true;
  }

  return false;
};
