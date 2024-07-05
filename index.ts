import express from "express";
import { AdminRoute, VendorRoute } from "./routes";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { MONGO_URI } from "./config";
import { dbConnection } from "./db";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/admin", AdminRoute);
app.use("/vendor", VendorRoute);

mongoose.connect(MONGO_URI as string, {
    
});

// Database
dbConnection();

app.listen(8000, () => {
  console.log("App is running on Port: 8000");
});
