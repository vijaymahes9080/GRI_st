import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { getResponsiveDimensions, ResponsiveDimensions } from './breakpoints';

export const useResponsive = (): ResponsiveDimensions => {
  const [dimensions, setDimensions] = useState<ResponsiveDimensions>(getResponsiveDimensions());

  useEffect(() => {
    const handleChange = ({ window }: { window: ScaledSize }) => {
      setDimensions(getResponsiveDimensions());
    };

    const subscription = Dimensions.addEventListener('change', handleChange);
    return () => subscription.remove();
  }, []);

  return dimensions;
};
