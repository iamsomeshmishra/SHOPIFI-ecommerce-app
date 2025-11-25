import React from 'react';

const Input = React.forwardRef(({ 
  label, 
  error, 
  type = 'text', 
  placeholder, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs uppercase tracking-widest text-shade-50 font-medium font-body">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`w-full bg-white text-black text-sm px-3 py-2.5 rounded-md border border-hairline-light focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-shade-40 font-body ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 font-body font-medium mt-0.5">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
