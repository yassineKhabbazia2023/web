import type { UserInfo , Persona } from '@pulse/common/types'
import type { Contact } from '@entities/services/contact/contactTypes'

export const getMockedUser = (): UserInfo => {
  const user: UserInfo = {
    id: 123,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    occupation: 'Consultant Advisory',
    isCollab: true,
    gigyaUserId: 'test',
    officeMobile: 'johnd-mobile-phone',
    oldId: 'johnd-guid',
    entities: {
      favorites: [],
      default: undefined,
    },
  }

  return user
}

export const mockUser: Contact = {
  id: 521,
  firstName: 'jojo',
  lastName: 'jojo',
  email: 'email330@example.com',
  landPhone: '123-456-7890',
  mobilePhone: '987-654-3210',
  type: 'Customer',
  office: 'Chalon sur Saône',
  persona: {
    id: 21,
    name: 'MOD Forms',
    description: '',
  } as Persona,
}

export const mockedUsersClient = {
  'data': {
    'items': [
      {
        'contactId': 1,
        'firstName': 'Goldie',
        'lastName': 'Travis',
        'email': 'goldietravis@ecolight.com',
        'personaName': 'Dirigeant',
        'creationDate': '2024-03-07',
      },
      {
        'contactId': 2,
        'firstName': 'Tucker',
        'lastName': 'Hull',
        'email': 'tuckerhull@ecolight.com',
        'personaName': 'Comptable',
        'creationDate': '2024-03-07',
      },
      {
        'contactId': 3,
        'firstName': 'Pollard',
        'lastName': 'Stevens',
        'email': 'pollardstevens@ecolight.com',
        'personaName': 'Comptable',
        'creationDate': '2024-03-07',
      },
      {
        'contactId': 4,
        'firstName': 'Teresa',
        'lastName': 'Gilmore',
        'email': 'teresagilmore@ecolight.com',
        'personaName': 'Comptable',
        'creationDate': '2024-03-07',
      },
      {
        'contactId': 5,
        'firstName': 'Hicks',
        'lastName': 'Carr',
        'email': 'hickscarr@ecolight.com',
        'personaName': 'Paie et RH',
        'creationDate': '2024-03-07',
      },
      {
        'contactId': 6,
        'firstName': 'Lourdes',
        'lastName': 'Mcmillan',
        'email': 'lourdesmcmillan@ecolight.com',
        'personaName': 'Comptable',
        'creationDate': '2024-03-07',
      },
      {
        'contactId': 7,
        'firstName': 'Blanca',
        'lastName': 'Flynn',
        'email': 'blancaflynn@ecolight.com',
        'personaName': 'Comptable',
        'creationDate': '2024-03-07',
      },
      {
        'contactId': 8,
        'firstName': 'Ball',
        'lastName': 'Hopkins',
        'email': 'ballhopkins@ecolight.com',
        'personaName': 'Comptable',
        'creationDate': '2024-03-07',
      },
      {
        'contactId': 9,
        'firstName': 'Carrillo',
        'lastName': 'Garrett',
        'email': 'carrillogarrett@ecolight.com',
        'personaName': 'Comptable',
        'creationDate': '2024-03-07',
      },
      {
        'contactId': 10,
        'firstName': 'Isabel',
        'lastName': 'Merritt',
        'email': 'isabelmerritt@ecolight.com',
        'personaName': 'Paie et RH',
        'creationDate': '2024-03-07',
      },
      {
        'contactId': 11,
        'firstName': 'Olson',
        'lastName': 'Tyler',
        'email': 'olsontyler@ecolight.com',
        'personaName': 'Paie et RH',
        'creationDate': '2024-03-07',
      },
      {
        'contactId': 12,
        'firstName': 'Brcontactidges',
        'lastName': 'Hinton',
        'email': 'brcontactidgeshinton@ecolight.com',
        'personaName': 'Comptable',
        'creationDate': '2024-03-07',
      },
      {
        'contactId': 13,
        'firstName': 'Decker',
        'lastName': 'Estes',
        'email': 'deckerestes@ecolight.com',
        'personaName': 'Comptable',
        'creationDate': '2024-03-07',
      },
      {
        'contactId': 14,
        'firstName': 'Campbell',
        'lastName': 'Cooley',
        'email': 'campbellcooley@ecolight.com',
        'personaName': 'Comptable',
        'creationDate': '2024-03-07',
      },
      {
        'contactId': 15,
        'firstName': 'Gould',
        'lastName': 'Hood',
        'email': 'gouldhood@ecolight.com',
        'personaName': 'Comptable',
        'creationDate': '2024-03-07',
      },
    ],
    'currentPage': 1,
    'totalPages': 2,
    'totalItems': 16,
  },
}
