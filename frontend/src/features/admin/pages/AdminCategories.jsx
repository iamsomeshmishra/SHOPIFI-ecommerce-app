import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import { Button, Input, axiosClient } from '@/features/shared';
import { ArrowLeft, Layers, Plus, Trash2 } from 'lucide-react';

const AdminCategories = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get('/categories');
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchCategories();
  }, [token, user]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name || !slug) {
      alert('Name and slug are required fields.');
      return;
    }
    setFormLoading(true);
    try {
      await axiosClient.post('/categories', {
        name,
        slug: slug.toLowerCase().replace(/\s+/g, '-')
      });
      setName('');
      setSlug('');
      alert('Category added successfully.');
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating category');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category? Products linked to it will remain but lose category tags.')) return;
    try {
      await axiosClient.delete(`/categories/${id}`);
      alert('Category deleted.');
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting category');
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
              Product Categories
            </h1>
          </div>
        </div>

        {/* Layout Grid: 1/3 Form, 2/3 List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Create Category form card */}
          <div className="bg-white border border-hairline-light rounded-2xl p-6 md:p-8 elevation-light-3 flex flex-col gap-5">
            <h3 className="text-sm uppercase tracking-widest text-shade-60 font-bold flex items-center gap-1.5">
              <Plus size={16} /> Create Category
            </h3>
            <p className="text-xs text-shade-50">
              Categories group catalog products. Slug will format automatically (e.g. Modern Chairs to modern-chairs).
            </p>

            <form onSubmit={handleCreateCategory} className="flex flex-col gap-4">
              <Input
                label="Category Name"
                placeholder="e.g. Minimal Accessories"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  // Auto fill slug
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                }}
                required
              />

              <Input
                label="Slug ID (Path)"
                placeholder="e.g. minimal-accessories"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />

              <Button
                type="submit"
                disabled={formLoading}
                variant="primary-pill"
                className="w-full mt-2"
              >
                {formLoading ? 'Creating...' : 'Register Category'}
              </Button>
            </form>
          </div>

          {/* Category List */}
          <div className="lg:col-span-2 bg-white border border-hairline-light rounded-2xl p-6 md:p-8 elevation-light-3">
            <h3 className="text-sm uppercase tracking-widest text-shade-60 font-bold mb-6 flex items-center gap-1.5">
              <Layers size={16} /> Active Category database
            </h3>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-10 text-shade-40">
                No categories found.
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 text-shade-40 uppercase tracking-widest font-semibold">
                      <th className="py-3 px-4">Category Name</th>
                      <th className="py-3 px-4">Slug ID</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat._id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                        <td className="py-4 px-4 font-semibold text-black">{cat.name}</td>
                        <td className="py-4 px-4 font-mono text-zinc-500">{cat.slug}</td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleDeleteCategory(cat._id)}
                            className="text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Delete category"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminCategories;
