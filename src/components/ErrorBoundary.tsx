import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 p-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-stone-900">Something went wrong.</h1>
          <p className="mb-8 text-stone-600">
            We apologize for the inconvenience. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-stone-900 px-8 py-3 font-medium text-white transition-transform hover:scale-105 active:scale-95"
          >
            Reload Page
          </button>
          {this.state.error && (
            <pre className="mt-8 max-w-full overflow-auto rounded-lg bg-stone-100 p-4 text-left text-xs text-stone-500">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
