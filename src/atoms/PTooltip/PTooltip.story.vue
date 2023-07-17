<template>
  <Story title="Atoms/Tooltip" icon="teenyicons:outline-circle">
    <Variant title="Custum tooltip">
      <PTooltip
         :content="tooltipBasicData.content"
         :placement="tooltipBasicData.placement"
         :disabled="tooltipBasicData.disabled"
         >
         <PButton>
          Hover button
         </PButton>
        </PTooltip>
      <template #controls>
        <hstText v-model="tooltipBasicData.content" title="content"/>
        <hstSelect
            v-model="tooltipBasicData.placement"
            title="placement"
            :options="placementOptions"/>
         <hstCheckbox v-model="tooltipBasicData.disabled" title="disabled"/>
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PTooltip from '../PTooltip'
import { reactive } from 'vue'
import placementOptions from '@/constants/placementOptions'
import PButton from '../PButton'
const tooltipBasicData = reactive({
  placement: placementOptions[0].value,
  content: 'this is a tooltip',
  disabled: false
})
</script>
