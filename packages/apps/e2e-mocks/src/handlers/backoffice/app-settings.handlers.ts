import { http, HttpResponse } from 'msw'

// Mock app settings list response
const mockAppSettingsList = {
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
          incoherent: null,
          eTag: 'etag-itg01-001',
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
      ],
    },
  ],
  totalCount: 2,
  page: 1,
  pageSize: 50,
}

// Mock domains response
const mockDomains = [
  { domainName: 'contact', keysCount: 15 },
  { domainName: 'account', keysCount: 12 },
  { domainName: 'front', keysCount: 8 },
  { domainName: 'ged', keysCount: 5 },
]

// Mock environments response
const mockEnvironments = [
  { environment: 'ITG', labels: ['ITG01', 'ITG02'] },
  { environment: 'REC', labels: ['REC01', 'REC02'] },
  { environment: 'PRD', labels: ['PRD01'] },
]

export const appSettingsHandlers = [
  // App settings list endpoint
  http.get('*/keys', () => {
    return HttpResponse.json(mockAppSettingsList)
  }),

  // Domains endpoint
  http.get('*/domains', () => {
    return HttpResponse.json(mockDomains)
  }),

  // Environments endpoint
  http.get('*/environments', () => {
    return HttpResponse.json(mockEnvironments)
  }),

  // Refresh app settings
  http.post('*/keys/refresh', () => {
    return HttpResponse.json({ success: true })
  }),

  // Create app setting
  http.post('*/keys', () => {
    return HttpResponse.json({ success: true })
  }),

  // Delete app setting
  http.delete('*/keys', () => {
    return HttpResponse.json({
      results: [{ environment: 'ITG', label: 'ITG01', success: true }],
      message: 'Deletion completed',
    })
  }),
]
