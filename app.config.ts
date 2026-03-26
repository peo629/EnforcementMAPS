import type { ExpoConfig } from 'expo/config';

const APP_ENV = (process.env.APP_ENV ?? 'development') as
  | 'development'
  | 'preview'
  | 'production';

const APP_NAME_SUFFIX: Record<typeof APP_ENV, string> = {
  development: ' (Dev)',
  preview: ' (Preview)',
  production: '',
};

const APP_BASE_NAME = process.env.EXPO_APP_NAME ?? 'EnforcementMAPS';

export default (): ExpoConfig => ({
  name: `${APP_BASE_NAME}${APP_NAME_SUFFIX[APP_ENV]}`,
  slug: process.env.EXPO_APP_SLUG ?? 'enforcement-maps',
  owner: 'civic-maps',
  scheme: process.env.EXPO_APP_SLUG ?? 'enforcement-maps',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'automatic',

  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#0a1628'
  },

  runtimeVersion: {
    policy: 'appVersion',
  },

  ios: {
    bundleIdentifier: 'au.melbourne.patrolzones',
    supportsTablet: false,
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        'Location is required to detect patrol zones and infer street position.'
    }
  },

  android: {
    package: 'au.melbourne.patrolzones',
    permissions: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
    adaptiveIcon: {
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png'
    },
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY ?? ''
      }
    }
  },

  plugins: [
    'expo-router',
    'expo-secure-store',
    [
      'expo-notifications',
      {
        defaultChannel: 'default'
      }
    ]
  ],

  extra: {
    appFamily: process.env.APP_FAMILY ?? 'CIVIC_MAPS',
    appProduct: process.env.APP_PRODUCT ?? 'ENFORCEMENT_MAPS',
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
    environment: process.env.EXPO_PUBLIC_ENVIRONMENT,
    eas: {
      projectId: process.env.EAS_PROJECT_ID ?? 'c69eeb3a-1e1f-45c5-bb7e-c81917e47e86'
    }
  }
});
