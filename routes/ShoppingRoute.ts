import express from 'express';
import {
  GetFoodAvailability,
  GetFoodsIn30Min,
  GetTopRestaurants,
  RestaurantById,
  SearchFoods,
} from '../controllers';

const router = express.Router();

/*----------------------  Food Availability  ----------------------*/
router.get('/:pincode', GetFoodAvailability);
/*----------------------  Top Restaurants  ----------------------*/
router.get('/:top-restaurants/:pincode', GetTopRestaurants);
/*----------------------  Food Available in 30 minutes  ----------------------*/
router.get('/:foods-in-30-min/:pincode', GetFoodsIn30Min);
/*----------------------  Search Foods  ----------------------*/
router.get('/search/:pincode', SearchFoods);
/*----------------------  Find Restaurants by ID  ----------------------*/
router.get('/restaurant/:id', RestaurantById);

export { router as ShoppingRoute };
