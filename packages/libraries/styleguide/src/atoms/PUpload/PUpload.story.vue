<template>
  <Story
    title="2. Atoms/Upload"
    icon="fluent:button-16-regular"
    :layout="{ type: 'grid', width: '300px' }"
  >
    <Variant title="PUpload">
      <PUpload
        pMultiple
        :pDisabled="false"
        :pDrag="false"
      >
        <PButton
          type="primary"
          size="small"
          :plain="false"
          :round="false"
          :disabled="false"
          :loading="false"
          :circle="false"
        >
          <PIcon class="el-button__icon--left">
            <PIUpload />
          </PIcon>
          Déposer un document
        </PButton>
      </PUpload>
    </Variant>
    <Variant title="PUpload File Line">
      <PUpload
        pMultiple
        pDrag
        pShowFileList
        pUploadType="file-line"
        pTextLimitSize="5MB"
        pPrefixLabelFileLine="Déposer le fichier ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        :pDisabled="uploadDisabled"
      />
      <template #controls>
        <HstCheckbox v-model="uploadDisabled" title="Disabled" />
      </template>
    </Variant>
    <Variant title="PUpload File Dragger">
      <PUpload
        pMultiple
        pDrag
        pShowFileList
        pUploadType="dragger"
        pTextLimitSize="1GB"
        pPrefixLabelFileLine="Déposer le fichier ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pAuthorizedFileFormat="JPEG, PNG, PDF ou XLS"
        pColorFileLine="persian"
        :pDisabled="uploadDisabled"
      />
      <template #controls>
        <HstCheckbox v-model="uploadDisabled" title="Disabled" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PUpload from '.'
import PButton from '@/atoms/PButton'

const uploadDisabled = ref(false)
</script>

<docs lang="md">
  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D605%253A2161%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
