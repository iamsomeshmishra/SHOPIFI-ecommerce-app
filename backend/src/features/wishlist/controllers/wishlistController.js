import User from '#features/users/models/User.js';

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      populate: { path: 'category' }
    });
    
    if (user) {
      res.json(user.wishlist);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle product in wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
export const toggleWishlist = async (req, res) => {
  const { productId } = req.params;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      const isAlreadyInWishlist = user.wishlist.includes(productId);

      if (isAlreadyInWishlist) {
        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();
        res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
      } else {
        user.wishlist.push(productId);
        await user.save();
        res.json({ message: 'Added to wishlist', wishlist: user.wishlist });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
