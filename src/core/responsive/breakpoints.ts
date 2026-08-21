import { Dimensions, PixelRatio } from 'react-native';

export interface Breakpoints {
  compact: number; // Small phone < 360dp
  medium: number;  // Standard phone 360dp - 599dp
  expanded: number;// Tablet / Large screen >= 600dp
  largeTablet: number; // >= 840dp
}

export const defaultBreakpoints: Breakpoints = {
  compact: 0,
  medium: 360,
  expanded: 600,
  largeTablet: 840,
};

export type DeviceType = 'compact' | 'medium' | 'expanded' | 'largeTablet';
export type Orientation = 'portrait' | 'landscape';

export interface ResponsiveDimensions {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
  deviceType: DeviceType;
  orientation: Orientation;
  isTablet: boolean;
  isLandscape: boolean;
}

export const getDeviceType = (width: number): DeviceType => {
  if (width >= defaultBreakpoints.largeTablet) return 'largeTablet';
  if (width >= defaultBreakpoints.expanded) return 'expanded';
  if (width >= defaultBreakpoints.medium) return 'medium';
  return 'compact';
};

export const getResponsiveDimensions = (): ResponsiveDimensions => {
  const { width, height } = Dimensions.get('window');
  const scale = PixelRatio.get();
  const fontScale = PixelRatio.getFontScale();
  const orientation: Orientation = width > height ? 'landscape' : 'portrait';
  const deviceType = getDeviceType(width);

  return {
    width,
    height,
    scale,
    fontScale,
    deviceType,
    orientation,
    isTablet: deviceType === 'expanded' || deviceType === 'largeTablet',
    isLandscape: orientation === 'landscape',
  };
};
