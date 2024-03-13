import { defineAsyncComponent, type Component } from 'vue'

export const iconsResolver = (
  iterable: Array<any>,
  iconPropertyName: string,
) => {
  return iterable.map((element) => iconResolver(element[iconPropertyName]))
}

export const iconResolver = (icon: string | Component) =>
  defineAsyncComponent(
    () =>
      import(
        `../atoms/PIcon/components/${
          typeof icon === 'string' ? icon : icon?.name
        }.vue`
      ),
  )
