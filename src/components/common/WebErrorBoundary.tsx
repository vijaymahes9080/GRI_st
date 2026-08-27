import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { ErrorTracker } from '../../core/services/errorTracker';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class WebErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[WebErrorBoundary] Caught exception:', error, errorInfo);
    try {
      ErrorTracker.captureCrash(error, errorInfo, this.props.fallbackTitle || 'WebAppModule');
    } catch {}
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 text-amber-500 shadow-xl shadow-amber-500/10 animate-pulse">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-slate-100 mb-2">
            {this.props.fallbackTitle || 'Gandhigram Portal Service Recovered'}
          </h2>

          <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
            The application experienced a temporary script exception, but has been safely contained. Your academic data and offline state remain protected.
          </p>

          <div className="flex gap-3">
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Application
            </button>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-2xl flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
