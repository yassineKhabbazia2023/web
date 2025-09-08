import type { LaunchCardProps } from '@launcher/components/launchCard/LaunchCardTypes'

export enum LauncherKey {
  MEG = 'MEG',
  SILAE = 'SILAE',
  PENNYLANE = 'PENNYLANE',
}
export interface ExtendedLaunchCard extends LaunchCardProps {
  key: LauncherKey
}
