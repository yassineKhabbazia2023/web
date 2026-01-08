import type { AppSettingsListResponse } from '@backoffice/types/app-settings-list.type'

declare global {
  interface Window {
    EnvVars: {
      VITE_MSAL_CLIENT_ID: string
      VITE_MSAL_REDIRECT_URI: string
      VITE_MSAL_POST_LOGOUT_REDIRECT_URI: string
      VITE_MSAL_AUTHORITY: string
      VITE_MSAL_BACK_CLIENT_ID: string
      VITE_API_BASE_URL: string
    }
  }
}

// Mock runtime environment variables (window.EnvVars)
export function mockWindowEnvVars() {
  if (typeof window !== 'undefined') {
    window.EnvVars = {
      VITE_MSAL_CLIENT_ID: 'mock-client-id-9b2c80af',
      VITE_MSAL_REDIRECT_URI: 'http://localhost:9001',
      VITE_MSAL_POST_LOGOUT_REDIRECT_URI: 'http://localhost:9001',
      VITE_MSAL_AUTHORITY: 'https://login.microsoftonline.com/mock-tenant',
      VITE_MSAL_BACK_CLIENT_ID: 'mock-backend-client-id',
      VITE_API_BASE_URL: 'https://backoffice.pulse.rydge.fr/back',
    }
  }
}

// Mock backend API response for app settings management
export const getAppSettingsListMock = (): AppSettingsListResponse => {
  return {
    items: [
      {
        key: 'cnt_contact_Database_ConnectionString',
        type: 'secret',
        domain: 'contact',
        values: [
          {
            environment: 'ITG',
            label: 'itg01',
            envLabel: 'ITG01',
            value: '@Microsoft.KeyVault(https://kv-pulse-itg.vault.azure.net/secrets/ContactDbConn-itg01)',
            lastModified: '2025-01-14T09:50:50+00:00',
            incoherent: 'valeur incohérente',
            eTag: 'etag-itg01-001',
          },
          {
            environment: 'ITG',
            label: 'itg02',
            envLabel: 'ITG02',
            value: '@Microsoft.KeyVault(https://kv-pulse-itg.vault.azure.net/secrets/ContactDbConn-itg02)',
            lastModified: '2025-01-14T09:50:50+00:00',
            incoherent: null,
            eTag: 'etag-itg02-001',
          },
          {
            environment: 'REC',
            label: 'rec01',
            envLabel: 'REC01',
            value: '@Microsoft.KeyVault(https://kv-pulse-rec.vault.azure.net/secrets/ContactDbConn-rec01)',
            lastModified: '2025-01-14T09:50:50+00:00',
            incoherent: null,
            eTag: 'etag-rec01-001',
          },
          {
            environment: 'REC',
            label: 'rec02',
            envLabel: 'REC02',
            value: '@Microsoft.KeyVault(https://kv-pulse-rec.vault.azure.net/secrets/ContactDbConn-rec02)',
            lastModified: '2025-01-14T09:50:50+00:00',
            incoherent: null,
            eTag: 'etag-rec02-001',
          },
        ],
      },
      {
        key: 'cnt_contact_BrokerSetting__Topic',
        type: 'string',
        domain: 'contact',
        values: [
          {
            environment: 'ITG',
            envLabel: 'ITG01',
            value: 'notifications',
            lastModified: '2025-01-14T09:50:50+00:00',
            incoherent: null,
            eTag: 'etag-itg01-002',
          },
          {
            environment: 'REC',
            envLabel: 'REC01',
            value: 'notifications',
            lastModified: '2025-01-14T09:50:50+00:00',
            incoherent: null,
            eTag: 'etag-rec01-002',
          },
          {
            environment: 'PRD',
            envLabel: 'PRD01',
            value: 'notifications',
            lastModified: '2025-01-14T09:50:50+00:00',
            incoherent: null,
            eTag: 'etag-prd01-001',
          },
        ],
      },
      {
        key: 'acc_account_ApiSettings__BaseUrl',
        type: 'string',
        domain: 'account',
        values: [
          {
            environment: 'ITG',
            envLabel: 'ITG01',
            value: 'https://api-itg01.pulse.com',
            lastModified: '2025-01-13T14:30:00+00:00',
            incoherent: null,
            eTag: 'etag-itg01-003',
          },
          {
            environment: 'REC',
            envLabel: 'REC01',
            value: 'https://api-rec01.pulse.com',
            lastModified: '2025-01-13T14:30:00+00:00',
            incoherent: null,
            eTag: 'etag-rec01-003',
          },
          {
            environment: 'PRD',
            envLabel: 'PRD01',
            value: 'https://api.pulse.com',
            lastModified: '2025-01-13T14:30:00+00:00',
            incoherent: null,
            eTag: 'etag-prd01-002',
          },
        ],
      },
      {
        key: 'acc_account_Auth__ClientSecret',
        type: 'secret',
        domain: 'account',
        values: [
          {
            environment: 'ITG',
            envLabel: 'ITG01',
            value: '',
            lastModified: '2025-01-10T08:00:00+00:00',
            incoherent: 'valeur manquante',
            eTag: 'etag-itg01-004',
          },
          {
            environment: 'REC',
            envLabel: 'REC01',
            value: '@Microsoft.KeyVault(https://kv-pulse-rec.vault.azure.net/secrets/AuthClientSecret)',
            lastModified: '2025-01-10T08:00:00+00:00',
            incoherent: null,
            eTag: 'etag-rec01-004',
          },
          {
            environment: 'PRD',
            envLabel: 'PRD01',
            value: '@Microsoft.KeyVault(https://kv-pulse-prd.vault.azure.net/secrets/AuthClientSecret)',
            lastModified: '2025-01-10T08:00:00+00:00',
            incoherent: null,
            eTag: 'etag-prd01-003',
          },
        ],
      },
      {
        key: 'frnt_front_Features__NewUIEnabled',
        type: 'string',
        domain: 'front',
        values: [
          {
            environment: 'ITG',
            envLabel: 'ITG01',
            value: 'true',
            lastModified: '2025-01-15T10:20:00+00:00',
            incoherent: null,
            eTag: 'etag-itg01-005',
          },
          {
            environment: 'REC',
            envLabel: 'REC01',
            value: 'false',
            lastModified: '2025-01-15T10:20:00+00:00',
            incoherent: null,
            eTag: 'etag-rec01-005',
          },
          {
            environment: 'PRD',
            envLabel: 'PRD01',
            value: 'true',
            lastModified: '2025-01-15T10:20:00+00:00',
            incoherent: null,
            eTag: 'etag-prd01-004',
          },
        ],
      },
    ],
    totalCount: 10,
    page: 1,
    pageSize: 50,
  }
}
