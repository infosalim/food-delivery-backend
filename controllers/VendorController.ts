import { NextFunction, Request, Response } from "express";
import { VendorLoginInputs } from "../dto";
import { FindVendor } from "./AdminController";
import { ValidatePassword } from "../utility";


export const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <VendorLoginInputs>req.body;

    const existingVendor = await FindVendor('', email);

    if(existingVendor !== null){
        const validation = await ValidatePassword(password, existingVendor.password as string, existingVendor.salt as string);

        if(validation){
            return res.json(existingVendor);
        }else{
            return res.json({"message": "Password is not valid"});
        }

    }
    return res.json({"message": "Login credential is not valid"});
}