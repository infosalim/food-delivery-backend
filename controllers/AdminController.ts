import { NextFunction, Request, Response } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";

export const FindVendor = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Vendor.findOne({ email: email });
  } else {
    return await Vendor.findById(id);
  }
};

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

  const existingVendor = await FindVendor("", email);

  // const existingVendor = await Vendor.findOne({
  //   $or: [{ email: email }, { phone: phone }],
  // });

  if (existingVendor !== null) {
    return res.status(400).json({
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
) => {
  try {
    // Fetch all vendors from the database
    const vendors = await Vendor.find();

    if (vendors && vendors.length > 0) {
      return res.json(vendors);
    } else {
      return res.status(404).json({ message: "Vendors data not available" });
    }
  } catch (error: any) {
    // Handle any errors that might occur during the database query
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

// GET Vendor by ID
export const GetVendorByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendorId = req.params.id;

    // Assuming FindVendor is an asynchronous function that fetches vendor data
    const vendor = await FindVendor(vendorId);

    if (vendor) {
      return res.json(vendor);
    } else {
      return res.status(404).json({ message: "Vendor data not available" });
    }
  } catch (error:any) {
    // If there's an error in FindVendor or elsewhere, handle it here
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};