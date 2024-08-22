import express, { Request, Response, NextFunction } from 'express';
import { VendorLogin } from '../controllers';


const router = express.Router();

router.post('/login', VendorLogin);


router.post('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({
        message: "Hello From vendor"
    });
});

export { router as VendorRoute }