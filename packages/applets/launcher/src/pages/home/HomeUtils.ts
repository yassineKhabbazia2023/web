import { type ExtendedLaunchCard, LAUNCHER_KEY } from './HomeTypes'
import {
  VITE_GESTION_MEG,
  VITE_PENNYLANE_SSO_URL,
} from 'env-vars'
import { getSsoSilaeUrl, downloadApplication, saveApplication } from '@launcher/services/launcherServices'
import { LAUNCHER_AUTHORIZATIONS } from '@launcher/common/authorizationConst'
import { userPermissions } from '@pulse/Common'

const { hasPermission } = userPermissions()

export function getLaunchCards(downloadSilaeLabel: string, authorizedKeys: LAUNCHER_KEY[]): ExtendedLaunchCard[] {
  const launchCards = [{
    key: LAUNCHER_KEY.meg,
    title: 'Mon outil de gestion',
    subtitle: 'Accéder à votre outil de gestion afin de piloter votre entreprise',
    imageType: 'logos',
    imageName: 'iconpulse-color',
    actionLabel: "Se connecter à l'outil de gestion",
    actionUrl: VITE_GESTION_MEG,
    downloadLabel: '',
  }, {
    key: LAUNCHER_KEY.silae,
    title: 'Silae',
    subtitle: 'Accéder à votre outil de gestion de planning et du personnel - À installer',
    imageType: 'logos',
    imageName: 'silae-color',
    actionLabel: 'Se connecter à Silae',
    actionUrl: '',
    downloadLabel: downloadSilaeLabel,
  }, {
    key: LAUNCHER_KEY.pennylane,
    title: 'Pennylane',
    subtitle: 'Accéder à votre outil Pennylane pour votre gestion au quotidien',
    imageType: 'logos',
    imageName: 'pennylane-color',
    actionLabel: 'Se connecter à Pennylane',
    actionUrl: VITE_PENNYLANE_SSO_URL,
    downloadLabel: '',
  }]

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

export async function handleClickAction(key: LAUNCHER_KEY) {
  try {
    if (key === LAUNCHER_KEY.silae) {
      await openSilaeUrl()
    }
  } catch (error) {
    console.error(error)
  }
}

export async function handleDownload(
  key: LAUNCHER_KEY,
  onSilaeDownloadProgress: (_: number) => void,
) {
  try {
    if (key === LAUNCHER_KEY.silae) {
      const response = await downloadApplication(onSilaeDownloadProgress)
      saveApplication(response)
    }
  } catch (error) {
    console.error(error)
  }
}

export function getAuthorizedKeys() {
  return LAUNCHER_AUTHORIZATIONS
    .filter(({ authorizationCodes }) => hasPermission(authorizationCodes))
    .map<LAUNCHER_KEY>(({ key }) => key)
}
