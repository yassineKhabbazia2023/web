<template>
  <Story title="3. Molecules/Breadcrumb" icon="mingcute:bread-line">
    <Variant title="Breadcrumb">
      <PBreadcrumb :pElements="generateBreadCrumbItems(5)" />
    </Variant>
    <Variant title="ellipsed breadcrumb">
      <PBreadcrumb :pElements="generateBreadCrumbItems(8)" />
    </Variant>
    <Variant title="breadcrumb size small">
      <PBreadcrumb :pElements="generateBreadCrumbItems(8)" pSize="S" />
    </Variant>
    <Variant title="breadcrumb size medium">
      <PBreadcrumb :pElements="generateBreadCrumbItems(8)" pSize="M" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PBreadcrumb from '../../molecules/PBreadcrumb'
import type { BreadcrumbItems } from './PBreadcrumbTypes'

const generateBreadCrumbItems = (numberOfItems: number) => {
  const breadcrumbItems = [] as BreadcrumbItems[]
  for (let i = 0; i < numberOfItems; i++) {
    breadcrumbItems.push({ pId: i.toString(), pText: `Lorem ${i}` } as never)
  }
  return breadcrumbItems
}
</script>

<docs lang="md">
## PBreadscrumb
# Component Types

| Type            | Properties                 |
| --------------- | -------------------------- |
| BreadcrumbItems | `{ pId: number, pText: string }` |

## Component Props

| Prop     | Type                     | Values |
| -------  | ------------------------ | ------ |
| pElement | `Array<BreadcrumbItems>` |        |
| pSize    | string                   | S, M   |

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe"  src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D1537%253A6527%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
