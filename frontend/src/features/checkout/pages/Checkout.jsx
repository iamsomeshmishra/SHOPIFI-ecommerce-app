import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '@/features/cart';
import { useAuthStore } from '@/features/auth';
import { Button, Input, axiosClient } from '@/features/shared';
import { ArrowLeft, CreditCard, Shield, Truck, Sparkles } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, token, getProfile } = useAuthStore();
  const { cartItems, totalPrice, itemsPrice, shippingPrice, taxPrice, clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Shipping address selection state
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Payment mock inputs
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('321');

  useEffect(() => {
    if (!token) {
      navigate('/login?redirect=/checkout');
      return;
    }
    // Refresh user profile addresses
    getProfile();
  }, [token]);

  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      setSelectedAddressId(user.addresses[0]._id);
      setIsAddingAddress(false);
    } else {
      setIsAddingAddress(true);
    }
  }, [user]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-canvas-cream flex flex-col items-center justify-center p-6 text-center text-black">
        <h3 className="text-xl font-medium">Your bag is empty</h3>
        <Link to="/products" className="mt-4">
          <Button variant="primary-pill">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  const handleAddressInputChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode || !newAddress.country) {
      setErrorMsg('All address fields are required.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      await axiosClient.post('/auth/address', newAddress);
      await getProfile();
      setNewAddress({ street: '', city: '', state: '', zipCode: '', country: '' });
      setIsAddingAddress(false);
      alert('Address added successfully.');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error adding address');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    let finalAddress = null;

    if (!isAddingAddress) {
      finalAddress = user.addresses.find((addr) => addr._id === selectedAddressId);
    } else {
      if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode || !newAddress.country) {
        setErrorMsg('Please complete and save your shipping address.');
        return;
      }
      finalAddress = newAddress;
    }

    if (!finalAddress) {
      setErrorMsg('Please select or specify a shipping destination address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Create order on DB
      const orderPayload = {
        orderItems: cartItems,
        shippingAddress: {
          street: finalAddress.street,
          city: finalAddress.city,
          state: finalAddress.state,
          zipCode: finalAddress.zipCode,
          country: finalAddress.country
        },
        paymentMethod: 'Stripe',
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      };

      const { data: orderData } = await axiosClient.post('/orders', orderPayload);

      // 2. Authorize simulated payment (fallback to mock since we are offline)
      await axiosClient.post(`/orders/${orderData._id}/pay-simulated`, {
        id: `ch_${Math.random().toString(36).substr(2, 9)}`,
        status: 'succeeded'
      });

      // 3. Clear shopping cart and redirect
      clearCart();
      navigate(`/order-success/${orderData._id}`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Transaction submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-canvas-cream text-black min-h-screen py-16 px-6 md:px-12 font-body">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Header Block */}
        <div className="flex flex-col gap-1 pb-6 border-b border-hairline-light">
          <Link to="/cart" className="inline-flex items-center gap-1 text-xs uppercase tracking-widest font-bold text-shade-50 hover:text-black mb-2">
            <ArrowLeft size={14} /> Back to Bag
          </Link>
          <h1 className="text-3xl md:text-5xl font-display font-light text-black">Checkout</h1>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Left Columns: Delivery & Payment Details */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Address Details Block */}
            <div className="bg-white border border-hairline-light rounded-2xl p-6 md:p-8 flex flex-col gap-6 elevation-light-3">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <h3 className="text-sm uppercase tracking-widest text-shade-60 font-bold flex items-center gap-1.5">
                  <Truck size={16} /> 1. Shipping Destination
                </h3>
                {user?.addresses && user.addresses.length > 0 && (
                  <button
                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                    className="text-xs font-bold uppercase tracking-widest text-zinc-600 hover:text-black"
                  >
                    {isAddingAddress ? 'Select Saved Address' : 'Use New Address'}
                  </button>
                )}
              </div>

              {!isAddingAddress && user?.addresses && user.addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={`border rounded-xl p-4 flex gap-3 cursor-pointer transition-colors ${
                        selectedAddressId === addr._id
                          ? 'border-black bg-zinc-50'
                          : 'border-hairline-light hover:bg-zinc-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="selectedAddress"
                        checked={selectedAddressId === addr._id}
                        onChange={() => setSelectedAddressId(addr._id)}
                        className="mt-1 accent-black"
                      />
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="font-bold text-black">Home Address</span>
                        <span className="text-shade-50">{addr.street}</span>
                        <span className="text-shade-50">
                          {addr.city}, {addr.state} {addr.zipCode}
                        </span>
                        <span className="text-shade-50">{addr.country}</span>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleCreateAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Street Address"
                      name="street"
                      value={newAddress.street}
                      onChange={handleAddressInputChange}
                      placeholder="123 Artisan Way"
                    />
                  </div>
                  <Input
                    label="City"
                    name="city"
                    value={newAddress.city}
                    onChange={handleAddressInputChange}
                    placeholder="New York"
                  />
                  <Input
                    label="State / Region"
                    name="state"
                    value={newAddress.state}
                    onChange={handleAddressInputChange}
                    placeholder="NY"
                  />
                  <Input
                    label="Postal / Zip Code"
                    name="zipCode"
                    value={newAddress.zipCode}
                    onChange={handleAddressInputChange}
                    placeholder="10001"
                  />
                  <Input
                    label="Country"
                    name="country"
                    value={newAddress.country}
                    onChange={handleAddressInputChange}
                    placeholder="United States"
                  />
                  {user?.addresses && user.addresses.length > 0 && (
                    <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                      <Button
                        type="button"
                        variant="outline-on-light"
                        onClick={() => setIsAddingAddress(false)}
                        className="py-2 text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary-pill"
                        disabled={loading}
                        className="py-2 text-xs"
                      >
                        Save Address
                      </Button>
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Payment Details Block */}
            <div className="bg-white border border-hairline-light rounded-2xl p-6 md:p-8 flex flex-col gap-6 elevation-light-3">
              <div className="border-b border-zinc-100 pb-4">
                <h3 className="text-sm uppercase tracking-widest text-shade-60 font-bold flex items-center gap-1.5">
                  <CreditCard size={16} /> 2. Payment Authentication
                </h3>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-xs text-shade-50">
                  Stripe Payment gateway is operating in simulation fallback mode. Use the standard sandbox tokens below.
                </p>

                <div className="bg-zinc-50 border border-hairline-light rounded-xl p-4 flex flex-col gap-4">
                  <Input
                    label="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                    />
                    <Input
                      label="CVC"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Checkout Summary panel */}
          <div className="bg-white border border-hairline-light rounded-2xl p-6 md:p-8 flex flex-col gap-6 elevation-light-3 lg:sticky lg:top-24">
            <h3 className="text-sm uppercase tracking-widest text-shade-60 font-bold">Review Order Items</h3>
            
            {/* Short Cart List */}
            <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.product} className="flex items-center justify-between text-xs gap-3">
                  <span className="text-shade-60 font-medium truncate max-w-[150px]">{item.name}</span>
                  <span className="text-shade-40 font-semibold">x{item.qty}</span>
                  <span className="font-bold text-black">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <hr className="border-zinc-100" />

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between text-shade-50">
                <span>Items Subtotal</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-shade-50">
                <span>Shipping Limit</span>
                <span>{shippingPrice === 0 ? 'Complimentary' : `$${shippingPrice.toFixed(2)}`}</span>
              </div>
              <div className="flex items-center justify-between text-shade-50">
                <span>V.A.T / Sales Tax (8%)</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
            </div>

            <hr className="border-zinc-100" />

            <div className="flex items-center justify-between text-base font-bold">
              <span>Total Price</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <Button
              onClick={handlePlaceOrder}
              disabled={loading}
              variant="primary-pill"
              className="w-full mt-2 font-semibold flex items-center justify-center gap-2 py-3.5 text-sm"
            >
              <Sparkles size={16} /> {loading ? 'Authorizing...' : 'Authorize Transaction'}
            </Button>

            <div className="flex items-center justify-center gap-1 text-[10px] text-shade-40 uppercase tracking-widest font-semibold pt-2 border-t border-hairline-light">
              <Shield size={12} className="text-emerald-700" /> Insured merchant transaction
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Checkout;
