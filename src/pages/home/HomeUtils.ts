import type { LaunchCardProps } from '@/components/launchCard/LaunchCardTypes'

export function getLaunchCards(): LaunchCardProps[] {
  return [{
    title: 'Mon outil de gestion',
    subtitle: 'Accéder à votre outil de gestion afin de piloter votre entreprise',
    imageType: 'logos',
    imageName: 'iconpulse-color',
    actionLabel: "Se connecter à l'outil de gestion",
    actionUrl: '',
    downloadLabel: '',
  }, {
    title: 'Silae',
    subtitle: 'Accéder à votre outil de gestion de planning et du personnel - À installer',
    imageType: 'logos',
    imageName: 'silae-color',
    actionLabel: 'Se connecter à Silae',
    actionUrl: '',
    downloadLabel: 'Télécharger',
  }, {
    title: 'Pennylane',
    subtitle: 'Accéder à votre outil Pennylane pour votre gestion au quotidien',
    imageType: 'logos',
    imageName: 'pennylane-color',
    actionLabel: 'Se connecter à Pennylane',
    actionUrl: '',
    downloadLabel: '',
  }]
}
