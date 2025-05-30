<template>
  <Story
    title="2. Atoms/Title"
    icon="fluent:button-16-regular"
    :layout="{ type: 'grid', width: '300px' }"
  >
    <Variant title="PTitle">
      <PTitle
        :pTitle="title"
        :pIconName="icon"
      />
      <template #controls>
        <HstText v-model="title" title="Title" />
        <hstSelect
          v-model="icon"
          title="Icon"
          :options="iconsOptions"
        />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PTitleProps } from './PTitleTypes'
import { pulseGeneratedIcons } from '../PIcon/components/constants.ts'

import PTitle from './'

const title = ref<PTitleProps['pTitle']>('Lorem ipsum dolor')
const icon = ref<PTitleProps['pIconName']>('pulse')

const iconsOptions = pulseGeneratedIcons.map((icon) => icon.name).sort()
</script>
