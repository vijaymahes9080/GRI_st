import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-saffron text-white';
      case 'outline':
        return 'bg-transparent border border-khadi-blue text-khadi-blue';
      case 'danger':
        return 'bg-red-600 text-white';
      case 'primary':
      default:
        return 'bg-khadi-blue text-white';
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return 'py-2 px-4 rounded-lg';
      case 'lg':
        return 'py-4 px-6 rounded-xl';
      case 'md':
      default:
        return 'py-3.5 px-5 rounded-xl';
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return 'text-khadi-blue font-semibold';
      case 'primary':
      case 'secondary':
      case 'danger':
      default:
        return 'text-white font-semibold';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      case 'md':
      default:
        return 'text-base';
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center ${getVariantStyle()} ${getSizeStyle()} ${
        disabled ? 'opacity-50' : ''
      } ${className}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#0D47A1' : '#FFFFFF'} />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text className={`text-center ${getTextStyle()} ${getTextSize()} ${leftIcon ? 'ml-2' : ''} ${rightIcon ? 'mr-2' : ''}`}>
            {title}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};
