import type { PImageProps } from '@pulse/styleguide/types'

export enum LauncherTitle {
  MEG = 'MEG',
  SILAE = 'Silae',
  PENNYLANE = 'Pennylane'
}

export enum LauncherFeature {
  SSO_MEG = 'SSO MEG',
  SSO_SILAE = 'SSO Silae',
  SSO_PENNYLANE = 'SSO Pennylane',
  SILAE_DOWNLOAD = 'Download Silae',
}

export type LaunchCardProps = {
  title: string
  subtitle: string
  imageType: string
  imageName: PImageProps['pName']
  actionLabel: string
  actionUrl: string
  downloadLabel: string
}
