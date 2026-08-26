export const themeTokens = {
  colors: {
    primary: '#14532D', // Deep Academic Green
    primaryLight: '#DCFCE7',
    primaryDark: '#052E16',
    secondary: '#E6DFD4', // Earthy Sand tone
    tertiary: '#911C03', // Accent Maroon
    background: '#FAFAF9', // Very light warm neutral
    surface: '#FFFFFF',
    surfaceElevated: '#F5F5F4',
    surfaceMuted: '#E7E5E4',
    textPrimary: '#1C1917',
    textSecondary: '#57534E',
    textMuted: '#A8A29E',
    border: '#E7E5E4',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
  spacing: {
    0: 0,
    2: 2,
    4: 4,
    8: 8,
    12: 12,
    16: 16,
    20: 20,
    24: 24,
    32: 32,
    40: 40,
    48: 48,
    64: 64,
  },
  borderRadius: {
    none: 0,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    full: 9999,
  },
} as const;
