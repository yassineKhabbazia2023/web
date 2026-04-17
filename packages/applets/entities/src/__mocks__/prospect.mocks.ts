import { AccountType } from '@pulse/common/enums'
import type { ProspectAccountRow, ProspectWalletData } from '@entities/modules/wallet/types'
import { ProspectOnboardingStep } from '@entities/modules/wallet/enums'

export function getMockedProspectAccountRow(override: Partial<ProspectAccountRow> = {}): ProspectAccountRow {
  return {
    prospectId: 1,
    accountId: 1971,
    accountNumber: 'P595350001',
    accountType: AccountType.PROSPECT,
    legalName: 'Prospect 0001',
    signatory: {
      contactId: 980001,
      globalContactId: 'a24781f3-bdd7-4ab0-9696-c1f2dd19bfb5',
      firstName: 'Seed',
      lastName: 'Signatory',
      email: 'seed@test.local',
      status: 'Declared',
      personaName: 'Client',
      creationDate: '2026-03-19T13:36:26.1766667',
    },
    stepCode: ProspectOnboardingStep.LEADER_INFO,
    dossierCAC: true,
    ...override,
  }
}

export function getMockedProspectWalletData(override: Partial<ProspectWalletData> = {}): ProspectWalletData {
  return {
    owner: {
      contactId: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      initials: 'JD',
      avatarColor: 'orange',
    },
    prospectId: 10,
    accountId: 100,
    accountNumber: 'ACC-100',
    name: 'Test Prospect',
    isFavorite: false,
    onboardingStep: null,
    cacFolder: false,
    ...override,
  }
}
