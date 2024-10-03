import mongoose, { Document, Model, Schema } from "mongoose";

interface FoodDoc extends Document {
  vendorId: string;
  name: string;
  description: string;
  category: string;
  foodType: string;
  readyTime: number;
  price: number;
  rating: number;
  images: [string];
}

const FoodSchema = new Schema(
  {
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    foodType: { type: String, required: true },
    readyTime: { type: Number },
    price: { type: Number, required: true },
    rating: { type: Number },
    images: [{ type: String }],
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret.__createdAt;
        delete ret.__updatedAt;
        return ret;
      },
    },
    timestamps: true,
  }
);

const Food: Model<FoodDoc> = mongoose.model<FoodDoc>('food', FoodSchema);

export { Food };
