import { NextFunction, Request, Response } from 'express';
import { Vendor } from '../models';

export const GetFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false,
  })
    .sort([['rating', 'descending']])
    .populate('foods');

  if (result.length > 0) {
    return res.status(200).json(result);
  }

  return res.status(400).json({ message: 'Data not found' });
};

export const GetTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false,
  })
    .sort([['rating', 'descending']])
    .limit(1);

  if (result.length > 0) {
    return res.status(200).json(result);
  }

  return res.status(400).json({ message: 'Data not found' });
};

export const GetFoodsIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
export const SearchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
export const RestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
