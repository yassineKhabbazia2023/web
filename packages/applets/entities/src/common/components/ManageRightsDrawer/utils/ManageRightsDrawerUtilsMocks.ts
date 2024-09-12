import type { AuthorizationState } from '../ManageRightsTypes'

export const getMockedAuthorizationState = (): Record<
  string,
  AuthorizationState
> => {
  return {
    CLTGESTION: {
      actions: ['CLUSER001', 'CLUSER002', 'CLUSER003'],
      isActive: true,
    },
    'CLTGED GS': {
      actions: ['CLGED0001'],
      isActive: true,
    },
    'CLTGED ESC': {
      actions: ['CLGED0002'],
      isActive: true,
    },
  }
}
