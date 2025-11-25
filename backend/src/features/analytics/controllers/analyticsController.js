import Order from '#features/orders/models/Order.js';
import Product from '#features/products/models/Product.js';
import User from '#features/users/models/User.js';
import Category from '#features/categories/models/Category.js';

// @desc    Get dashboard metrics for administrative panel
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Revenue from Paid Orders
    const salesData = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }
    ]);
    const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

    // 2. Count metrics
    const ordersCount = await Order.countDocuments({});
    const productsCount = await Product.countDocuments({});
    const usersCount = await User.countDocuments({ role: 'customer' });
    const categoriesCount = await Category.countDocuments({});

    // 3. Low stock warning count (< 5 items)
    const lowStockCount = await Product.countDocuments({ stock: { $lt: 5 } });

    // 4. Sales breakdown by category (Aggregate product categories inside paid orders)
    // For simplicity, count total items and active stock per category
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalStock: { $sum: '$stock' }
        }
      }
    ]);
    await Category.populate(categoryStats, { path: '_id', select: 'name' });

    // 5. Recent 5 orders
    const recentOrders = await Order.find({})
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // 6. Monthly sales trend (last 6 months)
    const salesTrend = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          sales: { $sum: '$totalPrice' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);

    res.json({
      metrics: {
        totalSales: Number(totalSales.toFixed(2)),
        ordersCount,
        productsCount,
        usersCount,
        categoriesCount,
        lowStockCount
      },
      categoryStats: categoryStats.map(stat => ({
        category: stat._id ? stat._id.name : 'Uncategorized',
        count: stat.count,
        totalStock: stat.totalStock
      })),
      recentOrders,
      salesTrend: salesTrend.map(trend => ({
        date: `${trend._id.year}-${trend._id.month.toString().padStart(2, '0')}`,
        sales: Number(trend.sales.toFixed(2))
      })).reverse()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
