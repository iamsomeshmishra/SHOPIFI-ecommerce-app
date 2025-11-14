import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '@/features/auth';
import { useWishlistStore } from '@/features/wishlist';
import { useCartStore } from '@/features/cart';
import { CinematicImage } from '@/features/shared';

const ProductCard = ({ product }) => {
  const token = useAuthStore((state) => state.token);
  const wishlistItems = useWishlistStore((state) => state.wishlistItems);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const addToCart = useCartStore((state) => state.addToCart);

  const isLiked = wishlistItems.some((item) => item._id === product._id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token) {
      alert('Please log in to save items to your wishlist.');
      return;
    }
    toggleWishlist(product._id);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="group relative flex flex-col gap-3 font-body select-none">
      
      {/* Product Image and Hover Actions */}
      <Link to={`/products/${product.slug}`} className="relative block overflow-hidden bg-zinc-50 rounded-lg aspect-[3/4]">
        <CinematicImage
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          containerClassName="w-full h-full"
        />

        {/* Favorite Icon */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 p-2 bg-white/85 hover:bg-white rounded-full text-black transition-colors z-10 cursor-pointer shadow-sm active:scale-95"
        >
          <Heart size={16} fill={isLiked ? 'black' : 'none'} className={isLiked ? 'text-black' : 'text-zinc-600'} />
        </button>

        {/* Quick Add overlay */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-black text-white hover:bg-zinc-800 text-xs font-semibold py-2.5 rounded-full flex items-center justify-center gap-1.5 shadow-md active:scale-98 cursor-pointer"
          >
            <ShoppingBag size={13} /> Quick Add
          </button>
        </div>
      </Link>

      {/* Info Block */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-widest text-shade-40 font-medium font-body">
          {product.category?.name || 'Artifact'}
        </span>
        <div className="flex items-start justify-between gap-2">
          <Link to={`/products/${product.slug}`} className="text-sm font-medium hover:underline text-black">
            {product.name}
          </Link>
          <span className="text-sm font-semibold text-zinc-900 font-body">
            ${product.price?.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
