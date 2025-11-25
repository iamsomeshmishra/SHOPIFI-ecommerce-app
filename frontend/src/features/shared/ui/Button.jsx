import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary-pill', 
  type = 'button', 
  onClick, 
  disabled = false,
  className = '',
  ...props 
}) => {
  // Styles aligned exactly with DESIGN.md
  const baseStyles = 'inline-flex items-center justify-center font-body text-sm font-normal rounded-full transition-all duration-300 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  
  const variants = {
    'primary-pill': 'bg-black text-white hover:bg-shade-70 active:bg-shade-70 px-6 py-3',
    'outline-on-dark': 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-6 py-3',
    'outline-on-light': 'bg-transparent border border-black text-black hover:bg-black hover:text-white px-6 py-3',
    'aloe-pill': 'bg-aloe-10 text-black hover:bg-[#a9f5c0] active:bg-[#a9f5c0] px-6 py-3 font-semibold'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants['primary-pill']} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
