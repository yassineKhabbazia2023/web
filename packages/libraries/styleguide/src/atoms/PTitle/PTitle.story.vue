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
        :pIconSize="iconSize"
        :pIconColor="iconColor"
      />
      <template #controls>
        <HstText v-model="title" title="Title" />
        <hstSelect
          v-model="icon"
          title="Icon"
          :options="iconsOptions"
        />
        <HstText v-model="iconSize" title="Icon Size" />
        <hstSelect
          v-model="iconColor"
          title="Icon Color"
          :options="iconColorsOptions"
        />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PTitleProps } from './PTitleTypes'
import { pulseGeneratedIcons } from '../PIcon/components/constants.ts'
import { AppColors } from '../../utils/AppColorsEnum'

import PTitle from './'

const title = ref<PTitleProps['pTitle']>('Lorem ipsum dolor')
const icon = ref<PTitleProps['pIconName']>('pulse')
const iconSize = ref<PTitleProps['pIconSize']>('28')
const iconColor = ref<PTitleProps['pIconColor']>(AppColors.PRIMARY)

const iconsOptions = pulseGeneratedIcons.map((icon) => icon.name).sort()
const iconColorsOptions = Object.values(AppColors).sort()
</script>
