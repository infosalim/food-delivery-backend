import mongoose, { Document, Types } from 'mongoose';

export interface CreateFoodInputs {
  name: string;
  description: string;
  category: string;
  foodType: string;
  readyTime: number;
  price: number;
}

interface FoodDoc extends Document {
  _id: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  category: string;
  foodType: string;
  images: [string];
  readyTime: number;
  price: number;
}
