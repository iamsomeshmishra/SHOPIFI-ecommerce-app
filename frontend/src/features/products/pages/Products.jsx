import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { axiosClient, Button, ProductGridSkeleton, Meta } from '@/features/shared';
import { ProductCard } from '@/features/products';
import { Filter, SlidersHorizontal, Search, ArrowUpDown, RefreshCw } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State variables for items
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState(1);
  const [count, setCount] = useState(0);

  // Active filter states
  const activeCategory = searchParams.get('category') || '';
  const activeSort = searchParams.get('sortBy') || 'newest';
  const activePage = Number(searchParams.get('pageNumber')) || 1;
  const activeKeyword = searchParams.get('keyword') || '';

  // Local filter states
  const [searchInput, setSearchInput] = useState(activeKeyword);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axiosClient.get('/categories');
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products based on params
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (activeCategory) queryParams.set('category', activeCategory);
        if (activeSort) queryParams.set('sortBy', activeSort);
        if (activePage) queryParams.set('pageNumber', activePage.toString());
        if (activeKeyword) queryParams.set('keyword', activeKeyword);
        if (searchParams.get('minPrice')) queryParams.set('minPrice', searchParams.get('minPrice'));
        if (searchParams.get('maxPrice')) queryParams.set('maxPrice', searchParams.get('maxPrice'));

        const { data } = await axiosClient.get(`/products?${queryParams.toString()}`);
        setProducts(data.products || []);
        setPages(data.pages || 1);
        setCount(data.count || 0);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams, activeCategory, activeSort, activePage, activeKeyword]);

  // Set filter query parameters
  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset page on filter update
    if (key !== 'pageNumber') {
      newParams.set('pageNumber', '1');
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters('keyword', searchInput);
  };

  const handlePriceFilterSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (minPrice) newParams.set('minPrice', minPrice);
    else newParams.delete('minPrice');

    if (maxPrice) newParams.set('maxPrice', maxPrice);
    else newParams.delete('maxPrice');

    newParams.set('pageNumber', '1');
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  return (
    <div className="w-full bg-canvas-cream text-black min-h-screen py-16 px-6 md:px-12 font-body">
      <Meta 
        title={`${activeCategory ? activeCategory.toUpperCase() + ' | ' : ''}SHOPIFI Catalog`}
        description={`Explore our collection of premium design artifacts in ${activeCategory || 'all categories'}. Crafted to resist trends and endure lifetimes.`}
      />
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Page Title & Search Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-hairline-light">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-widest text-shade-50 font-semibold font-body">Collections</span>
            <h1 className="text-3xl md:text-5xl font-display font-light text-black">
              {activeCategory 
                ? categories.find(c => c.slug === activeCategory)?.name || 'Catalog'
                : 'Browse All Products'}
            </h1>
            <span className="text-xs text-shade-50 font-medium font-body">{count} artifacts available</span>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm flex items-center">
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-white text-sm text-black border border-hairline-light rounded-full pl-5 pr-10 py-2.5 focus:outline-none focus:border-black transition-colors"
            />
            <button type="submit" className="absolute right-3.5 text-zinc-400 hover:text-black cursor-pointer">
              <Search size={16} />
            </button>
          </form>
        </div>

        {/* Filter Controls Toggle Bar (Mobile) */}
        <div className="flex items-center justify-between md:hidden border-b border-hairline-light pb-4">
          <button 
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest bg-white border border-hairline-light px-4 py-2 rounded-full active:scale-95"
          >
            <Filter size={14} /> Filters
          </button>
          
          <select
            value={activeSort}
            onChange={(e) => updateFilters('sortBy', e.target.value)}
            className="text-xs font-semibold uppercase tracking-widest bg-white border border-hairline-light px-4 py-2 rounded-full focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-start">
          
          {/* Left Filter Column (Desktop) */}
          <aside className={`md:flex flex-col gap-8 ${showFiltersMobile ? 'flex' : 'hidden md:flex'}`}>
            
            {/* Category Filter */}
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-widest font-semibold text-shade-60">Categories</span>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => updateFilters('category', '')}
                  className={`text-left text-sm py-1 font-medium hover:underline ${
                    !activeCategory ? 'font-bold text-black border-l-2 border-black pl-2' : 'text-shade-50 pl-2'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => updateFilters('category', cat.slug)}
                    className={`text-left text-sm py-1 font-medium hover:underline ${
                      activeCategory === cat.slug ? 'font-bold text-black border-l-2 border-black pl-2' : 'text-shade-50 pl-2'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-widest font-semibold text-shade-60">Price Limits</span>
              <form onSubmit={handlePriceFilterSubmit} className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min ($)"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-white border border-hairline-light rounded px-3 py-1.5 text-xs outline-none focus:border-black transition-colors"
                  />
                  <span className="text-shade-40">-</span>
                  <input
                    type="number"
                    placeholder="Max ($)"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-white border border-hairline-light rounded px-3 py-1.5 text-xs outline-none focus:border-black transition-colors"
                  />
                </div>
                <Button type="submit" variant="outline-on-light" className="py-2 text-xs">
                  Apply Prices
                </Button>
              </form>
            </div>

            {/* Clear All */}
            <button 
              onClick={clearAllFilters}
              className="text-left text-xs uppercase tracking-widest font-bold text-red-500 hover:text-red-700 mt-2 flex items-center gap-1.5"
            >
              <RefreshCw size={12} /> Reset All Filters
            </button>
          </aside>

          {/* Right Product Grid Column */}
          <main className="md:col-span-3 flex flex-col gap-12">
            
            {/* Sorting controls (Desktop) */}
            <div className="hidden md:flex items-center justify-between bg-white border border-hairline-light rounded-xl p-3 elevation-light-3">
              <span className="text-xs text-shade-50 font-medium">
                Showing {products.length} of {count} products
              </span>
              
              <div className="flex items-center gap-2">
                <ArrowUpDown size={14} className="text-shade-40" />
                <select
                  value={activeSort}
                  onChange={(e) => updateFilters('sortBy', e.target.value)}
                  className="text-xs uppercase tracking-widest font-bold focus:outline-none bg-transparent cursor-pointer py-1"
                >
                  <option value="newest">Newest Releases</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Loader / Grid */}
            {loading ? (
              <ProductGridSkeleton count={6} />
            ) : products.length === 0 ? (
              <div className="min-h-[400px] bg-white border border-hairline-light rounded-2xl flex flex-col items-center justify-center text-center p-8 elevation-light-3">
                <SlidersHorizontal size={36} className="text-shade-40 mb-3" />
                <h3 className="text-lg font-medium text-black">No artifacts matched</h3>
                <p className="text-sm text-shade-50 mt-1 max-w-xs">
                  Try adjusting your keywords, modifying your price bounds, or switching category tags.
                </p>
                <Button onClick={clearAllFilters} variant="primary-pill" className="mt-5 py-2.5 text-xs">
                  Reset Search
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {Array.from({ length: pages }).map((_, idx) => {
                  const pgNum = idx + 1;
                  return (
                    <button
                      key={pgNum}
                      onClick={() => updateFilters('pageNumber', pgNum.toString())}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold transition-colors border ${
                        activePage === pgNum
                          ? 'bg-black border-black text-white'
                          : 'bg-white border-hairline-light text-zinc-600 hover:border-black hover:text-black'
                      }`}
                    >
                      {pgNum}
                    </button>
                  );
                })}
              </div>
            )}

          </main>
        </div>

      </div>
    </div>
  );
};

export default Products;
