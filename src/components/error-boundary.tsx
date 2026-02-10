"use client";

import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <p className="text-4xl mb-4">😵</p>
          <h1 className="text-xl font-bold text-white/80 mb-2">앗, 문제가 생겼어요</h1>
          <p className="text-sm text-white/40 mb-8">잠시 후 다시 시도해주세요</p>
          <button
            type="button"
            onClick={this.handleReset}
            className="px-8 py-3 rounded-xlarge bg-white/10 text-white/70 font-semibold transition-transform active:scale-[0.97]"
          >
            다시 시도
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
