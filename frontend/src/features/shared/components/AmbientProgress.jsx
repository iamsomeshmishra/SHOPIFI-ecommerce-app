import React, { useEffect, useState } from 'react';

const AmbientProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(15);
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        const add = Math.random() * 15;
        return Math.min(prev + add, 90);
      });
    }, 150);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[9999] pointer-events-none bg-transparent">
      <div 
        className="h-full bg-white transition-all duration-300 ease-out shadow-[0_0_8px_rgba(255,255,255,0.6)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default AmbientProgress;
