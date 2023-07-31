import { defineAsyncComponent } from 'vue'

export const iconsResolver = (
  iterable: Array<any>,
  iconPropertyName: string
) => {
  return iterable.map((element) => iconResolver(element[iconPropertyName]))
}

export const iconResolver = (iconName: string) =>
  defineAsyncComponent(
    () => import(`../atoms/PIcon/components/${iconName}.vue`)
  )
