const baseUserInformation = {
  id: '1234',
  firstName: 'John',
  lastName: 'Doe',
  occupation: 'idk',
  email: 'john@doe.fr',
  entities: {},
}
export const collabUser = {
  ...baseUserInformation,
  isCollab: true,
}

export const customerUser = {
  ...baseUserInformation,
  isCollab: false,
}
