import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

export interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  leftIcon,
  isPassword = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="mb-4 w-full">
      {label && <Text className="text-sm font-medium text-gray-700 mb-1.5">{label}</Text>}
      <View
        className={`flex-row items-center bg-gray-50 border px-3.5 py-3 rounded-xl ${
          error ? 'border-red-500 bg-red-50/20' : 'border-gray-200 focus:border-khadi-blue'
        } ${className}`}
      >
        {leftIcon && <View className="mr-2.5">{leftIcon}</View>}
        <TextInput
          className="flex-1 text-base text-gray-900 font-normal p-0"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} activeOpacity={0.7} className="ml-2">
            {showPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-xs text-red-500 mt-1 ml-1 font-medium">{error}</Text>}
    </View>
  );
};
