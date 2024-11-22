import type { PImageProps } from '@pulse/styleguide/types'

export type LaunchCardProps = {
  title: string
  subtitle: string
  imageType: string
  imageName: PImageProps['pName']
  actionLabel: string
  actionUrl: string
  downloadLabel: string
}
