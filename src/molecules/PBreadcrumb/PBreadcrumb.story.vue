<template>
  <Story title="3. Molecules/Breadcrumb" icon="mingcute:bread-line">
    <Variant title="Breadcrumb">
      <PBreadcrumb :elements="generateBreadCrumbItems(5)" />
    </Variant>
    <Variant title="ellipsed breadcrumb ">
      <PBreadcrumb :elements="generateBreadCrumbItems(8)" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PBreadcrumb from '@/molecules/PBreadcrumb'
import { type BreadcrumbItems } from './PBreadcrumbTypes'

const generateBreadCrumbItems = (numberOfItems: number) => {
  const breadcrumbItems = [] as BreadcrumbItems[]
  for (let i = 0; i < numberOfItems; i++) {
    breadcrumbItems.push({ id: i.toString(), text: `Lorem ${i}` } as never)
  }
  return breadcrumbItems
}
</script>

<docs lang="md">
## PBreadscrumb

This component is used for breadcrumbs.

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D1537%253A6527%26mode%3Ddev" allowfullscreen></iframe>" allowfullscreen></iframe>
  </div>
</docs>
