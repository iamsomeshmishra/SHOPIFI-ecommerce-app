import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const isDarkTrack = location.pathname === '/';

  const footerLinks = {
    shop: [
      { label: 'All Products', path: '/products' },
      { label: 'Apparel Catalog', path: '/products?category=luxury-apparel' },
      { label: 'Furnishings', path: '/products?category=modern-furniture' },
      { label: 'Minimalist Tech', path: '/products?category=premium-tech' }
    ],
    support: [
      { label: 'Shipping Info', path: '#' },
      { label: 'Returns & Exchanges', path: '#' },
      { label: 'FAQ', path: '#' },
      { label: 'Contact Us', path: '#' }
    ],
    brand: [
      { label: 'Editorial Story', path: '#' },
      { label: 'Our Materials', path: '#' },
      { label: 'Sustainability', path: '#' },
      { label: 'Careers', path: '#' }
    ]
  };

  return (
    <footer className={`w-full py-16 px-6 md:px-12 border-t transition-colors duration-300 font-body ${
      isDarkTrack 
        ? 'bg-canvas-night text-white border-zinc-900' 
        : 'bg-white text-black border-hairline-light'
    }`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        
        {/* Brand Summary Column */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <Link to="/" className="font-display text-lg font-medium tracking-[0.15em]">
            SHOPIFI
          </Link>
          <p className={`text-sm leading-relaxed max-w-sm ${
            isDarkTrack ? 'text-shade-40' : 'text-shade-50'
          }`}>
            We create modern artifacts of high aesthetic value. Running two parallel tracks in visual design, we merge editorial elegance with commerce.
          </p>
        </div>

        {/* Link Column 1: Shop */}
        <div className="flex flex-col gap-4">
          <span className="text-xs uppercase tracking-widest font-semibold text-shade-60">Catalog</span>
          <div className="flex flex-col gap-2.5">
            {footerLinks.shop.map((link) => (
              <Link 
                key={link.label} 
                to={link.path} 
                className={`text-sm transition-opacity hover:opacity-100 ${
                  isDarkTrack ? 'text-link-cool-3 opacity-70' : 'text-shade-60 opacity-80'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Link Column 2: Support */}
        <div className="flex flex-col gap-4">
          <span className="text-xs uppercase tracking-widest font-semibold text-shade-60">Client Service</span>
          <div className="flex flex-col gap-2.5">
            {footerLinks.support.map((link) => (
              <a 
                key={link.label} 
                href={link.path} 
                className={`text-sm transition-opacity hover:opacity-100 ${
                  isDarkTrack ? 'text-link-cool-3 opacity-70' : 'text-shade-60 opacity-80'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Link Column 3: Brand */}
        <div className="flex flex-col gap-4">
          <span className="text-xs uppercase tracking-widest font-semibold text-shade-60">Company</span>
          <div className="flex flex-col gap-2.5">
            {footerLinks.brand.map((link) => (
              <a 
                key={link.label} 
                href={link.path} 
                className={`text-sm transition-opacity hover:opacity-100 ${
                  isDarkTrack ? 'text-link-cool-3 opacity-70' : 'text-shade-60 opacity-80'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 border-zinc-900">
        <span className={`text-xs ${
          isDarkTrack ? 'text-shade-50' : 'text-shade-40'
        }`}>
          &copy; {new Date().getFullYear()} SHOPIFI Inc. All rights reserved.
        </span>
        
        <div className="flex items-center gap-6 text-xs uppercase tracking-widest font-medium">
          <a href="#" className={isDarkTrack ? 'text-shade-40 hover:text-white' : 'text-shade-50 hover:text-black'}>Privacy</a>
          <a href="#" className={isDarkTrack ? 'text-shade-40 hover:text-white' : 'text-shade-50 hover:text-black'}>Terms</a>
          <a href="#" className={isDarkTrack ? 'text-shade-40 hover:text-white' : 'text-shade-50 hover:text-black'}>Accessibility</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
