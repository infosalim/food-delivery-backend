import { NextFunction, Request, Response } from 'express';
import { FoodDoc, Vendor } from '../models';

// Controller to get food availability based on a pincode
export const GetFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  try {
    // Find vendors that match the provided pincode and have service unavailable
    const result = await Vendor.find({
      pincode: pincode,
      serviceAvailable: false,
    })
      .sort([['rating', 'descending']]) // Sort by rating in descending order
      .populate('foods'); // Populate the foods field with related documents

    // If vendors are found, return them
    if (result.length > 0) {
      return res.status(200).json(result);
    }

    // If no vendors are found, return a 400 error with a message
    return res.status(400).json({ message: 'Data not found' });
  } catch (error) {
    // Handle any errors that occur during the query or processing
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Controller to get the top-rated restaurant based on pincode
export const GetTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  try {
    // Find vendors with the given pincode and service unavailable, and limit to one top-rated result
    const result = await Vendor.find({
      pincode: pincode,
      serviceAvailable: false,
    })
      .sort([['rating', 'descending']]) // Sort by rating in descending order
      .limit(1); // Limit result to 1 (top-rated restaurant)

    // If a vendor is found, return it
    if (result.length > 0) {
      return res.status(200).json(result);
    }

    // If no vendors are found, return a 400 error with a message
    return res.status(400).json({ message: 'Data not found' });
  } catch (error) {
    // Handle any errors that occur during the query or processing
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Controller to get foods available within 30 minutes based on pincode
export const GetFoodsIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  try {
    // Find vendors with the given pincode and service unavailable, and populate foods
    const result = await Vendor.find({
      pincode: pincode,
      serviceAvailable: false,
    }).populate('foods'); // Populate the foods field with related documents

    // If vendors are found
    if (result.length > 0) {
      let foodResult: any = [];

      // Loop through each vendor and filter foods that have a ready time of 30 minutes or less
      result.map((vendor) => {
        const foods = vendor.foods as unknown as [FoodDoc]; // Cast foods to FoodDoc[]
        foodResult.push(...foods.filter((food) => food.readyTime <= 30)); // Filter and add foods that are ready in <= 30 minutes
      });

      return res.status(200).json(foodResult); // Return the filtered foods
    }

    // If no vendors are found, return a 400 error with a message
    return res.status(400).json({ message: 'Data not found' });
  } catch (error) {
    // Handle any errors that occur during the query or processing
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Controller to search foods based on pincode
export const SearchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  try {
    // Find vendors with the given pincode and service unavailable, and populate foods
    const result = await Vendor.find({
      pincode: pincode,
      serviceAvailable: false,
    }).populate('foods'); // Populate the foods field with related documents

    // If vendors are found
    if (result.length > 0) {
      let foodResult: any = [];

      // Loop through each vendor and collect their foods
      result.map((item) => foodResult.push(...item.foods)); // Push all foods into the foodResult array

      return res.status(200).json(foodResult); // Return all foods
    }

    // If no vendors are found, return a 400 error with a message
    return res.status(400).json({ message: 'Data not found' });
  } catch (error) {
    // Handle any errors that occur during the query or processing
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Controller to get a restaurant by its ID
export const RestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  try {
    // Find a vendor by ID and populate its foods
    const result = await Vendor.findById(id).populate('foods'); // Populate the foods field with related documents

    // If the vendor is found, return it
    if (result) {
      return res.status(200).json(result);
    }

    // If no vendor is found, return a 400 error with a message
    return res.status(400).json({ message: 'Data not found!' });
  } catch (error) {
    // Handle any errors that occur during the query or processing
    return res.status(500).json({ message: 'Server error', error });
  }
};
