import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview
} from '../controllers/productController.js';
import { protect, admin, upload, validateProduct } from '#shared/index.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, upload.array('images', 5), validateProduct, createProduct);

router.get('/featured', getFeaturedProducts);

router.route('/:slug')
  .get(getProductBySlug);

router.route('/:id')
  .put(protect, admin, upload.array('images', 5), validateProduct, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/:id/reviews')
  .post(protect, createProductReview);

export default router;
