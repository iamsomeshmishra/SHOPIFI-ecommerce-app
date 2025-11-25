import { create } from 'zustand';

const updateCartTotals = (cartItems) => {
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 300 || itemsPrice === 0 ? 0 : 15;
  const taxPrice = Number((0.08 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  return {
    itemsPrice: Number(itemsPrice.toFixed(2)),
    shippingPrice,
    taxPrice,
    totalPrice
  };
};

export const useCartStore = create((set, get) => ({
  cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
  ...updateCartTotals(JSON.parse(localStorage.getItem('cartItems')) || []),

  addToCart: (product, qty = 1) => {
    const { cartItems } = get();
    const existItem = cartItems.find((x) => x.product === product._id);
    let updatedCartItems = [];

    if (existItem) {
      updatedCartItems = cartItems.map((x) =>
        x.product === product._id
          ? {
              ...x,
              qty: Math.min(x.qty + qty, product.stock)
            }
          : x
      );
    } else {
      updatedCartItems = [
        ...cartItems,
        {
          product: product._id,
          name: product.name,
          image: product.images[0],
          price: product.price,
          stock: product.stock,
          slug: product.slug,
          qty
        }
      ];
    }

    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    set({
      cartItems: updatedCartItems,
      ...updateCartTotals(updatedCartItems)
    });
  },

  removeFromCart: (productId) => {
    const { cartItems } = get();
    const updatedCartItems = cartItems.filter((x) => x.product !== productId);

    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    set({
      cartItems: updatedCartItems,
      ...updateCartTotals(updatedCartItems)
    });
  },

  updateQuantity: (productId, qty) => {
    const { cartItems } = get();
    const item = cartItems.find((x) => x.product === productId);
    if (!item) return;

    const newQty = Math.max(1, Math.min(qty, item.stock));
    const updatedCartItems = cartItems.map((x) =>
      x.product === productId ? { ...x, qty: newQty } : x
    );

    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    set({
      cartItems: updatedCartItems,
      ...updateCartTotals(updatedCartItems)
    });
  },

  clearCart: () => {
    localStorage.removeItem('cartItems');
    set({
      cartItems: [],
      itemsPrice: 0,
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice: 0
    });
  }
}));
