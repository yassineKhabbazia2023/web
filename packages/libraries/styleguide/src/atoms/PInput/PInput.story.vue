<template>
  <Story title="2. Atoms/Input" icon="iconoir:input-field">
    <Variant title="Basic Usage">
      <PInput
        v-model="basicInputData.inputValue"
        :pType="basicInputData.type"
        :pDisabled="basicInputData.disabled"
        :pPlaceholder="basicInputData.placeholder"
      >
      </PInput>
      <template #controls>
        <HstCheckbox v-model="basicInputData.disabled" title="Disabled" />
        <HstText v-model="basicInputData.placeholder" title="Placeholder" />
        <HstText v-model="basicInputData.inputValue" title="Input Value" />
      </template>
    </Variant>
    <Variant title="Textarea">
      <PInput
        v-model="textInputData.inputValue"
        :pType="textInputData.type"
        :pDisabled="textInputData.disabled"
        :pPlaceholder="textInputData.placeholder"
        :pAutosize="textInputData.autosize"
      >
      </PInput>
      <template #controls>
        <HstCheckbox v-model="textInputData.disabled" title="Disabled" />
        <HstText v-model="textInputData.placeholder" title="Placeholder" />
        <HstText v-model="textInputData.inputValue" title="Textarea value" />
      </template>
    </Variant>
    <Variant title="Password">
      <PInput
        v-model="passwordInputData.inputValue"
        :pType="passwordInputData.type"
        :pPlaceholder="passwordInputData.placeholder"
        :pShowPassword="passwordInputData.showPassword"
      >
      </PInput>
      <template #controls>
        <HstCheckbox v-model="passwordInputData.showPassword" title="Show Password" />
        <HstText v-model="passwordInputData.placeholder" title="Placeholder" />
        <HstText v-model="passwordInputData.inputValue" title="Password put value" />
      </template>
    </Variant>
    <Variant title="Search">
      <PInput
        v-model="searchInputData.inputValue"
        :pType="searchInputData.type"
        :pPlaceholder="searchInputData.placeholder"
        :pPrefixIcon="searchInputData.prefixIcon"
        :pClearable="searchInputData.clearable"
      >
      </PInput>
      <template #controls>
        <HstText v-model="searchInputData.placeholder" title="Placeholder" />
      </template>
    </Variant>
    <Variant title="Search small">
      <PInput
        v-model="searchInputData.inputValue"
        :pType="searchInputData.type"
        :pPlaceholder="searchInputData.placeholder"
        :pPrefixIcon="searchInputData.prefixIcon"
        :pClearable="searchInputData.clearable"
        size="small"
      >
      </PInput>
      <template #controls>
        <HstText v-model="searchInputData.placeholder" title="Placeholder" />
      </template>
    </Variant>
    <Variant title="Input with slots Usage">
      <PInput
        v-model="basicInputData.inputValue"
        :pType="basicInputData.type"
        :pDisabled="basicInputData.disabled"
        :pPlaceholder="basicInputData.placeholder"
      >
        <template #suffix>
          <PIcon
            :color="AppColors.PRIMARY"
           pName="check" />
        </template>
        <template #prefix>
          <PIcon
            :color="AppColors.PRIMARY"
           pName="check" />
        </template>
        <template #append>
          <PIcon
            :color="AppColors.PRIMARY"
           pName="check" />
        </template>
        <template #prepend>
          <PIcon
            :color="AppColors.PRIMARY"
           pName="check" />
        </template>
      </PInput>
      <template #controls>
        <HstCheckbox v-model="basicInputData.disabled" title="Disabled" />
        <HstText v-model="basicInputData.placeholder" title="Placeholder" />
        <HstText v-model="basicInputData.inputValue" title="Input Value" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import PIcon from '@styleguide/atoms/PIcon'
import { PISearch } from '@styleguide/atoms/PIcon/components'
import PInput from '@styleguide/atoms/PInput'
import { AppColors } from '@styleguide/utils/AppColorsEnum'

const basicInputData = reactive({
  type: 'text',
  disabled: false,
  placeholder: 'Please input',
  inputValue: 'Hello i am your input',
})
const textInputData = reactive({
  type: 'textarea',
  disabled: false,
  placeholder: 'Please textarea',
  autosize: { minRows: 2, maxRows: 4 },
  inputValue: 'Hello i am textArea',
})
const passwordInputData = reactive({
  type: 'password',
  placeholder: 'Please input password',
  showPassword: true,
  inputValue: 'Hello i am your password',
})
const searchInputData = reactive({
  type: 'search',
  placeholder: 'Search',
  clearable: true,
  prefixIcon: PISearch,
  inputValue: '',
})
</script>

<docs lang="md">
  ## Input
  we can input Input data using mouse or keyboard.
  disabled : Disable the Input with the disabled attribute.
  show-password : Make a toggle-able password Input with the show-password attribute.
  attribute type="textarea" to change input into native textarea.
  attribute type="password" to change input into password input.
  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D23%253A212%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
