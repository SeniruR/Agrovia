// Design System for Agrovia Platform
// This file defines all UI constants and patterns used across the application

export const AGROVIA_DESIGN_SYSTEM = {
  // Brand Colors
  colors: {
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Main brand color
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    
    semantic: {
      success: {
        light: '#dcfce7',
        main: '#22c55e',
        dark: '#15803d',
      },
      warning: {
        light: '#fef3c7',
        main: '#f59e0b',
        dark: '#b45309',
      },
      error: {
        light: '#fee2e2',
        main: '#ef4444',
        dark: '#b91c1c',
      },
      info: {
        light: '#dbeafe',
        main: '#3b82f6',
        dark: '#1d4ed8',
      },
    },
    
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
  },

  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Spacing
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  // Shadows
  boxShadow: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    green: '0 4px 14px 0 rgb(34 197 94 / 0.15)',
  },

  // Component Variants
  components: {
    button: {
      primary: 'bg-agrovia-500 hover:bg-agrovia-600 text-white',
      secondary: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700',
      outline: 'border border-agrovia-500 text-agrovia-600 hover:bg-agrovia-50',
      ghost: 'text-agrovia-600 hover:bg-agrovia-50',
      danger: 'bg-error-500 hover:bg-error-600 text-white',
    },
    
    card: {
      default: 'bg-white rounded-xl shadow-md border border-neutral-200',
      elevated: 'bg-white rounded-xl shadow-lg border border-neutral-200',
      interactive: 'bg-white rounded-xl shadow-md border border-neutral-200 hover:shadow-lg transition-shadow',
    },
    
    badge: {
      success: 'bg-success-100 text-success-700 border border-success-200',
      warning: 'bg-warning-100 text-warning-700 border border-warning-200',
      error: 'bg-error-100 text-error-700 border border-error-200',
      info: 'bg-info-100 text-info-700 border border-info-200',
      neutral: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
    },
    
    input: {
      default: 'border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-agrovia-500 focus:border-agrovia-500',
      error: 'border border-error-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-error-500 focus:border-error-500',
    },
  },

  // Layout
  layout: {
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    headerHeight: '80px',
    sidebarWidth: '280px',
    footerHeight: '120px',
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Animation Duration
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
};

// Status Color Mappings
export const STATUS_COLORS = {
  // Order/Delivery Status
  pending: 'bg-warning-100 text-warning-800 border-warning-200',
  'in-progress': 'bg-info-100 text-info-800 border-info-200',
  processing: 'bg-info-100 text-info-800 border-info-200',
  completed: 'bg-success-100 text-success-800 border-success-200',
  delivered: 'bg-success-100 text-success-800 border-success-200',
  cancelled: 'bg-error-100 text-error-800 border-error-200',
  rejected: 'bg-error-100 text-error-800 border-error-200',
  
  // Crop Status
  available: 'bg-success-100 text-success-800 border-success-200',
  'ready-to-harvest': 'bg-success-100 text-success-800 border-success-200',
  growing: 'bg-warning-100 text-warning-800 border-warning-200',
  planted: 'bg-info-100 text-info-800 border-info-200',
  sold: 'bg-neutral-100 text-neutral-800 border-neutral-200',
  reserved: 'bg-warning-100 text-warning-800 border-warning-200',
  
  // Priority Levels
  urgent: 'bg-error-100 text-error-700 border-error-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-warning-100 text-warning-700 border-warning-200',
  low: 'bg-success-100 text-success-700 border-success-200',
  
  // Approval Status
  approved: 'bg-success-100 text-success-800 border-success-200',
  consider: 'bg-success-100 text-success-700 border-success-200',
  'not-consider': 'bg-error-100 text-error-700 border-error-200',
  
  // Product Types
  crop: 'bg-success-100 text-success-700 border-success-200',
  shop: 'bg-info-100 text-info-700 border-info-200',
  transport: 'bg-purple-100 text-purple-700 border-purple-200',
  
  // Stock Status
  active: 'bg-success-100 text-success-600',
  'out-of-stock': 'bg-error-100 text-error-600',
  'low-stock': 'bg-warning-100 text-warning-600',
};

// Helper function to get status color
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || STATUS_COLORS.pending;
};

// Common CSS Classes
export const COMMON_CLASSES = {
  // Container layouts
  pageContainer: 'min-h-screen bg-neutral-50',
  contentContainer: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  
  // Cards
  card: 'bg-white rounded-xl shadow-md border border-neutral-200 p-6',
  cardHover: 'bg-white rounded-xl shadow-md border border-neutral-200 p-6 hover:shadow-lg transition-shadow duration-300',
  
  // Buttons
  btnPrimary: 'bg-agrovia-500 hover:bg-agrovia-600 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200',
  btnSecondary: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium px-4 py-2 rounded-lg transition-colors duration-200',
  btnOutline: 'border border-agrovia-500 text-agrovia-600 hover:bg-agrovia-50 font-medium px-4 py-2 rounded-lg transition-colors duration-200',
  
  // Forms
  input: 'w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agrovia-500 focus:border-agrovia-500 transition-colors duration-200',
  inputError: 'w-full px-3 py-2 border border-error-300 rounded-lg focus:ring-2 focus:ring-error-500 focus:border-error-500 transition-colors duration-200',
  label: 'block text-sm font-medium text-neutral-700 mb-1',
  
  // Text styles
  heading1: 'text-3xl font-bold text-neutral-900',
  heading2: 'text-2xl font-bold text-neutral-900',
  heading3: 'text-xl font-semibold text-neutral-900',
  bodyText: 'text-neutral-600',
  mutedText: 'text-neutral-500 text-sm',
  
  // Status badges
  badge: 'px-3 py-1 rounded-full text-xs font-medium border',
  
  // Transitions
  transition: 'transition-all duration-300 ease-in-out',
  hoverScale: 'transform hover:scale-105 transition-transform duration-200',
};

export default AGROVIA_DESIGN_SYSTEM;
