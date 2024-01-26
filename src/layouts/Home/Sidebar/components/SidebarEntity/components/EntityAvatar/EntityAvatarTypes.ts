import type { PAvatarProps } from '@kpmg/styleguide'

export interface Entity {
    name: string
    ibs: string,
    color: PAvatarProps['pColor']
}

export type EntityAvatarProps = {
    entity: Entity
    hideTooltip: boolean,
    selected?: boolean
}
