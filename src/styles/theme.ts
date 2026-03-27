import { createTheme } from '@mui/material/styles';

// Цветовая палитра (оригинальные цвета)
export const colors = {
  primary: '#00B64F',        // Зеленый
  primaryDark: '#00A844',    // Зеленый темнее
  primaryLight: '#E8F8F0',   // Зеленый светлый фон
  
  secondary: '#003366',      // Темно-синий
  secondaryLight: '#E8F0F7', // Синий светлый фон
  
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Градусы серого
  black: '#000000',
  white: '#FFFFFF',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Фоны
  background: '#FAFBFC',
  surface: '#FFFFFF',
  border: '#E0E7FF',
};

// Типографика
export const typography = {
  fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  fontSize: 14,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 600,
  
  h1: {
    fontSize: '2.5rem',     // 40px
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: '2rem',       // 32px
    fontWeight: 700,
    lineHeight: 1.25,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: '1.5rem',     // 24px
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: -0.2,
  },
  h4: {
    fontSize: '1.25rem',    // 20px
    fontWeight: 700,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1rem',       // 16px
    fontWeight: 700,
    lineHeight: 1.4,
  },
  h6: {
    fontSize: '0.875rem',   // 14px
    fontWeight: 700,
    lineHeight: 1.5,
  },
  
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  
  button: {
    fontSize: '1rem',
    fontWeight: 700,
    lineHeight: 1.4,
    textTransform: 'none',
  },
  
  caption: {
    fontSize: '0.75rem',
    fontWeight: 500,
    lineHeight: 1.4,
  },
};

// Тень
export const shadows = {
  xs: '0px 1px 2px rgba(0, 0, 0, 0.05)',
  sm: '0px 2px 4px rgba(0, 0, 0, 0.06)',
  md: '0px 4px 8px rgba(0, 0, 0, 0.08)',
  lg: '0px 8px 16px rgba(0, 0, 0, 0.1)',
  xl: '0px 12px 24px rgba(0, 0, 0, 0.12)',
  '2xl': '0px 16px 32px rgba(0, 0, 0, 0.14)',
  
  // Цветные тени
  green: '0px 4px 12px rgba(0, 182, 79, 0.15)',
  blue: '0px 4px 12px rgba(0, 51, 102, 0.15)',
};

// MUI Theme
const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      dark: colors.primaryDark,
      light: colors.primaryLight,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.secondary,
      light: colors.secondaryLight,
      contrastText: colors.white,
    },
    success: {
      main: colors.success,
    },
    warning: {
      main: colors.warning,
    },
    error: {
      main: colors.error,
    },
    info: {
      main: colors.info,
    },
    background: {
      default: colors.background,
      paper: colors.surface,
    },
    text: {
      primary: colors.gray[900],
      secondary: colors.gray[600],
      disabled: colors.gray[400],
    },
    divider: colors.border,
  },
  
  typography: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeightLight: typography.fontWeightLight,
    fontWeightRegular: typography.fontWeightRegular,
    fontWeightMedium: typography.fontWeightMedium,
    fontWeightBold: typography.fontWeightBold,
    
    h1: {
      fontSize: typography.h1.fontSize,
      fontWeight: typography.h1.fontWeight,
      lineHeight: typography.h1.lineHeight,
      letterSpacing: typography.h1.letterSpacing,
    },
    h2: {
      fontSize: typography.h2.fontSize,
      fontWeight: typography.h2.fontWeight,
      lineHeight: typography.h2.lineHeight,
      letterSpacing: typography.h2.letterSpacing,
    },
    h3: {
      fontSize: typography.h3.fontSize,
      fontWeight: typography.h3.fontWeight,
      lineHeight: typography.h3.lineHeight,
      letterSpacing: typography.h3.letterSpacing,
    },
    h4: typography.h4,
    h5: typography.h5,
    h6: typography.h6,
    subtitle1: typography.subtitle1,
    subtitle2: typography.subtitle2,
    body1: typography.body1,
    body2: typography.body2,
    button: typography.button,
    caption: typography.caption,
  },
  
  components: {
    // Button
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '1rem',
          padding: '10px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: shadows.md,
          },
          '&:active': {
            transform: 'translateY(0px)',
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
          boxShadow: shadows.green,
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primary} 100%)`,
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: colors.primaryLight,
          },
        },
      },
    },
    
    // TextField
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.3s ease',
            '& fieldset': {
              borderColor: colors.border,
              borderWidth: 1.5,
            },
            '&:hover fieldset': {
              borderColor: colors.gray[300],
            },
            '&.Mui-focused fieldset': {
              borderWidth: 2,
              borderColor: colors.primary,
              boxShadow: `0 0 0 3px ${colors.primaryLight}`,
            },
          },
          '& .MuiOutlinedInput-input': {
            fontSize: '1rem',
            padding: '12px 16px',
            '&::placeholder': {
              color: colors.gray[400],
              opacity: 1,
            },
          },
        },
      },
    },
    
    // Card
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.sm,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: shadows.lg,
            borderColor: colors.primary,
          },
        },
      },
    },
    
    // Alert
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '0.95rem',
        },
        standardError: {
          backgroundColor: '#FEE2E2',
          color: '#991B1B',
          '& .MuiAlert-icon': {
            color: colors.error,
          },
        },
        standardSuccess: {
          backgroundColor: '#DCFCE7',
          color: '#166534',
          '& .MuiAlert-icon': {
            color: colors.success,
          },
        },
      },
    },
    
    // Chip
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          height: 32,
        },
        filledPrimary: {
          backgroundColor: colors.primaryLight,
          color: colors.secondary,
        },
      },
    },
  },
  
  shape: {
    borderRadius: 8,
  },
});

export default theme;
