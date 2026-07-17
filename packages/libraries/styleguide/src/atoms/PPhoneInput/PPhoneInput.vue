<template>
  <div
    class="
      p-phone-input
      flex
      flex-gap--2
    "
  >
    <ElSelect
      v-model="selectedCountry"
      filterable
      :filterMethod="onFilterCountries"
      :disabled="pCountryDisabled === true ? true : pDisabled"
      class="p-phone-input__country-select"
      popperClass="p-phone-input__country-popper"
      data-testid="phone-country-select"
      @change="onCountryChange"
    >
      <template #prefix>
        <span :class="`flag:${selectedCountry}`" />
      </template>
      <ElOption
        v-for="country in filteredCountries"
        :key="country.code"
        :value="country.code"
        :label="`+${country.dialCode}`"
      >
        <span
          class="
            p-phone-input__country-option
            flex
            flex--align-items-center
            flex-gap--2
          "
        >
          <span :class="`flag:${country.code}`" />
          <span class="p-phone-input__country-option__name">{{ country.name }}</span>
          <span class="p-phone-input__country-option__dial-code">+{{ country.dialCode }}</span>
        </span>
      </ElOption>
    </ElSelect>
    <PInput
      v-model="displayNumber"
      class="p-phone-input__number-input flex--grow-1"
      pType="tel"
      :pDisabled="pDisabled"
      :pPlaceholder="pPlaceholder"
      data-testid="phone-number-input"
    />
  </div>
</template>

<script setup lang="ts">
import 'country-flag-icons/3x2/flags.css'
import { ElSelect, ElOption } from 'element-plus'
import PInput from '../PInput'
import type { PPhoneInputProps } from './p-phone-input.types'
import { usePhoneInput } from './p-phone-input.composable'

const props = withDefaults(defineProps<PPhoneInputProps>(), {
  pDefaultCountry: 'FR',
  pDisabled: undefined,
  pCountryDisabled: false,
  pPlaceholder: '',
  pPreferredCountries: () => [],
})

const model = defineModel<string>({ default: '' })

const {
  selectedCountry,
  nationalNumber,
  displayNumber,
  filteredCountries,
  onFilterCountries,
  onCountryChange,
} = usePhoneInput(model, props)

defineExpose({
  selectedCountry,
  nationalNumber,
})
</script>

<style scoped lang="scss">
.p-phone-input {
  width: 100%;

  &__country-select {
    width: 110px;
    flex-shrink: 0;

    [class^='flag:'] {
      font-size: var(--el-font-size-base);
    }
  }

  &__country-option {
    &__name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__dial-code {
      color: var(--el-text-color-secondary);
      flex-shrink: 0;
    }
  }
}
</style>
