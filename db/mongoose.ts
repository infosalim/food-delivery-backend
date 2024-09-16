import mongoose from "mongoose";
import { MONGO_URI } from "../config";


const dbConnection = () => {
  // Connecting to MongoDB
  mongoose
    .connect(MONGO_URI as string)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });

  const db = mongoose.connection;

  db.on("connected", () => {
    console.log("Mongoose connected to DB Cluster");
  });

  db.on("error", (error) => {
    console.error("Mongoose connection error:", error);
  });

  db.on("disconnected", () => {
    console.log("Mongoose disconnected");
  });
};

export { dbConnection };
