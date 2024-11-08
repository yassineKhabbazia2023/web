<template>
  <Story
    title="3. Molecules/Tabs"
    icon="ph:tabs-light"
    :layout="{
      type: 'grid',
      width: 600,
    }"
  >
    <Variant title="Basic Usage">
      <PTabs
        v-model="firstActiveVariant"
        :pStretch="basicData.stretch"
        @update:model-value="logEvent('update:model-value', $event)"
      >
        <PTabPane
          v-for="tab in tabs"
          :key="tab.name"
          :pLabel="tab.label"
          :pName="tab.name"
        >
          {{ tab.content }}
        </PTabPane>
      </PTabs>
    </Variant>
    <Variant title="Counter Usage">
      <PTabs
        v-model="secondActiveVariant"
        :pStretch="basicData.stretch"
        @update:model-value="logEvent('update:model-value', $event)"
      >
        <PTabPane pName="1">
          <template #label>
            <span>Option A</span>
            <PPastille
              size="small"
              kind="persian"
              class="margin-left--2">
              12
            </PPastille>
          </template>
          Custom 1
        </PTabPane>
        <PTabPane pName="2">
          <template #label>
            <span>Option B</span>
            <PPastille
              size="small"
              kind="persian"
              class="margin-left--2">
              123
            </PPastille>
          </template>
          Custom 2
        </PTabPane>
        <PTabPane pName="3">
          <template #label>
            <span>Option C</span>
            <PPastille
              size="small"
              kind="persian"
              class="margin-left--2">
              1
            </PPastille>
          </template>
          Custom 3
        </PTabPane>
      </PTabs>
    </Variant>
    <Variant title="Card Usage">
      <PTabs
        v-model="basicData.activeName"
        pType="card"
        :pStretch="basicData.stretch"
        @update:model-value="logEvent('update:model-value', $event)"
      >
        <PTabPane
          v-for="tab in tabs"
          :key="tab.name"
          :pLabel="tab.label"
          :pName="tab.name"
        >
          {{ tab.content }}
        </PTabPane>
      </PTabs>
    </Variant>
    <Variant title="Icon Usage">
      <PTabs
        v-model="basicData.activeName"
        pType="icon"
        :pStretch="basicData.stretch"
        @update:model-value="logEvent('update:model-value', $event)"
      >
        <PTabPane
          v-for="tab in tabs"
          :key="tab.name"
          :pName="tab.name"
          pTabIcon="PICalendarEvent"
        >
          {{ tab.content }}
        </PTabPane>
      </PTabs>
    </Variant>
    <Variant title="Icon Usage with Tooltip">
      <PTabs
        v-model="basicData.activeName"
        pType="icon"
        :pStretch="basicData.stretch"
        @update:model-value="logEvent('update:model-value', $event)"
      >
        <PTabPane
          v-for="tab in tabs"
          :key="tab.name"
          :pName="tab.name"
          pTabIcon="PICalendarEvent"
          :pTooltip="tab.pTooltip"
        >
          {{ tab.content }}
        </PTabPane>
      </PTabs>
    </Variant>
    <Variant title="Schedule icons">
      {{ activeScheduleViewType }}
      <PTabs
        v-model="activeScheduleViewType"
        pType="icon"
        class="margin-right--2 margin-top--4"
        @update:model-value="logEvent('update:model-value', $event)"
      >
        <PTabPane
          pName="calendar"
          pTabIcon="PICalendarEvent"
        />
        <PTabPane
          pName="list"
          pTabIcon="PIListUl"
        />
      </PTabs>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { logEvent } from 'histoire/client'
import { reactive, ref } from 'vue'
import PTabPane from '@styleguide/atoms/PTabPane'
import type { PTooltipProps } from '@styleguide/atoms/PTooltip/PTooltipTypes'
import PTabs from '@styleguide/molecules/PTabs'
import PPastille from '@styleguide/atoms/PPastille'

const activeScheduleViewType = ref('calendar')
const firstActiveVariant = ref('1')
const secondActiveVariant = ref('1')
const basicData = reactive({
  activeName: '1',
  stretch: false,
})

const tabs = ref([
  {
    label: 'Tab 1',
    name: '1',
    content: 'Tab 1 content',
    pTooltip: {
      pPlacement: 'bottom',
      pContent: 'this is a tooltip',
      disabled: false,
    } as PTooltipProps,
  },
  {
    label: 'Tab 2',
    name: '2',
    content: 'Tab 2 content',
    pTooltip: {
      pPlacement: 'bottom',
      pContent: 'this is a tooltip',
      disabled: false,
    } as PTooltipProps,
  },
  {
    label: 'Tab 3',
    name: '3',
    content: 'Tab 3 content',
    pTooltip: {
      pPlacement: 'bottom',
      pContent: 'this is a tooltip',
      disabled: false,
    } as PTooltipProps,
  },
])

</script>

<docs lang="md">
  ## Tabs
  Variant with pastille, card, simple or with icon

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D749%253A5606%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>

