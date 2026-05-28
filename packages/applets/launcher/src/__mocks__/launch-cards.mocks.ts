import { envVarsMock } from '@pulse/common/mocks'

export const launchCardsMock = [
  {
    'actionLabel': "Se connecter à l'outil de gestion",
    'actionUrl': envVarsMock.VITE_GESTION_MEG,
    'downloadLabel': '',
    'imageName': 'brand-color',
    'imageType': 'logos',
    'key': 'MEG',
    'subtitle': 'Accéder à votre outil de gestion afin de piloter votre entreprise',
    'title': 'Mon outil de gestion',
  },
  {
    'actionLabel': 'Se connecter à Silae',
    'actionUrl': '',
    'downloadLabel': 'Télécharger',
    'imageName': 'silae-color',
    'imageType': 'logos',
    'key': 'SILAE',
    'subtitle': 'Accéder à votre outil de gestion de planning et du personnel - À installer',
    'title': 'Silae',
  },
  {
    'actionLabel': 'Se connecter à Pennylane',
    'actionUrl': envVarsMock.VITE_PENNYLANE_SSO_URL,
    'downloadLabel': '',
    'imageName': 'pennylane-color',
    'imageType': 'logos',
    'key': 'PENNYLANE',
    'subtitle': 'Accéder à votre outil Pennylane pour votre gestion au quotidien',
    'title': 'Pennylane',
  },
]


export const collabLaunchCardsMock = [
  {
    'actionLabel': 'Se connecter à Pennylane',
    'actionUrl': envVarsMock.VITE_PENNYLANE_COLLAB_SSO_URL,
    'downloadLabel': '',
    'imageName': 'pennylane-color',
    'imageType': 'logos',
    'key': 'PENNYLANE',
    'subtitle': 'Accéder à votre outil Pennylane pour votre gestion au quotidien',
    'title': 'Pennylane',
  },
]
