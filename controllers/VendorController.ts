import { NextFunction, Request, Response } from "express";
import { CreateFoodInputs, EditVendorInputs, VendorLoginInputs } from "../dto";
import { FindVendor } from "./AdminController";
import { GenerateSignature, ValidatePassword } from "../utility";
import { Food, Vendor } from "../models";
import mongoose from "mongoose";

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
) => {
  const user = req.user;

  if (user) {
    const existingVendor = await FindVendor(user?._id);
    return res.json(existingVendor);
  }

  return res.json({ message: "Vendor information not found" });
};

export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { foodTypes, name, address, phone } = <EditVendorInputs>req.body;
  const user = req.user;

  if (user) {
    const existingVendor = await FindVendor(user?._id);
    if (existingVendor !== null) {
      existingVendor.name = name;
      existingVendor.address = address;
      existingVendor.phone = phone;
      existingVendor.foodType = foodTypes;

      const saveResult = await existingVendor.save();
      return res.json(saveResult);
    }
    return res.json(existingVendor);
  }

  return res.json({ message: "Vendor information not found" });
};

export const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingVendor = await FindVendor(user?._id);
    if (existingVendor !== null) {
      existingVendor.serviceAvailable = !existingVendor.serviceAvailable;

      const saveResult = await existingVendor.save();
      return res.json(saveResult);
    }
    return res.json(existingVendor);
  }

  return res.json({ message: "Vendor information not found" });
};

export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const { name, description, category, foodType, readyTime, price } =
      req.body as CreateFoodInputs;

    const vendor = await FindVendor(user._id);

    if (vendor !== null) {
      const createFood = await Food.create({
        vendorId: vendor._id,
        name: name,
        description: description,
        category: category,
        foodType: foodType,
        images: ["mock.jpg"],
        readyTime: readyTime,
        price: price,
      });

      // Cast or validate ObjectId
      if (createFood._id instanceof mongoose.Types.ObjectId) {
        vendor.foods.push(createFood._id);
        const result = await vendor.save();

        const populatedVendor = await Vendor.findById(vendor._id).populate('foods').exec();

        return res.json(populatedVendor);

      } else {
        return res.status(500).json({ error: "Invalid ObjectId" });
      }
    }
  }

  return res.json({ message: "Foods information not found" });
};

export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
  }

  return res.json({ message: "Something went wrong with food" });
};
