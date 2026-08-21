import { Dimensions, PixelRatio } from 'react-native';

const BASE_WIDTH = 375; // Standard mobile layout reference

export const scaleWidth = (size: number): number => {
  const { width } = Dimensions.get('window');
  return (width / BASE_WIDTH) * size;
};

export const scaleFont = (size: number): number => {
  const fontScale = PixelRatio.getFontScale();
  return size * fontScale;
};

export const clamp = (val: number, min: number, max: number): number => {
  return Math.min(Math.max(val, min), max);
};
