import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  addAddress,
  removeAddress,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { protect, validateRegister, validateLogin } from '#shared/index.js';

const router = express.Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, authUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route('/address')
  .post(protect, addAddress);
router.route('/address/:id')
  .delete(protect, removeAddress);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

export default router;
