import express from 'express';
import { getWishlist, toggleWishlist } from '../controllers/wishlistController.js';
import { protect } from '#shared/index.js';

const router = express.Router();

router.route('/')
  .get(protect, getWishlist);

router.route('/:productId')
  .post(protect, toggleWishlist);

export default router;
