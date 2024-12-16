import { Component } from "react";
import PropTypes from "prop-types";

/**
 * ErrorBoundary Component
 * Catches rendering errors in its child components and displays a fallback UI.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to trigger fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging or external logging
    this.setState({ errorInfo });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  resetErrorBoundary = () => {
    // Allow resetting the error state (useful for retries)
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      if (typeof fallback === "function") {
        // Render a dynamic fallback component if a function is provided
        return fallback({
          error,
          errorInfo,
          resetError: this.resetErrorBoundary,
        });
      }
      // Render a static fallback component
      return fallback || <h1>Something went wrong.</h1>;
    }

    // Render child components if no error occurred
    return children;
  }
}

ErrorBoundary.propTypes = {
  fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.func]), // Static or dynamic fallback UI
  onError: PropTypes.func, // Custom error logging callback
  children: PropTypes.node.isRequired, // Child components
};

export default ErrorBoundary;
