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
      {label && <Text className="text-sm font-medium text-slate-700 mb-1.5">{label}</Text>}
      <View
        className={`flex-row items-center bg-white border px-3 py-2.5 rounded-lg ${
          error ? 'border-red-500 bg-red-50/20' : 'border-slate-300 focus:border-khadi-blue shadow-sm'
        } ${className}`}
      >
        {leftIcon && <View className="mr-2.5">{leftIcon}</View>}
        <TextInput
          className="flex-1 text-base text-slate-900 font-normal p-0 outline-none h-6"
          placeholderTextColor="#94A3B8"
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} activeOpacity={0.7} className="ml-2">
            {showPassword ? <EyeOff size={18} color="#64748B" /> : <Eye size={18} color="#64748B" />}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-xs text-red-500 mt-1 font-medium">{error}</Text>}
    </View>
  );
};
