<template>
  <Story
    title="1. Basic/Container"
    icon="ph:layout-thin"
    :layout="{
      type: 'single'
    }"
  >
    <Variant title="Basic Usage">
      <PContainer pDirection="vertical">
        <PCHeader :pHeight="headerHeight">
          Header
        </PCHeader>
        <PContainer>
          <PAside :pWidth="asideWidth">
            Aside
          </PAside>
          <PContainer>
            <PMain>Main</PMain>
          </PContainer>
        </PContainer>
        <PFooter :pHeight="footerHeight">
          Footer
        </PFooter>
      </PContainer>
      <template #controls>
        <HstText v-model="headerHeight" title="HeaderHeight" />
        <HstText v-model="footerHeight" title="FooterHeight" />
        <HstText v-model="asideWidth" title="AsideWidth" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PAside from '../../atoms/PAside'
import PContainer from '../../molecules/PContainer'
import PCHeader from '../../atoms/PCHeader'
import PFooter from '../../atoms/PFooter'
import PMain from '../../atoms/PMain'

const headerHeight = ref('52px')
const footerHeight = ref('6rem')
const asideWidth = ref('20%')
</script>

<style scoped>
  .el-header {
    background-color: #c6e2ff;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-footer {
    background-color: #c6e2ff;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #d9ecff;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #ecf5ff;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
</style>

<docs lang="md">
## Container Attributes

| Name      | Description                         | Type   | Accepted Values       | Default                                                                    |
| --------- | ----------------------------------- | ------ | --------------------- | -------------------------------------------------------------------------- |
| direction | layout direction for child elements | string | horizontal / vertical | vertical when nested with `el-header` or `el-footer`; horizontal otherwise |

## Container Slots

| Name | Description               | Subtags                                    |
| ---- | ------------------------- | ------------------------------------------ |
| —    | customize default content | Container / Header / Aside / Main / Footer |

## Header Attributes

| Name   | Description          | Type   | Accepted Values | Default |
| ------ | -------------------- | ------ | --------------- | ------- |
| height | height of the header | string | —               | 60px    |

## Header Slots

| Name | Description               |
| ---- | ------------------------- |
| —    | customize default content |

## Aside Attributes

| Name  | Description               | Type   | Accepted Values | Default |
| ----- | ------------------------- | ------ | --------------- | ------- |
| width | width of the side section | string | —               | 300px   |

## Aside Slots

| Name | Description               |
| ---- | ------------------------- |
| —    | customize default content |

## Main Slots

| Name | Description               |
| ---- | ------------------------- |
| —    | customize default content |

## Footer Attributes

| Name   | Description          | Type   | Accepted Values | Default |
| ------ | -------------------- | ------ | --------------- | ------- |
| height | height of the footer | string | —               | 60px    |

## Footer Slots

| Name | Description               |
| ---- | ------------------------- |
| —    | customize default content |

<div class="reponsive-iframe-container">
  <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FCmAQkyvJgicN6PHwf61DBZ%2F%25F0%259F%25A6%2584-Guidelines%3Ftype%3Ddesign%26node-id%3D87%253A2427%26mode%3Ddev" allowfullscreen></iframe>
</div>
</docs>
