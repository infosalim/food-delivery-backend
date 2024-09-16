import { NextFunction, Request, Response } from "express";
import { VendorLoginInputs } from "../dto";
import { FindVendor } from "./AdminController";
import { GenerateSignature, ValidatePassword } from "../utility";

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VendorLoginInputs>req.body;

  const existingVendor = await FindVendor("", email);

  if (existingVendor !== null) {
    const validation = await ValidatePassword(
      password,
      existingVendor.password as string,
      existingVendor.salt as string
    );

    if (validation) {
      const signature = GenerateSignature({
        _id: existingVendor.id,
        email: existingVendor.email as string,
        name: existingVendor.name as string,
        foodTypes: existingVendor.foodType as string[], // Assuming this is an array of strings
      });
      return res.json(signature);
    } else {
      return res.json({ message: "Password is not valid" });
    }
  }
  return res.json({ message: "Login credential is not valid" });
};

export const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
