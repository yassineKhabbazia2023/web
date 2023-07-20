import { defineAsyncComponent } from 'vue'

export const iconResolver = (iterable: Array<any>, iconPropertyName: string) => {
  return iterable.map((element) =>
    defineAsyncComponent(
      () =>
        import(`@/atoms/PIcon/components/${element[iconPropertyName]}.vue`)
    )
  )
}
