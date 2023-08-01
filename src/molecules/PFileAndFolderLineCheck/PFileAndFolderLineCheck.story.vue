<template>
  <Story
    title="3. Molecules/File and Folder Line Check"
    icon="radix-icons:id-card"
  >
    <Variant title="Custum tooltip">
      <PFileAndFolderLineCheck
        v-model="firstVarientCheckboxVModel"
        :fileName="PFileAndFolderLineCheckBasicData[0].fileName"
        :state="PFileAndFolderLineCheckBasicData[0].state"
      >
      </PFileAndFolderLineCheck>
    </Variant>

    <Variant title="Success tooltip">
      <PFileAndFolderLineCheck
        v-model="secondVarientCheckboxVModel"
        :fileName="PFileAndFolderLineCheckBasicData[1].fileName"
        :additionalText="PFileAndFolderLineCheckBasicData[1].additionalText"
        :state="PFileAndFolderLineCheckBasicData[1].state"
      >
      </PFileAndFolderLineCheck>
    </Variant>

    <Variant title="Error tooltip">
      <PFileAndFolderLineCheck
        v-model="thirdVarientCheckboxVModel"
        :fileName="PFileAndFolderLineCheckBasicData[2].fileName"
        :additionalText="PFileAndFolderLineCheckBasicData[2].additionalText"
        :state="PFileAndFolderLineCheckBasicData[2].state"
      >
      </PFileAndFolderLineCheck>
    </Variant>

    <Variant title="Loading tooltip">
      <PFileAndFolderLineCheck
        v-model="fourthVarientCheckboxVModel"
        :fileName="PFileAndFolderLineCheckBasicData[3].fileName"
        :state="PFileAndFolderLineCheckBasicData[3].state"
      >
      </PFileAndFolderLineCheck>
    </Variant>
  </Story>
</template>

<docs lang="md">
## PFileAndFolderLineCheck

<div class="responsive-iframe-container">
<iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D1350%253A6887%26mode%3Ddev" allowfullscreen></iframe>
</div>
</docs>

<script setup lang="ts">
import { ref } from 'vue'
import PFileAndFolderLineCheck from './'

type stateOptions = 'default' | 'success' | 'error' | 'loading' | undefined

const firstVarientCheckboxVModel = ref(false)
const secondVarientCheckboxVModel = ref(false)
const thirdVarientCheckboxVModel = ref(false)
const fourthVarientCheckboxVModel = ref(false)
const PFileAndFolderLineCheckBasicData = ref([
  {
    fileName: 'A PDF File.pdf',
    state: 'default' as stateOptions
  },
  {
    fileName: 'A success state.pdf',
    state: 'success' as stateOptions,
    additionalText: 'Comptabilité > Dépôt > Achats'
  },
  {
    fileName: 'An error state.pdf',
    state: 'error' as stateOptions,
    additionalText: 'Unallowed file extension'
  },
  {
    fileName: 'Another type of file.txt',
    disabled: 'false',
    state: 'loading' as stateOptions
  }
])
</script>
