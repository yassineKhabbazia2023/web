<template>
  <Story title="2. Atoms/Pagination" :layout="{ type: 'single', iframe: true }">
    <Variant title="Sample">
      <PPagination
        v-model:pCurrentPage="currentPage"
        v-model:pPageSize="pageSize"
        :pPageSizes="pageSizes"
        pPageSizeSelectorGroupLabel="Some text"
        pPageSizeSelectorSuffix="documents"
        pShowTotalPageCounter
        :pTotal="1000"
      >
        <p>1-25 sur 157</p>
      </PPagination>
    </Variant>
  </Story>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import PPagination from './'

const currentPage = ref(1)
const pageSizes = ref([100, 200, 300, 400])
const pageSize = ref(pageSizes.value[0])
</script>

<docs lang="md">
## element plus component link

https://element-plus.org/en-US/component/pagination.html

## custom component props

| Prop                         | Type                    | Example                            |
| ---------------------------- | ----------------------- | ---------------------------------- |
| `showTotalPageCounter`       | `boolean`               | `true`                             |
| `pageSizes`                  | `Array<number>`         | `[1, 2, 3]`                        |
| `pageSizeSelectorGroupLabel` | `string`                | `"Select Page Range:"`            |
| `pageSizeSelectorSuffix`     | `string`                | `"th"`                             |

<div class="responsive-figma-container">
  <iframe class="responsive-figma" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D3408%253A15785%26mode%3Ddev" allowfullscreen></iframe>
</div>
</docs>
