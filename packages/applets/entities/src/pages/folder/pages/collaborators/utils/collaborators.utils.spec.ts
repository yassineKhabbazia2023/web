import { getBusinessRoleColor, splitRoleLabelsIntoGroups, getOverflowIndicatorColor } from './collaborators.utils'

import {
  ROLE_BUSINESS_COLORS,
  DEFAULT_MIXED_ROLE_COLOR,
  MAX_MAIN_ROLES_SHORT,
  MAX_MAIN_ROLES_LONG,
} from '../constants/collaborators.const'

import type { RoleLabel } from '../types'

describe('collaborators.utils', () => {
  describe('getBusinessRoleColor', () => {
    it.each([
      ['transverse', ROLE_BUSINESS_COLORS.transverse],
      ['esc', ROLE_BUSINESS_COLORS.esc],
      ['conseil', ROLE_BUSINESS_COLORS.conseil],
      ['juridique', ROLE_BUSINESS_COLORS.juridique],
      ['social', ROLE_BUSINESS_COLORS.social],
      ['unknown', DEFAULT_MIXED_ROLE_COLOR],
      ['', DEFAULT_MIXED_ROLE_COLOR],
      [null, DEFAULT_MIXED_ROLE_COLOR],
      ['  ESC  ', ROLE_BUSINESS_COLORS.esc],
    ])('returns correct color for business "%s"', (business, expectedColor) => {
      expect(getBusinessRoleColor(business as string)).toBe(expectedColor)
    })
  })

  describe('splitRoleLabelsIntoGroups', () => {
    const baseRoles: RoleLabel[] = [
      {
        labelId: 1,
        code: '',
        customerLabel: '',
        collaboratorLabel: '',
        business: 'esc',
        description: '',
        isVisible: true,
      },
      {
        labelId: 2,
        code: '',
        customerLabel: '',
        collaboratorLabel: '',
        business: 'transverse',
        description: '',
        isVisible: true,
      },
    ]

    it('returns empty groups when input is empty or invalid', () => {
      expect(splitRoleLabelsIntoGroups([])).toEqual({ main: [], others: [] })
      expect(splitRoleLabelsIntoGroups(null as any)).toEqual({ main: [], others: [] })
      expect(splitRoleLabelsIntoGroups(undefined as any)).toEqual({ main: [], others: [] })
    })

    it('returns main roles limited by MAX_MAIN_ROLES_SHORT if total description length exceeds MAX_DESCRIPTION_LENGTH', () => {
      // clone baseRoles et modifie les descriptions pour qu'elles soient longues
      const rolesLongDesc = baseRoles.map((role) => ({
        ...role,
        description: 'a'.repeat(30),
      }))

      const groups = splitRoleLabelsIntoGroups(rolesLongDesc)
      expect(groups.main.length).toBe(MAX_MAIN_ROLES_SHORT)
      expect(groups.others.length).toBe(rolesLongDesc.length - MAX_MAIN_ROLES_SHORT)
    })

    it('returns main roles limited by MAX_MAIN_ROLES_LONG if total description length is under MAX_DESCRIPTION_LENGTH', () => {
      // clone baseRoles et modifie les descriptions pour qu'elles soient courtes
      const rolesShortDesc = baseRoles.map((role) => ({
        ...role,
        description: 'short',
      }))

      const groups = splitRoleLabelsIntoGroups(rolesShortDesc)
      expect(groups.main.length).toBe(MAX_MAIN_ROLES_LONG)
      expect(groups.others.length).toBe(0)
    })
  })

  describe('getOverflowIndicatorColor', () => {
    it('returns DEFAULT_MIXED_ROLE_COLOR if input is empty, null or first label missing business', () => {
      expect(getOverflowIndicatorColor([])).toBe(DEFAULT_MIXED_ROLE_COLOR)
      expect(getOverflowIndicatorColor(null as any)).toBe(DEFAULT_MIXED_ROLE_COLOR)
      expect(getOverflowIndicatorColor([{ labelId: 1, business: '' } as any])).toBe(DEFAULT_MIXED_ROLE_COLOR)
    })

    it('returns business color if all roles share the same business', () => {
      const roles: RoleLabel[] = [
        {
          labelId: 1,
          code: '',
          customerLabel: '',
          collaboratorLabel: '',
          business: 'esc',
          description: '',
          isVisible: true,
        },
        {
          labelId: 2,
          code: '',
          customerLabel: '',
          collaboratorLabel: '',
          business: 'esc',
          description: '',
          isVisible: true,
        },
      ]
      expect(getOverflowIndicatorColor(roles)).toBe(ROLE_BUSINESS_COLORS.esc)
    })

    it('returns DEFAULT_MIXED_ROLE_COLOR if roles have different businesses', () => {
      const roles: RoleLabel[] = [
        {
          labelId: 1,
          code: '',
          customerLabel: '',
          collaboratorLabel: '',
          business: 'esc',
          description: '',
          isVisible: true,
        },
        {
          labelId: 2,
          code: '',
          customerLabel: '',
          collaboratorLabel: '',
          business: 'transverse',
          description: '',
          isVisible: true,
        },
      ]
      expect(getOverflowIndicatorColor(roles)).toBe(DEFAULT_MIXED_ROLE_COLOR)
    })
  })
})
