import { describe, it, expect, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { defineStore, setActivePinia } from 'pinia'
import { getMockedSelectedEntity, getMockedUserPermissions } from '../__mocks__'
import { useUserPermissions } from './useUserPermissions'

const mockedUserPermissions = getMockedUserPermissions()
const mockedSelectedEntity = getMockedSelectedEntity()

vi.mock('../stores', () => ({
  default: defineStore('common', {
    getters: {
      userPermissions: () => mockedUserPermissions,
      defaultEntity: () => mockedSelectedEntity,
    },
  }),
}))

describe('useUserPermissions', () => {
  beforeEach(() => {
    setActivePinia(createTestingPinia())
  })

  it.each([
    ['COADMI001', true], // Permission code exists
    ['COZDA0001', false], // Permission code does not exist
    [['COEMB001', 'COEVPO01', 'COADMI001'], true], // All permission codes exist
    [['COEMB001', 'COZZPO01', 'COADMI001'], true], // All permission codes exist except for one
    [['COWSA0001', 'COZRA0001', 'COQSA0001'], false], // Not all permission codes exist
  ])(
    'returns whether the user has permission (%s, %s) => %s',
    (permissions, expected) => {
      const { hasPermission } = useUserPermissions()
      const checkPermission = hasPermission(permissions)

      expect(checkPermission).toBe(expected)
    },
  )
})
