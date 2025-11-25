import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import { useWishlistStore } from '@/features/wishlist';
import { Button, Input, axiosClient } from '@/features/shared';
import { User, MapPin, ClipboardList, Heart, LogOut, CheckCircle2, ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token, getProfile, updateProfile, addAddress, removeAddress, logout } = useAuthStore();
  const { wishlistItems, fetchWishlist } = useWishlistStore();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'addresses' | 'wishlist'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile forms fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Address form fields
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [addressLoading, setAddressLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    getProfile();
    fetchWishlist();
  }, [token]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Load orders when Tab is clicked
  useEffect(() => {
    if (activeTab === 'orders' && token) {
      const fetchMyOrders = async () => {
        setLoadingOrders(true);
        try {
          const { data } = await axiosClient.get('/orders/myorders');
          setOrders(data);
        } catch (err) {
          console.error('Error fetching user orders:', err);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchMyOrders();
    }
  }, [activeTab, token]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setProfileError('Passwords do not match');
      return;
    }
    setProfileLoading(true);
    setProfileError('');
    try {
      await updateProfile({ name, password });
      alert('Profile updated successfully.');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setProfileError(err.message || 'Profile update failed.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    if (!street || !city || !state || !zipCode || !country) {
      alert('All address fields are required.');
      return;
    }
    setAddressLoading(true);
    try {
      await addAddress({ street, city, state, zipCode, country });
      setStreet('');
      setCity('');
      setState('');
      setZipCode('');
      setCountry('');
      setShowAddressForm(false);
      alert('Address saved to profile.');
    } catch (err) {
      alert(err.message || 'Error saving address');
    } finally {
      setAddressLoading(false);
    }
  };

  const handleRemoveAddress = async (addressId) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await removeAddress(addressId);
    } catch (err) {
      alert(err.message || 'Error deleting address');
    }
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="w-full bg-canvas-cream text-black min-h-screen py-16 px-6 md:px-12 font-body">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Header Block */}
        <div className="flex flex-col gap-1 pb-6 border-b border-hairline-light">
          <span className="text-[10px] uppercase tracking-widest text-emerald-800 font-semibold font-body">Client Room</span>
          <h1 className="text-3xl md:text-5xl font-display font-light text-black">Account Dashboard</h1>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          
          {/* Side Tabs navigation menu */}
          <aside className="bg-white border border-hairline-light rounded-2xl p-5 flex flex-col gap-1.5 elevation-light-3">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-3 w-full text-left text-sm py-3 px-4 rounded-xl transition-colors font-medium ${
                activeTab === 'orders' ? 'bg-black text-white' : 'hover:bg-zinc-50 text-zinc-700'
              }`}
            >
              <ClipboardList size={16} /> Order History
            </button>
            
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 w-full text-left text-sm py-3 px-4 rounded-xl transition-colors font-medium ${
                activeTab === 'profile' ? 'bg-black text-white' : 'hover:bg-zinc-50 text-zinc-700'
              }`}
            >
              <User size={16} /> Profile Details
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`flex items-center gap-3 w-full text-left text-sm py-3 px-4 rounded-xl transition-colors font-medium ${
                activeTab === 'addresses' ? 'bg-black text-white' : 'hover:bg-zinc-50 text-zinc-700'
              }`}
            >
              <MapPin size={16} /> Saved Destinations
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex items-center gap-3 w-full text-left text-sm py-3 px-4 rounded-xl transition-colors font-medium ${
                activeTab === 'wishlist' ? 'bg-black text-white' : 'hover:bg-zinc-50 text-zinc-700'
              }`}
            >
              <Heart size={16} /> Wishlist ({wishlistItems.length})
            </button>

            <hr className="my-3 border-zinc-100" />

            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-3 w-full text-left text-sm py-3 px-4 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-semibold"
            >
              <LogOut size={16} /> Log Out Account
            </button>
          </aside>

          {/* Right Area content panel */}
          <main className="lg:col-span-3">
            
            {/* Orders list */}
            {activeTab === 'orders' && (
              <div className="flex flex-col gap-6">
                <h3 className="text-xl font-display text-black">Invoice Archives</h3>
                
                {loadingOrders ? (
                  <div className="flex justify-center py-10">
                    <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white border border-hairline-light rounded-2xl p-8 text-center text-shade-40 elevation-light-3">
                    You have not placed any orders yet.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {orders.map((ord) => (
                      <div 
                        key={ord._id} 
                        className="bg-white border border-hairline-light rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 elevation-light-3"
                      >
                        <div className="flex flex-col gap-1 text-xs">
                          <span className="font-bold text-black uppercase tracking-wider">Order #{ord._id.substr(-6)}</span>
                          <span className="text-shade-40 font-semibold">{new Date(ord.createdAt).toLocaleDateString()}</span>
                          <span className="text-shade-50 font-bold text-sm mt-1">${ord.totalPrice.toFixed(2)}</span>
                        </div>

                        {/* Status elements */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-xs font-semibold">
                            {ord.isPaid ? (
                              <span className="text-emerald-700 flex items-center gap-1">
                                <CheckCircle2 size={14} /> Paid
                              </span>
                            ) : (
                              <span className="text-red-500 flex items-center gap-1">
                                <ShieldAlert size={14} /> Unpaid
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 text-xs font-semibold">
                            {ord.isDelivered ? (
                              <span className="text-emerald-700 flex items-center gap-1">
                                <CheckCircle2 size={14} /> Dispatched
                              </span>
                            ) : (
                              <span className="text-amber-600 flex items-center gap-1">
                                <ShieldCheck size={14} /> Processing
                              </span>
                            )}
                          </div>

                          <Link to={`/order-success/${ord._id}`}>
                            <Button variant="outline-on-light" className="py-2 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1">
                              Details <ArrowRight size={10} />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile update form */}
            {activeTab === 'profile' && (
              <div className="bg-white border border-hairline-light rounded-2xl p-6 md:p-8 flex flex-col gap-6 elevation-light-3 max-w-lg">
                <h3 className="text-xl font-display text-black">Profile Information</h3>
                
                {profileError && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-semibold">
                    {profileError}
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="flex flex-col gap-5">
                  <Input
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                  <Input
                    label="Email Address (Not editable)"
                    value={email}
                    disabled
                    className="opacity-60 bg-zinc-50"
                  />

                  <hr className="border-zinc-100 my-1" />

                  <Input
                    label="New Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave empty to keep current"
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Leave empty to keep current"
                  />

                  <Button 
                    type="submit" 
                    variant="primary-pill" 
                    disabled={profileLoading}
                    className="w-full mt-2"
                  >
                    {profileLoading ? 'Saving...' : 'Update Settings'}
                  </Button>
                </form>
              </div>
            )}

            {/* Addresses book CRUD */}
            {activeTab === 'addresses' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <h3 className="text-xl font-display text-black">Delivery Locations</h3>
                  {!showAddressForm && (
                    <Button 
                      onClick={() => setShowAddressForm(true)} 
                      variant="primary-pill"
                      className="py-2 text-xs"
                    >
                      Add New Address
                    </Button>
                  )}
                </div>

                {showAddressForm && (
                  <div className="bg-white border border-hairline-light rounded-2xl p-6 elevation-light-3 max-w-lg">
                    <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-black">New Destination</h4>
                    <form onSubmit={handleAddAddressSubmit} className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Input
                          label="Street Address"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          placeholder="123 Loft Square"
                        />
                      </div>
                      <Input
                        label="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="San Francisco"
                      />
                      <Input
                        label="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="CA"
                      />
                      <Input
                        label="Zip Code"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="94103"
                      />
                      <Input
                        label="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="United States"
                      />
                      <div className="col-span-2 flex justify-end gap-3 mt-2">
                        <Button 
                          type="button" 
                          variant="outline-on-light" 
                          onClick={() => setShowAddressForm(false)}
                          className="py-2 text-xs"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          variant="primary-pill"
                          disabled={addressLoading}
                          className="py-2 text-xs"
                        >
                          Save Address
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {user?.addresses && user.addresses.length === 0 ? (
                  <div className="bg-white border border-hairline-light rounded-2xl p-8 text-center text-shade-40 elevation-light-3">
                    No shipping destinations have been saved.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user?.addresses?.map((addr) => (
                      <div 
                        key={addr._id} 
                        className="bg-white border border-hairline-light rounded-2xl p-5 flex flex-col gap-4 justify-between elevation-light-3"
                      >
                        <div className="text-xs text-shade-50 flex flex-col gap-1">
                          <span className="font-bold text-black uppercase tracking-wider mb-1">Destination</span>
                          <span>{addr.street}</span>
                          <span>{addr.city}, {addr.state} {addr.zipCode}</span>
                          <span>{addr.country}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveAddress(addr._id)}
                          className="text-left text-xs uppercase tracking-widest font-bold text-red-500 hover:text-red-700 self-start"
                        >
                          Remove Address
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist item displays */}
            {activeTab === 'wishlist' && (
              <div className="flex flex-col gap-6">
                <h3 className="text-xl font-display text-black">Curated Wishlist</h3>
                
                {wishlistItems.length === 0 ? (
                  <div className="bg-white border border-hairline-light rounded-2xl p-8 text-center text-shade-40 elevation-light-3">
                    Your wishlist is empty.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {wishlistItems.map((prod) => (
                      <div key={prod._id} className="bg-white border border-hairline-light rounded-xl p-4 elevation-light-3 flex flex-col gap-3 font-body">
                        <Link to={`/products/${prod.slug}`} className="block aspect-[3/4] bg-zinc-50 rounded-lg overflow-hidden">
                          <img src={prod.images?.[0]} alt={prod.name} className="w-full h-full object-cover" />
                        </Link>
                        <div className="flex flex-col gap-1 text-xs">
                          <Link to={`/products/${prod.slug}`} className="font-bold text-black hover:underline truncate">
                            {prod.name}
                          </Link>
                          <span className="text-zinc-900 font-semibold">${prod.price?.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </main>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
