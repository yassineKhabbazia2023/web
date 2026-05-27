import { PAvatarProps } from '../atoms/PAvatar/PAvatarTypes'

export const AVATAR_COLORS: PAvatarProps['pColor'][] = [
  'amethyste', 'persian-light', 'persian-400',
]

const hashString = (str: string): number => {
  let hash = 0
  if (str && str.length > 0) {
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + (str.codePointAt(i) ?? 0)
      hash = hash & hash
    }
  }
  return Math.abs(hash)
}

export const getAvatarColorFromKey = (key: string = ''): PAvatarProps['pColor'] => {
  if (!key) {
    return AVATAR_COLORS[0]
  }

  const index = hashString(key) % AVATAR_COLORS.length
  return AVATAR_COLORS[index]
}
