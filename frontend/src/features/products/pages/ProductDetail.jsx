import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCartStore } from '@/features/cart';
import { useAuthStore } from '@/features/auth';
import { Button, axiosClient, ProductDetailSkeleton, CinematicImage, Meta } from '@/features/shared';
import { ProductCard } from '@/features/products';
import { Star, Truck, ShieldCheck, RefreshCw, AlertCircle, ShoppingBag } from 'lucide-react';

const ProductDetail = () => {
  const { slug } = useParams();
  const token = useAuthStore((state) => state.token);
  const addToCart = useCartStore((state) => state.addToCart);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [qty, setQty] = useState(1);

  // Review states
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Fetch product data
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get(`/products/${slug}`);
        setProduct(data);
        setActiveImage(data.images[0]);
        setQty(1);

        // Fetch related products
        if (data.category) {
          const { data: relatedData } = await axiosClient.get(
            `/products?category=${data.category.slug}&pageNumber=1`
          );
          // Filter out current product
          const filtered = (relatedData.products || []).filter(
            (p) => p._id !== data._id
          );
          setRelatedProducts(filtered.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, qty);
      alert(`${qty} x ${product.name} added to cart.`);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      setReviewError('Please enter a comment.');
      return;
    }
    setReviewLoading(true);
    setReviewError('');
    try {
      await axiosClient.post(
        `/products/${product._id}/reviews`,
        { rating: ratingInput, comment: commentInput }
      );
      
      // Reload product data to show new review
      const { data } = await axiosClient.get(`/products/${slug}`);
      setProduct(data);
      setCommentInput('');
      alert('Review submitted successfully.');
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Error submitting review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas-cream py-16">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-canvas-cream flex flex-col items-center justify-center p-6 text-center font-body text-black">
        <AlertCircle size={36} className="text-shade-40 mb-3" />
        <h3 className="text-xl font-medium">Product Not Found</h3>
        <p className="text-sm text-shade-50 mt-1">This item may have been discontinued.</p>
        <Link to="/products" className="mt-5">
          <Button variant="primary-pill">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'image': product.images || [activeImage],
    'description': product.description,
    'sku': product._id,
    'offers': {
      '@type': 'Offer',
      'url': window.location.href,
      'priceCurrency': 'USD',
      'price': product.price,
      'itemCondition': 'https://schema.org/NewCondition',
      'availability': product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      'priceValidUntil': '2027-12-31'
    }
  };

  return (
    <div className="w-full bg-canvas-cream text-black min-h-screen py-16 px-6 md:px-12 font-body">
      <Meta 
        title={`${product.name} | SHOPIFI`} 
        description={product.description || 'Curated luxury product design.'}
        ogImage={product.images?.[0] || activeImage}
        schema={productSchema}
      />
      <div className="max-w-7xl mx-auto flex flex-col gap-20">
        
        {/* Core Product Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-hairline-light rounded-2xl overflow-hidden aspect-[4/5] elevation-light-3">
              <CinematicImage 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover object-center"
                containerClassName="w-full h-full"
              />
            </div>
            
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 bg-white border rounded-lg overflow-hidden aspect-square ${
                      activeImage === img ? 'border-2 border-black scale-95' : 'border-hairline-light'
                    }`}
                  >
                    <CinematicImage src={img} alt={`thumbnail ${idx}`} className="w-full h-full object-cover" containerClassName="w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details Panel */}
          <div className="flex flex-col gap-8 lg:sticky lg:top-24">
            
            {/* Breadcrumb / Category */}
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-widest text-shade-50 font-semibold">
                {product.category?.name}
              </span>
              <h1 className="text-4xl font-display font-light text-black tracking-tight mt-1 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Pricing & Ratings */}
            <div className="flex items-center justify-between gap-4 border-b border-hairline-light pb-6">
              <span className="text-2xl font-bold font-body">${product.price?.toFixed(2)}</span>
              
              <div className="flex items-center gap-1.5">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star 
                      key={idx} 
                      size={14} 
                      className={idx < Math.round(product.rating) ? 'text-black fill-black' : 'text-zinc-300'} 
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-shade-50">
                  ({product.numReviews} review{product.numReviews !== 1 ? 's' : ''})
                </span>
              </div>
            </div>

            {/* Description Text */}
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-widest text-shade-50 font-bold">The Narrative</span>
              <p className="text-sm leading-relaxed text-shade-60">{product.description}</p>
            </div>

            {/* Inventory / Cart Actions */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-shade-50">Quantity</span>
                <div className="flex items-center border border-hairline-light bg-white rounded-full p-1 font-semibold">
                  <button 
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-semibold">{qty}</span>
                  <button 
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
                
                <span className={`text-xs font-semibold ${product.stock > 0 ? 'text-emerald-700' : 'text-red-500'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Sold Out'}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <Button 
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  variant="primary-pill" 
                  className="flex-1 group py-3.5 text-sm"
                >
                  <ShoppingBag size={16} className="mr-2" /> Add To Shopping Bag
                </Button>
              </div>
            </div>

            {/* Technical Specifications Accordion */}
            {product.specs && product.specs.length > 0 && (
              <div className="flex flex-col gap-4 border-t border-hairline-light pt-6">
                <span className="text-xs uppercase tracking-widest text-shade-50 font-bold">Specifications</span>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 border border-hairline-light bg-white rounded-xl p-4 text-xs font-medium elevation-light-3">
                  {product.specs.map((spec, idx) => (
                    <React.Fragment key={idx}>
                      <span className="text-shade-50 py-1 border-b border-zinc-100">{spec.label}</span>
                      <span className="text-black py-1 border-b border-zinc-100 font-semibold">{spec.value}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Brand Commitments */}
            <div className="grid grid-cols-3 gap-3 text-center border-t border-hairline-light pt-6 text-[10px] text-shade-50 uppercase tracking-widest font-semibold">
              <div className="flex flex-col items-center gap-1.5">
                <Truck size={18} className="text-black" />
                <span>Complimentary Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <ShieldCheck size={18} className="text-black" />
                <span>Lifetime Guarantee</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <RefreshCw size={18} className="text-black" />
                <span>Seamless Exchanges</span>
              </div>
            </div>

          </div>
        </div>

        {/* User Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 border-t border-hairline-light pt-16">
          
          {/* Write a Review Block */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-display text-black">Client Feedback</h3>
            <p className="text-xs text-shade-50 leading-relaxed max-w-xs">
              Honest critiques help us refine our templates. Only authenticated clients are eligible to register feedback.
            </p>

            {token ? (
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 mt-2">
                {reviewError && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-semibold">
                    {reviewError}
                  </div>
                )}
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-shade-50 font-bold">Rating</label>
                  <select 
                    value={ratingInput}
                    onChange={(e) => setRatingInput(Number(e.target.value))}
                    className="bg-white border border-hairline-light rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black font-semibold"
                  >
                    <option value="5">5 Stars (Excellent)</option>
                    <option value="4">4 Stars (Good)</option>
                    <option value="3">3 Stars (Average)</option>
                    <option value="2">2 Stars (Poor)</option>
                    <option value="1">1 Star (Dissatisfied)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-shade-50 font-bold">Comments</label>
                  <textarea 
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    rows={4}
                    placeholder="Write your review here..."
                    className="w-full bg-white border border-hairline-light rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black font-body outline-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={reviewLoading}
                  variant="outline-on-light" 
                  className="py-2.5 text-xs uppercase font-bold tracking-widest"
                >
                  {reviewLoading ? 'Submitting...' : 'Post Critique'}
                </Button>
              </form>
            ) : (
              <div className="bg-zinc-50 border border-hairline-light rounded-xl p-4 text-xs font-semibold text-center">
                Please{' '}
                <Link to={`/login?redirect=/products/${slug}`} className="text-black underline font-bold">
                  log in
                </Link>{' '}
                to leave client feedback.
              </div>
            )}
          </div>

          {/* Feedback List Block */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h4 className="text-sm uppercase tracking-widest text-shade-50 font-bold font-body">Reviews ({product.reviews?.length || 0})</h4>
            
            {product.reviews && product.reviews.length === 0 ? (
              <div className="bg-white border border-hairline-light rounded-2xl p-8 text-center text-shade-40 elevation-light-3">
                No critiques have been submitted for this artifact yet.
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {product.reviews.map((rev) => (
                  <div key={rev._id} className="bg-white border border-hairline-light rounded-2xl p-6 flex flex-col gap-3 elevation-light-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-black">{rev.name}</span>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star 
                            key={idx} 
                            size={12} 
                            className={idx < rev.rating ? 'text-black fill-black' : 'text-zinc-200'} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-shade-60 leading-relaxed font-medium">{rev.comment}</p>
                    <span className="text-[10px] text-shade-40 font-semibold uppercase">
                      {new Date(rev.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="flex flex-col gap-8 border-t border-hairline-light pt-16">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-widest text-shade-50 font-bold">Collection Synergy</span>
              <h3 className="text-2xl font-display font-light text-black">Related Artifacts</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;
