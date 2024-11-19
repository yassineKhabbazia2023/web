import { VITE_GESTION_MEG, VITE_PENNYLANE_SSO_URL } from 'env-vars'
import { getSsoSilaeUrl, downloadApplication, saveApplication } from '@launcher/services/launcherServices'
import { type ExtendedLaunchCard, LauncherKey } from './HomeTypes'

export function getLaunchCards(downloadSilaeLabel: string, authorizedKeys: LauncherKey[]): ExtendedLaunchCard[] {
  const launchCards: ExtendedLaunchCard[] = [
    {
      key: LauncherKey.MEG,
      title: 'Mon outil de gestion',
      subtitle: 'Accéder à votre outil de gestion afin de piloter votre entreprise',
      imageType: 'logos',
      imageName: 'iconpulse-color',
      actionLabel: 'Se connecter à l\'outil de gestion',
      actionUrl: VITE_GESTION_MEG,
      downloadLabel: '',
    },
    {
      key: LauncherKey.SILAE,
      title: 'Silae',
      subtitle: 'Accéder à votre outil de gestion de planning et du personnel - À installer',
      imageType: 'logos',
      imageName: 'silae-color',
      actionLabel: 'Se connecter à Silae',
      actionUrl: '',
      downloadLabel: downloadSilaeLabel,
    },
    {
      key: LauncherKey.PENNYLANE,
      title: 'Pennylane',
      subtitle: 'Accéder à votre outil Pennylane pour votre gestion au quotidien',
      imageType: 'logos',
      imageName: 'pennylane-color',
      actionLabel: 'Se connecter à Pennylane',
      actionUrl: VITE_PENNYLANE_SSO_URL,
      downloadLabel: '',
    },
  ]

  return launchCards.filter(({ key }) => authorizedKeys.includes(key))
}

export function getSilaeDownloadLabel(silaeDownloadPercent: number | undefined = undefined) {
  if (silaeDownloadPercent === undefined) {
    return 'Télécharger'
  }

  return silaeDownloadPercent === 100
    ? 'Téléchargement terminé'
    : `Téléchargement (${silaeDownloadPercent} %)`
}

export async function openSilaeUrl() {
  const redirectUrl = await getSsoSilaeUrl()
  if (redirectUrl) {
    window.location.href = `mypulse-launch://${redirectUrl}`
  } else {
    throw new Error('ssoSilaeUrl is empty')
  }
}

export async function handleClickAction(key: LauncherKey) {
  try {
    if (key === LauncherKey.SILAE) {
      await openSilaeUrl()
    }
  } catch (error) {
    console.error(error)
  }
}

export async function handleDownload(
  key: LauncherKey,
  onSilaeDownloadProgress: (_: number) => void,
) {
  try {
    if (key === LauncherKey.SILAE) {
      const response = await downloadApplication(onSilaeDownloadProgress)
      saveApplication(response)
    }
  } catch (error) {
    console.error(error)
  }
}
