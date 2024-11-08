<template>
  <Story
    title="2. Atoms/RadioCard"
    icon="material-symbols:radio-button-checked-outline"
    :layout="{ type: 'grid', width: 800 }"
  >
    <Variant title="Basic Usage">
      <PForm
        @submit.prevent="logEvent('submit', formValues.radioValue)"
        :pModel="formValues"
        ref="formRef"
      >
        <PRadioGroup
          v-model="formValues.radioValue"
          @change="logEvent('change', $event)"
        >
          <PRadioCard
            :pLabel="pRadioCard1.label"
            :pTitle="pRadioCard1.title"
            :pDescription="pRadioCard1.description"
          >
            <PButton
              @click="logEvent('CTA clicked', $event)"
              pType="white"
            >
              Personnaliser
              <PIcon class="el-button__icon--right" pName="arrowRight" />
            </PButton>
          </PRadioCard>

          <PRadioCard
            :pLabel="pRadioCard2.label"
            :pTitle="pRadioCard2.title"
          />
        </PRadioGroup>

        <PButton
          @click="logEvent('submit', formValues.radioValue)"
          pType="primary"
          class="margin-top--4"
        >
          Submit
        </PButton>
      </PForm>

      <template #controls>
        <HstText v-model="pRadioCard1.label" title="Value 1" />
        <HstText v-model="pRadioCard1.title" title="Title 1" />
        <HstText v-model="pRadioCard1.description" title="Description 1" />
        <HstText v-model="pRadioCard2.label" title="Value 2" />
        <HstText v-model="pRadioCard2.title" title="Title 2" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { logEvent } from 'histoire/client'
import { ElRadioGroup as PRadioGroup } from 'element-plus'
import type { FormInstance } from 'element-plus'
import PIcon from '@styleguide/atoms/PIcon'
import PForm from '@styleguide/modecules/PForm'
import PRadioCard from '@styleguide/modecules/PRadioCard'
import PButton from '@styleguide/modecules/PButton'

const formRef = ref<FormInstance>()
const formValues = reactive({
  radioValue: undefined,
})

const DEFAULT_TITLE = 'Direction et administration générale'

const pRadioCard1 = reactive({
  label: 'value1',
  title: DEFAULT_TITLE,
  description: `Sed ut perspiciatis unde omnis iste natus error sit
    voluptatem accusantium doloremque laudantium, totam rem aperiam.`,
})
const pRadioCard2 = reactive({
  label: 'value2',
  title: DEFAULT_TITLE,
})
</script>

<docs lang="md">
## Basic usage
RadioCard usage

<div class="responsive-iframe-container">
  <iframe class="responsive-iframe" src="https://www.figma.com/file/hycpUsOrc1fFD7xcYY0ryN/%F0%9F%A6%84-Librairie-de-composants?type=design&node-id=1074-5192&mode=design&t=mUq1NUMNzn4KLH1e-0" allowfullscreen></iframe>
</div>
</docs>
