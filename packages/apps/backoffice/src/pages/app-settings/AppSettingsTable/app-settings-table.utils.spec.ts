import type { AppSettingItem } from '@backoffice/types/app-settings-list.type'
import { shouldShowMissingEnvIcon } from './app-settings-table.utils'

describe('app-settings-table.utils', () => {
  it('shouldShowMissingEnvIcon should return true when row is dynamic', () => {
    const dynamicRow: AppSettingItem = {
      key: 'Domain_acc_account_Test',
      type: 'string',
      domain: 'account',
      isDynamic: true,
      values: [
        {
          environment: 'ITG',
          envLabel: 'ITG',
          value: 'contact-created-account',
          lastModified: '2026-01-01T10:00:00Z',
          eTag: 'etag-itg',
        },
      ],
    }

    expect(shouldShowMissingEnvIcon(dynamicRow)).toBe(true)
  })

  it('shouldShowMissingEnvIcon should return false when row is not dynamic', () => {
    const staticRow: AppSettingItem = {
      key: 'Domain_acc_account_Test',
      type: 'string',
      domain: 'account',
      isDynamic: false,
      values: [
        {
          environment: 'ITG',
          envLabel: 'ITG',
          value: 'contact-created-account',
          lastModified: '2026-01-01T10:00:00Z',
          eTag: 'etag-itg',
        },
      ],
    }

    expect(shouldShowMissingEnvIcon(staticRow)).toBe(false)
  })

  it('shouldShowMissingEnvIcon should return false when isDynamic is undefined', () => {
    const rowWithoutDynamicFlag: AppSettingItem = {
      key: 'Domain_acc_account_Test',
      type: 'string',
      domain: 'account',
      values: [
        {
          environment: 'ITG',
          envLabel: 'ITG',
          value: 'contact-created-account',
          lastModified: '2026-01-01T10:00:00Z',
          eTag: 'etag-itg',
        },
      ],
    }

    expect(shouldShowMissingEnvIcon(rowWithoutDynamicFlag)).toBe(false)
  })
})
