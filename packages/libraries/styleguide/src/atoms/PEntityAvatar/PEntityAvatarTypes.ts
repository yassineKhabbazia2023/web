import type { PAvatarProps } from '../PAvatar/PAvatarTypes'

export interface PEntityAvatarProps {
  // Optional: when unknown, the component falls back to REGULAR (CLIENT) behavior.
  pAccountType?: 'PROSPECT' | 'CLIENT'
  // Ignored for PROSPECT (role-based color wins).
  pColor?: PAvatarProps['pColor']
  pType?: PAvatarProps['pType']
  pShape?: PAvatarProps['pShape']
  pSelected?: boolean
}
