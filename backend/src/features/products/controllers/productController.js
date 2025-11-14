import Product from '../models/Product.js';
import Category from '#features/categories/models/Category.js';
import { uploadToCloudinary } from '#shared/index.js';

// @desc    Get all products (with search, category, rating, price filtering, sorting)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;

    // Search query matching product title or description
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i'
          }
        }
      : {};

    // Filter by Category Slug
    let categoryFilter = {};
    if (req.query.category) {
      const categoryObj = await Category.findOne({ slug: req.query.category });
      if (categoryObj) {
        categoryFilter = { category: categoryObj._id };
      } else {
        // If category is provided but not found, return empty results
        return res.json({ products: [], page, pages: 0, count: 0 });
      }
    }

    // Filter by Price Range
    const priceFilter = {};
    if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
    const finalPriceFilter = Object.keys(priceFilter).length > 0 ? { price: priceFilter } : {};

    // Filter by Collection
    const collectionFilter = req.query.collection
      ? { collections: req.query.collection }
      : {};

    // Filter by Tag
    const tagFilter = req.query.tag
      ? { tags: req.query.tag }
      : {};

    // Combined query
    const query = { ...keyword, ...categoryFilter, ...finalPriceFilter, ...collectionFilter, ...tagFilter };

    // Sorting options
    let sort = {};
    if (req.query.sortBy === 'priceAsc') sort = { price: 1 };
    else if (req.query.sortBy === 'priceDesc') sort = { price: -1 };
    else if (req.query.sortBy === 'rating') sort = { rating: -1 };
    else sort = { createdAt: -1 }; // Default: Newest first

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category')
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize), count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category');

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured products for landing page
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).populate('category').limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed by you' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, details, category, stock, isFeatured, specs, images } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const productExists = await Product.findOne({ slug });

    if (productExists) {
      return res.status(400).json({ message: 'Product name already exists' });
    }

    // Handle uploaded file images or default fallback images
    let productImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await uploadToCloudinary(file.buffer);
        productImages.push(uploadResult.secure_url);
      }
    } else if (images && Array.isArray(images) && images.length > 0) {
      productImages = images;
    } else {
      productImages = ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'];
    }

    const product = new Product({
      name,
      slug,
      price: Number(price),
      description,
      details,
      category,
      stock: Number(stock),
      isFeatured: isFeatured === 'true' || isFeatured === true,
      specs: typeof specs === 'string' ? JSON.parse(specs) : specs,
      images: productImages
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, details, category, stock, isFeatured, specs, images } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price !== undefined ? Number(price) : product.price;
      product.description = description || product.description;
      product.details = details || product.details;
      product.category = category || product.category;
      product.stock = stock !== undefined ? Number(stock) : product.stock;
      product.isFeatured = isFeatured !== undefined ? (isFeatured === 'true' || isFeatured === true) : product.isFeatured;
      
      if (specs) {
        product.specs = typeof specs === 'string' ? JSON.parse(specs) : specs;
      }

      if (name) {
        product.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }

      // Handle new image uploads if provided
      if (req.files && req.files.length > 0) {
        const productImages = [];
        for (const file of req.files) {
          const uploadResult = await uploadToCloudinary(file.buffer);
          productImages.push(uploadResult.secure_url);
        }
        product.images = productImages;
      } else if (images && Array.isArray(images)) {
        product.images = images;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
