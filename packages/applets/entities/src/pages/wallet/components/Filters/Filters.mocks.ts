import { EntitiesStatistics } from '@entities/services/wallet/serviceWalletTypes'

export function getMockedEntitiesStatistics(): EntitiesStatistics {
  return {
    accountToDeploy: 3,
    accountInProgress: 0,
    accountConnected: 0,
    contactDeclared: 6,
    contactInvited: 0,
    contactConnected: 0,
    accountRevoked: 0,
  }
}

export function getMockedFilterLabels(): Record<string, string> {
  return {
    toDeploy: 'toDeploy',
    inProgress: 'inProgress',
    connected: 'connected',
    declared: 'declared',
    guests: 'guests',
  }
}
