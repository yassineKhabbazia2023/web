<template>
  <Story
    title="3. Molecules/File and Folder Line Check"
    icon="radix-icons:id-card"
  >
    <Variant title="Default line check">
      <PFileAndFolderLineCheck
        v-model="firstVariantCheckboxVModel"
        :pFileName="PFileAndFolderLineCheckBasicData[0].pFileName"
        :pState="PFileAndFolderLineCheckBasicData[0].pState"
      >
      </PFileAndFolderLineCheck>
    </Variant>

    <Variant title="Success line check">
      <PFileAndFolderLineCheck
        v-model="secondVariantCheckboxVModel"
        :pFileName="PFileAndFolderLineCheckBasicData[1].pFileName"
        :pAdditionalText="PFileAndFolderLineCheckBasicData[1].pAdditionalText"
        :pState="PFileAndFolderLineCheckBasicData[1].pState"
      >
      </PFileAndFolderLineCheck>
    </Variant>

    <Variant title="Error line check">
      <PFileAndFolderLineCheck
        v-model="thirdVariantCheckboxVModel"
        :pFileName="PFileAndFolderLineCheckBasicData[2].pFileName"
        :pAdditionalText="PFileAndFolderLineCheckBasicData[2].pAdditionalText"
        :pState="PFileAndFolderLineCheckBasicData[2].pState"
      >
      </PFileAndFolderLineCheck>
    </Variant>

    <Variant title="Loading line check">
      <PFileAndFolderLineCheck
        v-model="fourthVariantCheckboxVModel"
        :pFileName="PFileAndFolderLineCheckBasicData[3].pFileName"
        :pState="PFileAndFolderLineCheckBasicData[3].pState"
      >
      </PFileAndFolderLineCheck>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PFileAndFolderLineCheck from './'
import type { PFileAndFolderLineCheckProps } from './PFileAndFolderLineCheckTypes'

type pStateOptions = PFileAndFolderLineCheckProps['pState']

const firstVariantCheckboxVModel = ref(false)
const secondVariantCheckboxVModel = ref(false)
const thirdVariantCheckboxVModel = ref(false)
const fourthVariantCheckboxVModel = ref(false)
const PFileAndFolderLineCheckBasicData = ref([
  {
    pFileName: 'A PDF File.pdf',
    pState: 'default' as pStateOptions,
  },
  {
    pFileName: 'A success state.pdf',
    pState: 'success' as pStateOptions,
    pAdditionalText: 'Accountancy > Deposit > Purchases',
  },
  {
    pFileName: 'An error state.pdf',
    pState: 'error' as pStateOptions,
    pAdditionalText: 'Unallowed file extension',
  },
  {
    pFileName: 'Another type of file.txt',
    disabled: 'false',
    pState: 'loading' as pStateOptions,
  },
])
</script>

<docs lang="md">
  ## PFileAndFolderLineCheck

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D1350%253A6887%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
