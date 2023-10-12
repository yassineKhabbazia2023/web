<template>
  <Story title="2. Atoms/Input" icon="iconoir:input-field">
    <Variant title="Basic Usage">
      <PInput
        v-model="basicInputData.inputValue"
        :type="basicInputData.type"
        :disabled="basicInputData.disabled"
        :placeholder="basicInputData.placeholder"
      >
      </PInput>
      <template #controls>
        <HstCheckbox v-model="basicInputData.disabled" title="Disabled" />
        <HstText v-model="basicInputData.placeholder" title="placeholder" />
        <HstText v-model="basicInputData.inputValue" title="input value" />
      </template>
    </Variant>
    <Variant title="Textarea">
      <PInput
        v-model="TextInputData.inputValue"
        :type="TextInputData.type"
        :disabled="TextInputData.disabled"
        :placeholder="TextInputData.placeholder"
        :autosize="TextInputData.autosize"
      >
      </PInput>
      <template #controls>
        <HstCheckbox v-model="TextInputData.disabled" title="Disabled" />
        <HstText v-model="TextInputData.placeholder" title="placeholder" />
        <HstText v-model="TextInputData.inputValue" title="Textarea put value" />
      </template>
    </Variant>
    <Variant title="Password">
      <PInput
        v-model="PasswordInputData.inputValue"
        :type="PasswordInputData.type"
        :placeholder="PasswordInputData.placeholder"
        :showPassword="PasswordInputData.showpassword"
      >
      </PInput>
      <template #controls>
        <HstCheckbox v-model="PasswordInputData.showpassword" title="showpassword" />
        <HstText v-model="PasswordInputData.placeholder" title="placeholder" />
        <HstText v-model="PasswordInputData.inputValue" title="Password put value" />
      </template>
    </Variant>
    <Variant title="Search">
      <PInput
        v-model="SearchInputData.inputValue"
        :type="SearchInputData.type"
        :placeholder="SearchInputData.placeholder"
        :prefixIcon="SearchInputData.prefixIcon"
        :clearable="SearchInputData.clearable"
      >
      </PInput>
      <template #controls>
        <HstText v-model="SearchInputData.placeholder" title="placeholder" />
      </template>
    </Variant>
    <Variant title="Search small">
      <PInput
        v-model="SearchInputData.inputValue"
        :type="SearchInputData.type"
        :placeholder="SearchInputData.placeholder"
        :prefixIcon="SearchInputData.prefixIcon"
        :clearable="SearchInputData.clearable"
        size="small"
      >
      </PInput>
      <template #controls>
        <HstText v-model="SearchInputData.placeholder" title="placeholder" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { PISearch } from '@/atoms/PIcon/components'

const basicInputData = reactive({
  type: 'text',
  disabled: false,
  placeholder: 'Please input',
  inputValue: 'Hello i am your input'
})
const TextInputData = reactive({
  type: 'textarea',
  disabled: false,
  placeholder: 'Please textarea',
  autosize: { minRows: 2, maxRows: 4 },
  inputValue: 'Hello i am textArea'
})
const PasswordInputData = reactive({
  type: 'password',
  placeholder: 'Please input password',
  showpassword: true,
  inputValue: 'Hello i am your password'
})
const SearchInputData = reactive({
  type: 'search',
  placeholder: 'Search',
  clearable: true,
  prefixIcon: PISearch,
  inputValue: ''
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
