import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to gracefully handle errors in child components
 * Prevents the entire application from crashing when a component fails
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetErrorBoundary = (): void => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10">
          <h2 className="text-xl font-medium text-red-800 dark:text-red-400 mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            We're sorry, but this component encountered an error. Please try again later.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-4 max-w-md text-center">
            Error: {this.state.error?.message || 'Unknown error'}
          </p>
          <div className="flex gap-4">
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={this.resetErrorBoundary}
            >
              Try Again
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.href = '/about#developer'}
            >
              Contact Developer
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}