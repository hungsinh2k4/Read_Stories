import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{error?: Error}>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.warn('DOM Error caught by boundary:', error.message);
    // Ignore DOM insertion errors - they're usually not critical
    if (error.name === 'NotFoundError' && error.message.includes('insertBefore')) {
      console.warn('Ignoring DOM insertion error, likely React Router conflict');
      this.setState({ hasError: false });
      return;
    }
  }

  render() {
    if (this.state.hasError && this.props.fallback) {
      const FallbackComponent = this.props.fallback;
      return <FallbackComponent error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
