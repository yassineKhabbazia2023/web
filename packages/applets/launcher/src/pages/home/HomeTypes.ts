import type { LaunchCardProps } from '@/components/launchCard/LaunchCardTypes'

/* eslint-disable no-unused-vars */
export enum LAUNCHER_KEY {
  meg,
  silae,
  pennylane,
}
/* eslint-enable no-unused-vars */

export interface ExtendedLaunchCard extends LaunchCardProps {
  key: LAUNCHER_KEY
}
