import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import { Button, axiosClient } from '@/features/shared';
import { CheckCircle2, ShoppingBag, ClipboardList, ShieldAlert } from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams();
  const { token } = useAuthStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axiosClient.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order receipt:', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchOrder();
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-canvas-cream flex flex-col items-center justify-center p-6 text-center text-black font-body">
        <ShieldAlert size={36} className="text-red-500 mb-3" />
        <h3 className="text-xl font-medium">Receipt Missing</h3>
        <p className="text-sm text-shade-50 mt-1">We couldn't load the order invoice.</p>
        <Link to="/products" className="mt-5">
          <Button variant="primary-pill">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-canvas-cream text-black flex items-center justify-center py-20 px-6 font-body">
      <div className="w-full max-w-xl bg-white p-8 md:p-10 rounded-2xl border border-hairline-light elevation-light-3 flex flex-col items-center text-center gap-6">
        
        {/* Success Icon */}
        <CheckCircle2 size={56} className="text-emerald-700 animate-bounce" />

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-widest text-emerald-800 font-bold font-body">Order Confirmed</span>
          <h1 className="text-3xl font-display font-light text-black tracking-tight leading-tight">
            Transaction Complete
          </h1>
        </div>

        <p className="text-sm text-shade-50 max-w-md leading-relaxed">
          Thank you for your order. We have successfully processed your payment. Your unique transaction ID is{' '}
          <strong className="text-black">{order._id}</strong>.
        </p>

        {/* Invoice details summary */}
        <div className="w-full bg-zinc-50 border border-hairline-light rounded-xl p-5 text-left text-xs flex flex-col gap-3">
          <div className="flex justify-between border-b border-zinc-200 pb-2">
            <span className="text-shade-50 uppercase tracking-wider font-semibold">Delivery Destination</span>
            <span className="font-semibold text-black text-right">
              {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
            </span>
          </div>

          <div className="flex justify-between border-b border-zinc-200 pb-2">
            <span className="text-shade-50 uppercase tracking-wider font-semibold">Payment Status</span>
            <span className="font-bold text-emerald-700">PAID</span>
          </div>

          <div className="flex justify-between font-bold pt-1">
            <span className="text-shade-50 uppercase tracking-wider">Total Invoice Price</span>
            <span className="text-black text-sm font-semibold">${order.totalPrice?.toFixed(2)}</span>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
          <Link to="/dashboard" className="flex-1">
            <Button variant="outline-on-light" className="w-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 py-3">
              <ClipboardList size={14} /> Track Orders
            </Button>
          </Link>
          
          <Link to="/products" className="flex-1">
            <Button variant="primary-pill" className="w-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 py-3">
              <ShoppingBag size={14} /> Keep Shopping
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;
