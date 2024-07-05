import { NextFunction, Request, Response } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";

// CREATE Vendor
export const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    ownerName,
    address,
    pincode,
    foodType,
    email,
    password,
    phone,
  } = <CreateVendorInput>req.body;

  const existingVendor = await Vendor.findOne({
    $or: [{ email: email }, { phone: phone }],
  });

  if (existingVendor !== null) {
    return res
      .status(400)
      .json({
        message:
          "A vendor is already created with this Email ID or Phone Number!",
      });
  }

  // generate salt
  const salt = await GenerateSalt();

  // encript password using the salt
  const userPassword = await GeneratePassword(password, salt);

  const createVendor = await Vendor.create({
    name,
    ownerName,
    address,
    pincode,
    foodType,
    email,
    password: userPassword,
    phone,
    salt: salt,
    rating: 0,
    serviceAvailable: false,
    coverImage: [],
  });

  return res.json(createVendor);
};

// GET Vendors
export const GetVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

// GET Vendor by ID
export const GetVendorByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
