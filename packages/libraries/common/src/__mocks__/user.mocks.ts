export const getMockedUser = () => {
  return {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    persona: {
      name: 'Collaborator GS',
    },
    officeMobile: '11223344',
    isCustomer: false,
  }
}

export const getMockedUserPermissions = (): string[] => [
  'COADMI001',
  'COBank001',
  'COCAL001',
  'COEMB001',
  'COEVPO01',
  'COGED0001',
  'COGED0002',
]
