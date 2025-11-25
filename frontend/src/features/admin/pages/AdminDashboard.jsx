import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import { Button, axiosClient } from '@/features/shared';
import { 
  BarChart3, 
  Package, 
  Layers, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || user?.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchAdminStats = async () => {
      try {
        const { data } = await axiosClient.get('/admin/stats');
        setStats(data);
      } catch (err) {
        console.error('Error fetching admin statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, [token, user]);

  const handleDispatchOrder = async (orderId) => {
    if (!window.confirm('Dispatch order for shipment?')) return;
    try {
      await axiosClient.put(`/orders/${orderId}/deliver`, {});
      alert('Order marked as dispatched.');
      
      // Reload stats
      const { data } = await axiosClient.get('/admin/stats');
      setStats(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating order status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full bg-canvas-cream text-black min-h-screen py-16 px-6 md:px-12 font-body">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-hairline-light">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-widest text-emerald-800 font-semibold font-body flex items-center gap-1">
              <ShieldCheck size={14} /> Administrator Control
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-light text-black">Control Room</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/admin/products">
              <Button variant="outline-on-light" className="py-2.5 text-xs font-semibold flex items-center gap-1.5">
                <Package size={14} /> Manage Products
              </Button>
            </Link>
            <Link to="/admin/categories">
              <Button variant="outline-on-light" className="py-2.5 text-xs font-semibold flex items-center gap-1.5">
                <Layers size={14} /> Manage Categories
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Revenue */}
          <div className="bg-white border border-hairline-light rounded-2xl p-6 elevation-light-3 flex flex-col justify-between h-36">
            <div className="flex items-center justify-between text-shade-50">
              <span className="text-xs uppercase tracking-widest font-semibold">Total Revenue</span>
              <DollarSign size={20} className="text-emerald-700" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-black">${stats?.totalSales?.toFixed(2) || '0.00'}</span>
              <span className="text-[10px] text-shade-40 font-semibold uppercase flex items-center gap-1">
                <TrendingUp size={10} /> Simulated payment intents
              </span>
            </div>
          </div>

          {/* Card 2: Orders */}
          <div className="bg-white border border-hairline-light rounded-2xl p-6 elevation-light-3 flex flex-col justify-between h-36">
            <div className="flex items-center justify-between text-shade-50">
              <span className="text-xs uppercase tracking-widest font-semibold">Total Orders</span>
              <ShoppingBag size={20} className="text-zinc-600" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-black">{stats?.totalOrders || 0}</span>
              <span className="text-[10px] text-shade-40 font-semibold uppercase">Customer transactions</span>
            </div>
          </div>

          {/* Card 3: Users */}
          <div className="bg-white border border-hairline-light rounded-2xl p-6 elevation-light-3 flex flex-col justify-between h-36">
            <div className="flex items-center justify-between text-shade-50">
              <span className="text-xs uppercase tracking-widest font-semibold">Total Clients</span>
              <Users size={20} className="text-zinc-600" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-black">{stats?.totalUsers || 0}</span>
              <span className="text-[10px] text-shade-40 font-semibold uppercase">Registered accounts</span>
            </div>
          </div>

          {/* Card 4: Catalog Size */}
          <div className="bg-white border border-hairline-light rounded-2xl p-6 elevation-light-3 flex flex-col justify-between h-36">
            <div className="flex items-center justify-between text-shade-50">
              <span className="text-xs uppercase tracking-widest font-semibold">Products Catalog</span>
              <Package size={20} className="text-zinc-600" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-black">{stats?.totalProducts || 0}</span>
              <span className="text-[10px] text-shade-40 font-semibold uppercase">Active database variants</span>
            </div>
          </div>

        </div>

        {/* Recent Orders Table */}
        <div className="bg-white border border-hairline-light rounded-2xl p-6 md:p-8 elevation-light-3">
          <h3 className="text-sm uppercase tracking-widest text-shade-60 font-bold mb-6 flex items-center gap-1.5">
            <BarChart3 size={16} /> Recent Transactions log
          </h3>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 text-shade-40 uppercase tracking-widest font-semibold">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Dispatched</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-shade-40">
                      No order logs exist in the repository database.
                    </td>
                  </tr>
                ) : (
                  stats?.recentOrders?.map((ord) => (
                    <tr key={ord._id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                      <td className="py-4 px-4 font-bold text-black uppercase">#{ord._id.substr(-6)}</td>
                      <td className="py-4 px-4 font-medium">{ord.user?.name || 'Guest Client'}</td>
                      <td className="py-4 px-4 font-bold text-black">${ord.totalPrice?.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold ${
                          ord.isPaid ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'
                        }`}>
                          {ord.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold ${
                          ord.isDelivered ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {ord.isDelivered ? 'Shipped' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Link to={`/order-success/${ord._id}`}>
                            <button className="text-xs uppercase tracking-widest font-bold text-zinc-600 hover:text-black">
                              View
                            </button>
                          </Link>
                          {!ord.isDelivered && ord.isPaid && (
                            <button 
                              onClick={() => handleDispatchOrder(ord._id)}
                              className="text-xs uppercase tracking-widest font-bold text-emerald-600 hover:text-emerald-800 ml-3"
                            >
                              Dispatch
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
