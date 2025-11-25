import React from 'react';
import Button from '../ui/Button';
import { AlertCircle } from 'lucide-react';

const ApiErrorView = ({ message = 'Failed to load assets', onRetry }) => {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center text-center p-6 bg-zinc-950 border border-zinc-900 rounded-2xl max-w-lg mx-auto">
      <AlertCircle className="text-red-500 mb-4 animate-pulse" size={32} />
      <span className="text-[10px] tracking-widest uppercase text-shade-40 font-semibold mb-1">
        CONNECTION FAULT
      </span>
      <h3 className="text-lg font-medium text-white mb-2 font-display">
        {message}
      </h3>
      <p className="text-xs text-shade-30 max-w-xs leading-relaxed mb-6">
        We encountered a communication failure with our secure database layers. Check your network or try again.
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline-on-dark" className="text-xs py-2.5 px-5">
          Retry Request
        </Button>
      )}
    </div>
  );
};

export default ApiErrorView;
