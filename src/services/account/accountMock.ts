import type { Account } from '.'

export function getMockedAccount(): Account {
  return {
    accountId: 5,
    accountNumber: '1999162161',
    iconName: 'mon icone',
    isActive: true,
    accountNumberSource: '1999162161',
    employeeCount: 8,
    commercialName: 'SCI Licorn',
    accounting: {
      accountingType: 'Client',
      activityType: 'Prestation de services',
      fiscalExerciseStartDate: '2024-02-07T15:49:54',
      fiscalExerciseDuration: 12,
      fiscalSystem: 'Système fiscal',
      taxationSystem: 'Système de taxation'
    },
    legal: {
      legalName: 'SCI Licorn',
      siret: '443 061 841 00047',
      legalFormCode: 'B12',
      staffSizeRange: 'De 4 à 15 salariés',
      naf: [
        {
          nafId: 1,
          nafCode: '1',
          nafLabel: '1'
        }
      ]
    },
    vat: {
      system: 'Réel normal - CA3 mensuelle',
      intra: 'Non modifiable',
      type: 'Encaissement'
    },
    address: [
      {
        addressId: 2,
        addressLine1: 'Rue de liege',
        addressLine2: 'test 2',
        addressLine3: 'test 3',
        country: 'France',
        city: 'Paris'
      }
    ],
    phone: [],
    hub: {
      hubId: 14,
      hubName: 'Hub Centre'
    },
    deploymentPlanning: [
      {
        deploymentId: 1,
        deploymentDate: '2024-02-07T00:00:00',
        status: 1
      }
    ]
  }
}
