import { pegaseColors } from './pegase-colors.config'

/**
 * Legacy color mappings for backward compatibility with existing applets
 * Maps old Element Plus variable names to new Pégase colors
 */
export const legacyColorMappings = {
  // Base colors - mapped to new color system
  'base': {
    'blue-pulse': pegaseColors['black-rock']['900'],
    'persian': pegaseColors.jungle['400'],
    'persian-light': pegaseColors.tranquil['50'],
    'hover': pegaseColors.jungle['50'],
    'white': pegaseColors.white,
  },

  // Pennylane partner colors
  'pennylane': {
    'dark-green': pegaseColors.partner['pennylane-dark-green'],
  },

  // Persian color variants - mapped to jungle (primary color)
  'persian': {
    '50': pegaseColors.jungle['50'],
    '100': pegaseColors.jungle['100'],
    '200': pegaseColors.jungle['200'],
    '300': pegaseColors.jungle['300'],
    '400': pegaseColors.jungle['400'],
    '500': pegaseColors.jungle['400'], // Same as 400 for legacy compatibility
    '600': pegaseColors.jungle['600'],
    '700': pegaseColors.jungle['700'],
    '800': pegaseColors.jungle['800'],
    '900': pegaseColors.jungle['900'],
  },

  // Secondary colors with backgrounds and text variants
  'secondary': {
    'fuschia': pegaseColors.persian['500'],
    'fuschia-txt': pegaseColors.persian['800'],
    'fuschia-bg': pegaseColors.persian['100'],
    'amethyste': pegaseColors.jungle['400'],
    'amethyste-txt': pegaseColors.jungle['800'],
    'amethyste-bg': pegaseColors.jungle['50'],
    'cyan': pegaseColors['mint-tulip']['500'],
    'cyan-txt': pegaseColors['mint-tulip']['800'],
    'cyan-bg': pegaseColors['mint-tulip']['100'],
  },

  // Neutral grays
  'neutral': {
    'gray-50': pegaseColors.gray['50'],
    'gray-100': pegaseColors.gray['100'],
    'gray-200': pegaseColors.gray['200'],
    'gray-300': pegaseColors.gray['300'],
    'gray-400': pegaseColors.gray['400'],
    'gray-500': pegaseColors.gray['500'],
    'gray-700': pegaseColors.gray['700'],
    'gray-800': pegaseColors.gray['800'],
    'gray-900': pegaseColors.gray['900'],
  },

  // Functional colors with text and background variants
  'functionnal': {
    'red': pegaseColors.red['500'],
    'red-txt': pegaseColors.red['800'],
    'red-bg': pegaseColors.red['100'],
    'orange': pegaseColors.orange['500'],
    'orange-txt': pegaseColors.orange['800'],
    'orange-bg': pegaseColors.orange['100'],
    'yellow': pegaseColors.yellow['500'],
    'yellow-txt': pegaseColors.yellow['800'],
    'yellow-bg': pegaseColors.yellow['100'],
    'green': pegaseColors.green['500'],
    'green-txt': pegaseColors.green['800'],
    'green-bg': pegaseColors.green['100'],
    'teal': pegaseColors.teal['500'],
    'teal-txt': pegaseColors.teal['800'],
    'teal-bg': pegaseColors.teal['100'],
  },

  // Polar colors - mapped for compatibility
  'polar': {
    '50': pegaseColors.jungle['50'],
    '100': pegaseColors['humming-bird']['100'],
    '200': pegaseColors['humming-bird']['200'],
  },
} as const
