import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import { Button, Input, axiosClient } from '@/features/shared';
import { ShieldCheck, Plus, Trash2, Edit3, ArrowLeft, Image, X } from 'lucide-react';

const AdminProducts = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states (creating & editing mode)
  const [editProduct, setEditProduct] = useState(null); // If non-null, editing product; else creating new
  const [showFormModal, setShowFormModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Form inputs
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [imageFile, setImageFile] = useState(null); // File reference
  const [imageUrl, setImageUrl] = useState(''); // Text fallback
  const [specs, setSpecs] = useState([{ label: '', value: '' }]);

  // Load products & categories
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all products (limitless for admin dashboard view)
      const { data: allProdData } = await axiosClient.get('/products?pageNumber=1&pageSize=100');
      setProducts(allProdData.products || []);

      const { data: catData } = await axiosClient.get('/categories');
      setCategories(catData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [token, user]);

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product catalog item?')) return;
    try {
      await axiosClient.delete(`/products/${id}`);
      alert('Product deleted successfully.');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting product');
    }
  };

  const handleOpenCreateModal = () => {
    setEditProduct(null);
    setName('');
    setPrice('');
    setDescription('');
    setCategory(categories[0]?._id || '');
    setStock('');
    setImageFile(null);
    setImageUrl('');
    setSpecs([{ label: '', value: '' }]);
    setShowFormModal(true);
  };

  const handleOpenEditModal = (product) => {
    setEditProduct(product);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setCategory(product.category?._id || product.category || '');
    setStock(product.stock);
    setImageFile(null);
    setImageUrl(product.images?.[0] || '');
    setSpecs(
      product.specs && product.specs.length > 0
        ? product.specs
        : [{ label: '', value: '' }]
    );
    setShowFormModal(true);
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  const handleAddSpecRow = () => {
    setSpecs([...specs, { label: '', value: '' }]);
  };

  const handleRemoveSpecRow = (index) => {
    const updated = specs.filter((_, idx) => idx !== index);
    setSpecs(updated.length > 0 ? updated : [{ label: '', value: '' }]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('stock', stock);
      
      // Send specs as serialized JSON
      const cleanSpecs = specs.filter((s) => s.label && s.value);
      formData.append('specs', JSON.stringify(cleanSpecs));

      // Append image upload (if user attached file)
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (imageUrl) {
        // Fallback fallback text url
        formData.append('imageUrlFallback', imageUrl);
      }

      const headers = {
        'Content-Type': 'multipart/form-data'
      };

      if (editProduct) {
        // PUT update
        await axiosClient.put(`/products/${editProduct._id}`, formData, { headers });
        alert('Product details updated.');
      } else {
        // POST create
        await axiosClient.post('/products', formData, { headers });
        alert('Product registered in catalog.');
      }

      setShowFormModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing request');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="w-full bg-canvas-cream text-black min-h-screen py-16 px-6 md:px-12 font-body">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-hairline-light">
          <div className="flex flex-col gap-1">
            <Link to="/admin" className="inline-flex items-center gap-1 text-xs uppercase tracking-widest font-bold text-shade-50 hover:text-black mb-1">
              <ArrowLeft size={14} /> Back to Control
            </Link>
            <h1 className="text-3xl md:text-5xl font-display font-light text-black flex items-center gap-1">
              Products Catalog
            </h1>
          </div>

          <Button 
            onClick={handleOpenCreateModal} 
            variant="primary-pill" 
            className="py-2.5 text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus size={16} /> Add Product
          </Button>
        </div>

        {/* Product List Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white border border-hairline-light rounded-2xl p-6 md:p-8 elevation-light-3">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 text-shade-40 uppercase tracking-widest font-semibold">
                    <th className="py-3 px-4">Artifact</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-shade-40">
                        No product catalogs found.
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p._id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-16 bg-zinc-50 border rounded-lg overflow-hidden flex-shrink-0">
                              <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-semibold text-black">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-shade-50 font-medium">
                          {p.category?.name || 'Unassigned'}
                        </td>
                        <td className="py-4 px-4 font-bold text-black">${p.price?.toFixed(2)}</td>
                        <td className="py-4 px-4 font-medium">
                          <span className={p.stock > 0 ? 'text-black' : 'text-red-500 font-bold'}>
                            {p.stock > 0 ? `${p.stock} units` : 'Sold Out'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleOpenEditModal(p)}
                              className="text-zinc-500 hover:text-black transition-colors"
                              title="Edit product"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(p._id)}
                              className="text-zinc-500 hover:text-red-500 transition-colors"
                              title="Delete product"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create/Edit Product Form Dialog modal */}
        {showFormModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white border border-hairline-light rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto elevation-light-3 flex flex-col gap-6 relative">
              <button 
                onClick={() => setShowFormModal(false)}
                className="absolute right-4 top-4 p-1.5 text-zinc-400 hover:text-black rounded-full cursor-pointer"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-display font-light text-black border-b pb-3">
                {editProduct ? `Modify Artifact: ${editProduct.name}` : 'Register New Artifact'}
              </h2>

              <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Product Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="Price ($)"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-widest text-shade-50 font-bold">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="bg-white border border-hairline-light rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-black font-semibold font-body"
                  >
                    <option value="" disabled>Select category...</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                  <Input
                    label="Stock Inventory Count"
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                  />
                </div>

                {/* Image Upload Input */}
                <div className="bg-zinc-50 border border-hairline-light rounded-xl p-4 flex flex-col gap-3">
                  <span className="text-xs uppercase tracking-widest text-shade-50 font-bold">Upload Media</span>
                  
                  <div className="flex flex-col gap-2">
                    <label className="block text-[11px] font-bold text-zinc-600">Option A: Choose File (Upload to Cloudinary)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="text-xs text-zinc-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-900 file:text-white hover:file:bg-zinc-800"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="block text-[11px] font-bold text-zinc-600">Option B: Fallback Image URL</label>
                    <Input 
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>

                {/* Specs List Creator */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-shade-50 font-bold">Technical Specifications</span>
                    <button
                      type="button"
                      onClick={handleAddSpecRow}
                      className="text-xs font-bold text-emerald-700 hover:underline"
                    >
                      + Add Row
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    {specs.map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <Input
                          placeholder="Label (e.g. Dimensions)"
                          value={spec.label}
                          onChange={(e) => handleSpecChange(idx, 'label', e.target.value)}
                        />
                        <Input
                          placeholder="Value (e.g. 80cm x 120cm)"
                          value={spec.value}
                          onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecRow(idx)}
                          className="p-2 text-zinc-400 hover:text-red-500 rounded-full"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <Button 
                    type="button" 
                    variant="outline-on-light" 
                    onClick={() => setShowFormModal(false)}
                    className="py-2.5 text-xs font-bold uppercase tracking-widest"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={formLoading}
                    variant="primary-pill"
                    className="py-2.5 text-xs font-bold uppercase tracking-widest"
                  >
                    {formLoading ? 'Submitting...' : 'Save Product'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminProducts;
