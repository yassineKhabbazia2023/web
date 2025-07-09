<template>
  <Story title="3. Molecules/Field">
    <div class="container">
      <Variant title="String Input">
        <PForm pLabelPosition="top">
          <StringField
            v-model="pControlStringInput.modelValue"
            pFieldKey="a"
            :pFieldType="pControlStringInput.pFieldType"
            :pLabel="pControlStringInput.pLabel"
            :pPlaceholder="pControlStringInput.pPlaceholder"
            :pDisabled="pControlStringInput.pDisabled"
            :pSuffixIconName="pControlStringInput.pSuffixIconName"
            @update:model-value="logEvent('update:model-value', $event)"
          />
        </PForm>
        <template #controls>
          <HstText
            v-model="pControlStringInput.modelValue"
            title="Model value"
          />
          <HstText v-model="pControlStringInput.pFieldType" title="FieldType" />
          <HstText
            v-model="pControlStringInput.pPlaceholder"
            title="Placeholder"
          />
          <HstText
            v-model="pControlStringInput.pSuffixIconName"
            title="Suffix icon name"
          />
          <HstCheckbox
            v-model="pControlStringInput.pDisabled"
            title="Disabled"
          />
        </template>
      </Variant>
      <Variant title="Number Dropdown">
        <PForm pLabelPosition="top">
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
          <HstNumber
            v-model="pControlNumberSelect.modelValue"
            title="Model value"
          />
          <HstText
            v-model="pControlNumberSelect.pFieldType"
            title="FieldType"
          />
          <HstText
            v-model="pControlNumberSelect.pPlaceholder"
            title="Placeholder"
          />
          <HstCheckbox
            v-model="pControlNumberSelect.pDisabled"
            title="Disabled"
          />
        </template>
      </Variant>
      <Variant title="Number Dropdown Multiple">
        <PForm pLabelPosition="top">
          <NumberField
            v-model="pControlNumberSelectMultiple.modelValue"
            pFieldKey="b"
            :pFieldType="pControlNumberSelectMultiple.pFieldType"
            :pLabel="pControlNumberSelectMultiple.pLabel"
            :pDropdownOptions="pControlNumberSelectMultiple.pDropdownOptions"
            :pPlaceholder="pControlNumberSelectMultiple.pPlaceholder"
            :pDisabled="pControlNumberSelectMultiple.pDisabled"
            :pCheckAllLabel="pControlNumberSelectMultiple.pCheckAllLabel"
            pMultiple
            @update:model-value="logEvent('update:model-value', $event)"
          />
        </PForm>
        <template #controls>
          <HstText
            v-model="pControlNumberSelectMultiple.pFieldType"
            title="FieldType"
          />
          <HstText
            v-model="pControlNumberSelectMultiple.pPlaceholder"
            title="Placeholder"
          />
          <HstCheckbox
            v-model="pControlNumberSelectMultiple.pDisabled"
            title="Disabled"
          />
          <HstText
            v-model="pControlNumberSelectMultiple.pCheckAllLabel"
            title="pCheckAllLabel"
          />
        </template>
      </Variant>
      <Variant title="Datepicker">
        <PForm pLabelPosition="top">
          <DateField
            v-model="pControlDate.modelValue"
            pFieldKey="c"
            :pFieldType="pControlDate.pFieldType"
            :pLabel="pControlDate.pLabel"
            :pPlaceholder="pControlDate.pPlaceholder"
            :pDisabled="pControlDate.pDisabled"
            :pFormat="pControlDate.pFormat"
            @update:model-value="logEvent('update:model-value', $event)"
          />
        </PForm>
        <template #controls>
          <HstText v-model="pControlDate.modelValue" title="Model value" />
          <HstSelect
            v-model="pControlDate.pFormat"
            title="Date Format"
            :options="dateFormats"
          />
          <HstText v-model="pControlDate.pFieldType" title="FieldType" />
          <HstText v-model="pControlDate.pPlaceholder" title="Placeholder" />
          <HstCheckbox v-model="pControlDate.pDisabled" title="Disabled" />
        </template>
      </Variant>
      <Variant title="Radio">
        <PForm pLabelPosition="top">
          <FieldRadio
            v-model="pControlRadio.modelValue"
            :pLabel="pControlRadio.pLabel"
            pFieldKey="c"
            pFieldType="radio"
            :pDisabled="pControlRadio.pDisabled"
            :pOptions="pControlRadio.pOptions"
            :pBorder="pControlRadio.pBorder"
            :pSize="pControlRadio.pSize"
            :pName="pControlRadio.pName"
            :pFlexColumn="pControlRadio.pFlexColumn"
            :pMultiple="pControlRadio.pMultiple"
            @update:model-value="logEvent('update:model-value', $event)"
          />
        </PForm>
        <template #controls>
          <HstText v-model="pControlRadio.pFieldType" title="FieldType" />
          <HstText v-model="pControlRadio.pPlaceholder" title="Placeholder" />
          <HstCheckbox v-model="pControlRadio.pDisabled" title="Disabled" />
          <HstCheckbox v-model="pControlRadio.pFlexColumn" title="FlexColumn" />
          <HstCheckbox v-model="pControlRadio.pMultiple" title="Multiple" />
        </template>
      </Variant>
    </div>
  </Story>
</template>

<script setup lang="ts">
import PField from '.'
import { reactive } from 'vue'
import { logEvent } from 'histoire/client'
import type {
  PFieldPropsInput,
  PFieldPropsDropdown,
  PFieldPropsDate,
  PFieldPropsRadio,
} from './PFieldTypes'
import {
  getMockedInputField,
  getDropdownField,
  getDateField,
  getRadioField,
} from './PField.mocks'
import type { PDropdownOption } from '../PDropdown/PDropdownTypes'
import PForm from '../../molecules/PForm'

const dateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY/MM/DD']

const StringField = PField<string>
const NumberField = PField<number | undefined>
const DateField = PField<string>
const FieldRadio = PField<string | string[]>

const pControlStringInput = reactive<PFieldPropsInput<string>>(
  getMockedInputField('firstname', 'Prénom', 'John', 50),
)

const mockedDropdownOptions: PDropdownOption[] = [
  {
    pValue: 1,
    pLabel: '1 à 9',
  },
  {
    pValue: 10,
    pLabel: '10 à 49',
  },
  {
    pValue: 50,
    pLabel: '50 et plus',
  },
]

const pControlNumberSelect = reactive<PFieldPropsDropdown<number | undefined>>(
  getDropdownField('range', 'Tranche', 50, mockedDropdownOptions),
)
const pControlNumberSelectMultiple = reactive<PFieldPropsDropdown<number | undefined>>(
  getDropdownField('range', 'Tranches', 50, mockedDropdownOptions, false, true, '', 'Tout sélectionner'),
)

const pControlDate = reactive<PFieldPropsDate<string>>(
  getDateField('creationDate', 'Date de création', '13/12/2014', 50),
)
const pControlRadio = reactive<PFieldPropsRadio<string | string[]>>(
  getRadioField({
    pFieldKey: 'type',
    pLabel: 'Type',
    flexBasis: 50,
  }),
)
</script>

<docs lang="md">
## Drawer

This component Displays Select

v-model="pControlStringInput.modelValue"
:pPlaceholder="pControlStringInput.pPlaceholder"
:pDisabled="pControlStringInput.pDisabled"
:pDropdownOptions="pControlStringInput.pDropdownOptions"

| Name       | Description   | Type   | Accepted Values | Default  |
| ---------- | ------------- | ------ | --------------- | -------- |
| modelValue | Current value | string |                 |          |
| pFieldType | Type of field | string | `string`        | `string` |

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D1703%253A12592%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
