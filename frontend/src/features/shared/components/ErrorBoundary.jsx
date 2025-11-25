import React, { Component } from 'react';
import Button from '../ui/Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center font-body selection:bg-aloe-10 selection:text-black">
          <div className="max-w-xl flex flex-col items-center gap-6">
            <span className="text-xs uppercase tracking-[0.4em] text-red-500 font-medium animate-pulse">
              SYSTEM CONFLICT
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-light tracking-wide leading-tight">
              AN EXCEPTION OCCURRED.
            </h1>
            <p className="text-shade-30 text-sm leading-relaxed max-w-md">
              A runtime rendering error disrupted the layout layer. This error has been logged, and we have secured the interface to prevent data loss.
            </p>
            {this.state.error && (
              <div className="w-full bg-zinc-950 border border-zinc-900 rounded-lg p-4 text-left font-mono text-xs text-red-400 overflow-auto max-h-40">
                {this.state.error.toString()}
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
              <Button onClick={this.handleReload} variant="aloe-pill">
                Reload Component
              </Button>
              <Button onClick={this.handleGoHome} variant="outline-on-dark">
                Return to Safety
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
