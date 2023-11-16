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
  </Story>
</template>

<script setup lang="ts">
import PUpload from '.'
import PButton from '../PButton'
</script>

<docs lang="md">
  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D605%253A2161%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
