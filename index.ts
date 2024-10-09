import express from "express";
import { AdminRoute, VendorRoute } from "./routes";
import bodyParser from "body-parser";
import { dbConnection } from "./db";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();

// Database
dbConnection();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/admin", AdminRoute);
app.use("/vendor", VendorRoute);

app.listen(8000, () => {
  console.log("App is running on Port: 8000");
});
