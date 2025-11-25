import React, { useState, useEffect, useRef } from 'react';

const CinematicImage = ({ src, alt, className = '', containerClassName = '', ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    let observer;
    if (imgRef.current && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              if (observer) observer.disconnect();
            }
          });
        },
        { rootMargin: '100px' }
      );
      observer.observe(imgRef.current);
    } else {
      setIsInView(true);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div className={`relative overflow-hidden bg-zinc-900/60 ${containerClassName}`}>
      {/* Low-opacity placeholder color fill that fades out */}
      <div 
        className={`absolute inset-0 bg-zinc-950 transition-opacity duration-700 ease-in-out ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

      <img
        ref={imgRef}
        src={isInView ? src : undefined}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`transition-all duration-1000 ease-out ${
          isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-103 blur-sm'
        } ${className}`}
        {...props}
      />
    </div>
  );
};

export default CinematicImage;
