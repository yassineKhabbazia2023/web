import { defineAsyncComponent, type Component } from 'vue'
import { PIXCircle } from '../atoms/PIcon/components'

export const iconResolver = (icon: string | Component, errorComponent: Component = PIXCircle) =>
  defineAsyncComponent({
    loader: () => import(
      `../atoms/PIcon/components/${
        typeof icon === 'string' ? icon : icon?.name
      }.vue`
    ),
    errorComponent,
  })
