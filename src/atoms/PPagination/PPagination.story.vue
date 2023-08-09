<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <Story title="2. Atoms/Pagination" :layout="{ type: 'single', iframe: true }">
    <Variant title="Sample">
      <PPagination
        :total="1000"
        :pages-ranges="pagesRanges"
        page-range-selector-suffix="documents"
        page-range-selector-group-label="Some text"
        v-model:current-page="currentPage"
        show-total-page-counter
        background
        ><p>1-25 sur 157</p>
      </PPagination>
    </Variant>
  </Story>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import PPagination from './'

const currentPage = ref(1)
const pagesRanges = ref([100, 200, 300, 400])
</script>

<docs lang="md">
## element plus component link

https://element-plus.org/en-US/component/pagination.html

## custom component props

| Prop                         | Type                    | Example                            |
| ---------------------------- | ----------------------- | ---------------------------------- |
| `showTotalPageCounter`       | `boolean`               | `true`                             |
| `pagesRanges`                | `Array<number>`         | `[1, 2, 3]`                        |
| `pageRangeSelectorGroupLabel`| `string`                | `"Select Page Range:"`            |
| `pageRangeSelectorSuffix`    | `string`                | `"th"`                             |

<div class="responsive-figma-container">
  <iframe class="responsive-figma" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D3408%253A15785%26mode%3Ddev" allowfullscreen></iframe>
</div>
</docs>
