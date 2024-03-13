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
      accountingType: 'Engagement',
      activityType: 'Prestation de services',
      fiscalExerciseStartDate: '2024-02-07T15:49:54',
      fiscalExerciseDuration: 12,
      fiscalSystem: 'BIC',
      taxationSystem: 'Impôt sur le revenu'
    },
    legal: {
      legalName: 'SCI Licorn',
      siret: '443 061 841 00047',
      createdAt: '2022-01-22T12:00:00',
      legalFormCode: 'EURL',
      staffSizeRange: 'De 4 à 15 salariés',
      naf: [
        {
          nafId: 1,
          nafCode: '96.0F4',
          nafLabel: '96.0F4'
        }
      ]
    },
    vat: {
      system: 'Réel normal - CA3 mensuelle',
      intra: 'FR 32 123456789',
      type: 'Encaissement'
    },
    address: [
      {
        addressId: 2,
        addressLine1: 'Rue de liege',
        addressLine2: 'test 2',
        addressLine3: 'test 3',
        country: 'France',
        city: 'Paris',
        zipCode: '25300'
      }
    ],
    phone: [
      {
        phoneId: 5,
        phoneNumber: '0622827143'
      }
    ],
    email: 'contact@johnnyspizza.com',
    hub: {
      hubId: 14,
      hubName: 'Hub Normandie Seine Baie de Somme'
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
