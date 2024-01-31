<template>
  <Story title="3. Molecules/Field">
    <div class="container">
      <Variant title="String Input">
        <PForm
          pLabelPosition="top"
        >
          <StringField
            v-model="pControlStringInput.modelValue"
            pFieldKey="a"
            :pFieldType="pControlStringInput.pFieldType"
            :pLabel="pControlStringInput.pLabel"
            :pPlaceholder="pControlStringInput.pPlaceholder"
            :pDisabled="pControlStringInput.pDisabled"
            @update:model-value="logEvent('update:model-value', $event)"
          />
        </PForm>
        <template #controls>
          <HstText v-model="pControlStringInput.modelValue" title="Model value" />
          <HstText v-model="pControlStringInput.pFieldType" title="FieldType" />
          <HstText v-model="pControlStringInput.pPlaceholder" title="Placeholder" />
          <HstCheckbox v-model="pControlStringInput.pDisabled" title="Disabled" />
        </template>
      </Variant>
      <Variant title="Number Dropdown">
        <PForm
          pLabelPosition="top"
        >
          <NumberField
            v-model="pControlNumberSelect.modelValue"
            pFieldKey="b"
            :pFieldType="pControlNumberSelect.pFieldType"
            :pLabel="pControlNumberSelect.pLabel"
            :pDropdownOptions="pControlNumberSelect.pDropdownOptions"
            :pPlaceholder="pControlNumberSelect.pPlaceholder"
            :pDisabled="pControlNumberSelect.pDisabled"
            @update:model-value="logEvent('update:model-value', $event)"
          />
        </PForm>
        <template #controls>
          <HstNumber v-model="pControlNumberSelect.modelValue" title="Model value" />
          <HstText v-model="pControlNumberSelect.pFieldType" title="FieldType" />
          <HstText v-model="pControlNumberSelect.pPlaceholder" title="Placeholder" />
          <HstCheckbox v-model="pControlNumberSelect.pDisabled" title="Disabled" />
        </template>
      </Variant>
    </div>
  </Story>
</template>

<script setup lang="ts">
import PField from '.'
import { reactive } from 'vue'
import { logEvent } from 'histoire/client'
import type { PFieldPropsInput, PFieldPropsSelect } from './PFieldTypes'
import { getMockedInputField, getDropdownField } from './PFieldMock'
import type { PDropdownOption } from '../PDropdown/PDropdownTypes'

const StringField = PField<string>
const NumberField = PField<number | undefined>

const pControlStringInput = reactive<PFieldPropsInput<string>>(
  getMockedInputField('firstname', 'Prénom', 'John', 50)
)
const mockedDropdownOptions: PDropdownOption[] = [{
  pValue: 1,
  pLabel: '1 à 9'
}, {
  pValue: 10,
  pLabel: '10 à 49'
}, {
  pValue: 50,
  pLabel: '50 et plus'
}]

const pControlNumberSelect = reactive<PFieldPropsSelect<number | undefined>>(
  getDropdownField('range', 'Tranches', 50, mockedDropdownOptions)
)

</script>

<docs lang="md">
 ## Drawer
  This component Displays Select

  v-model="pControlStringInput.modelValue"
          :pPlaceholder="pControlStringInput.pPlaceholder"
          :pDisabled="pControlStringInput.pDisabled"
          :pDropdownOptions="pControlStringInput.pDropdownOptions"

| Name        | Description    | Type           | Accepted Values  | Default     |
| ----------- | -------------- | -------------- | ---------------- | ----------- |
| modelValue  | Current value  | string         |                  |             |
| pFieldType  | Type of field  | string         | `string`         | `string`    |

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D1703%253A12592%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
