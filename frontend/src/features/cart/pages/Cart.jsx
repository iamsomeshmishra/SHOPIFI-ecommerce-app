import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/features/cart';
import { useAuthStore } from '@/features/auth';
import { Button } from '@/features/shared';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    cartItems, 
    itemsPrice, 
    shippingPrice, 
    taxPrice, 
    totalPrice,
    updateQuantity,
    removeFromCart
  } = useCartStore();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-canvas-cream flex flex-col items-center justify-center p-6 text-center font-body text-black">
        <ShoppingBag size={48} className="text-shade-40 mb-4" />
        <h2 className="text-2xl font-display font-light">Your bag is empty</h2>
        <p className="text-sm text-shade-50 mt-2 max-w-sm">
          Browse our collections of luxury apparel, modern furniture, and minimal accessories.
        </p>
        <Link to="/products" className="mt-6">
          <Button variant="primary-pill">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-canvas-cream text-black min-h-screen py-16 px-6 md:px-12 font-body">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Header Title */}
        <div className="flex flex-col gap-1 pb-6 border-b border-hairline-light">
          <span className="text-[10px] uppercase tracking-widest text-emerald-800 font-semibold font-body">Your bag</span>
          <h1 className="text-3xl md:text-5xl font-display font-light text-black">Shopping Bag</h1>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Left Column: Cart Items list */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {cartItems.map((item) => (
              <div 
                key={item.product} 
                className="bg-white border border-hairline-light rounded-2xl p-5 flex gap-5 items-center elevation-light-3"
              >
                
                {/* Product Image */}
                <div className="w-20 h-24 md:w-24 md:h-32 bg-zinc-50 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Details Section */}
                <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <Link to={`/products/${item.slug}`} className="text-sm font-semibold hover:underline text-black">
                      {item.name}
                    </Link>
                    <span className="text-xs text-shade-40 font-semibold uppercase">Unit Price: ${item.price?.toFixed(2)}</span>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-hairline-light rounded-full p-0.5">
                      <button 
                        onClick={() => updateQuantity(item.product, item.qty - 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-zinc-100 text-xs font-semibold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-semibold">{item.qty}</span>
                      <button 
                        onClick={() => updateQuantity(item.product, item.qty + 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-zinc-100 text-xs font-semibold cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-sm font-bold text-black min-w-[70px] text-right">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>

                    <button 
                      onClick={() => removeFromCart(item.product)}
                      className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Remove product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

              </div>
            ))}

            <Link to="/products" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-zinc-600 hover:text-black self-start mt-2">
              <ArrowLeft size={14} /> Continue Shopping
            </Link>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="bg-white border border-hairline-light rounded-2xl p-6 md:p-8 flex flex-col gap-6 elevation-light-3 lg:sticky lg:top-24">
            <h3 className="text-sm uppercase tracking-widest text-shade-60 font-bold">Order Summary</h3>
            
            <div className="flex flex-col gap-3.5 text-sm border-b border-hairline-light pb-5">
              <div className="flex items-center justify-between">
                <span className="text-shade-50 font-medium">Subtotal</span>
                <span className="font-semibold text-black">${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-shade-50 font-medium">Shipping</span>
                <span className="font-semibold text-black">
                  {shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-shade-50 font-medium">Estimated Tax (8%)</span>
                <span className="font-semibold text-black">${taxPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-base font-bold pb-2">
              <span>Total Price</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            {itemsPrice < 300 && (
              <p className="text-[10px] text-shade-50 leading-relaxed bg-zinc-50 border border-hairline-light rounded-lg p-3">
                Spend <strong className="text-black">${(300 - itemsPrice).toFixed(2)}</strong> more to unlock complimentary premium shipping.
              </p>
            )}

            <Button 
              onClick={handleCheckout} 
              variant="primary-pill" 
              className="w-full py-3.5 text-sm font-semibold group mt-2"
            >
              Proceed to Checkout 
              <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-shade-40 uppercase tracking-widest font-semibold pt-2 border-t border-hairline-light">
              <ShieldCheck size={14} className="text-emerald-700" /> Secure SSL Checkout
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;
