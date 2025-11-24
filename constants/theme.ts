export const Colors = {
  cream: '#FAF9F6',
  black: '#111111',
  charcoal: '#222222',
  lightGray: '#E5E4E1',
} as const;

export const Typography = {
  fontFamily: 'System',
  sizes: {
    title: 28,
    heading: 20,
    body: 16,
    label: 14,
    helper: 12,
    counter: 56,
  },
  weights: {
    regular: '400' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 1,
    wider: 2,
    widest: 3,
  },
} as const;

export const Layout = {
  maxContentWidth: 380,
  borderRadius: 24,
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  buttonPadding: {
    vertical: 12,
    horizontal: 20,
  },
} as const;
