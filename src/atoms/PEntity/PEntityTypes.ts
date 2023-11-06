import type { Component } from 'vue'

export interface PEntityProps {
  pContent: string
  pIcon?: Component | string
  pType: 'primary' | 'secondary'
  pIconShape?: string
  pIconColor?: string
  pIconType?: string
  pBold?: boolean
  pSelected: boolean
}
