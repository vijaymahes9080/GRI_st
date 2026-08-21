import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AlertTriangle, RefreshCw } from 'lucide-react-native';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
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
    // Structured logging for crash monitoring
    console.error('ErrorBoundary caught exception:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center p-6 bg-gray-50">
          <View className="bg-red-50 p-4 rounded-full mb-4 border border-red-200">
            <AlertTriangle size={36} color="#911C03" />
          </View>
          <Text className="text-lg font-bold text-gray-900 text-center mb-1">
            {this.props.fallbackTitle || 'Component Unavailable'}
          </Text>
          <Text className="text-xs text-gray-600 text-center mb-6 px-4">
            An unexpected error occurred in this module. Other university services remain active.
          </Text>

          <TouchableOpacity
            onPress={this.handleReset}
            activeOpacity={0.8}
            className="flex-row items-center bg-[#518214] px-5 py-3 rounded-xl shadow-sm"
          >
            <RefreshCw size={16} color="#FFFFFF" />
            <Text className="text-sm font-semibold text-white ml-2">Reload Module</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
