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

export const UpdateVendorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const vendor = await FindVendor(user._id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    const files = req.files as [Express.Multer.File];
    const images = files.map((file: Express.Multer.File) => file.filename);

    vendor.coverImage.push(...images);
    const result = await vendor.save();

    return res.json(result);
  } catch (error: any) {
    // Catch any unhandled errors and return a server error response
    console.error("Error in AddFood:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
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
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const { name, description, category, foodType, readyTime, price } =
      req.body as CreateFoodInputs;

    // Validate required fields
    if (
      !name ||
      !description ||
      !category ||
      !foodType ||
      !readyTime ||
      !price
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const vendor = await FindVendor(user._id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    const files = req.files as [Express.Multer.File];
    const images = files.map((file: Express.Multer.File) => file.filename);

    const createFood = await Food.create({
      vendorId: vendor._id,
      name,
      description,
      category,
      foodType,
      images: images,
      readyTime,
      price,
    });

    if (createFood._id instanceof mongoose.Types.ObjectId) {
      vendor.foods.push(createFood._id);
      const result = await vendor.save();

      const populatedVendor = await Vendor.findById(vendor._id)
        .populate("foods")
        .exec();

      return res.status(201).json(populatedVendor); // Return 201 for a successful creation
    } else {
      return res.status(500).json({ error: "Invalid ObjectId" });
    }
  } catch (error: any) {
    // Catch any unhandled errors and return a server error response
    console.error("Error in AddFood:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const foods = await Food.find({ vendorId: user._id });

    if (!foods || foods.length === 0) {
      return res
        .status(404)
        .json({ message: "No foods found for this vendor" });
    }

    return res.status(200).json(foods); // Return 200 for successful retrieval
  } catch (error: any) {
    console.error("Error in GetFoods:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
