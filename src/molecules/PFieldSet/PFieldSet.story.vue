<template>
  <Story
    title="3. Molecules/FieldSet"
    :layout="{
      type: 'grid',
      width: '90%'
    }">
    <div class="container">
      <Variant
        v-for="(variant, variantIndex ) in variants"
        :key="`variant-${variantIndex}`"
        :title="variant.title"
      >
        <PForm
          pLabelPosition="top"
          class="form"
          :pModel="variant.model"
        >
          <section
            v-for="(section, sectionIndex) in sections"
            :key="`section-${sectionIndex}`"
            class="margin--6 shadow--3 padding--4"
          >
            <h2 class="h3 margin-bottom--3">
              {{ section.title }}
            </h2>
            <PFieldSetCustom
              v-if="section.pFields"
              :pModel="variant.model"
              :pFields="section.pFields"
              :pReadonly="variant.readonly"
              @update:p-model="(fieldKey, fieldValue) => onUpdatePModel(variant, fieldKey, fieldValue)"
            />
          </section>
        </PForm>
        <template #controls>
          <HstCheckbox v-model="variant.readonly" title="pReadonly" />
          <HstJson v-model="variant.model" title="pModel" />
          <HstJson
            v-for="(section, index) in sections"
            :key="`sectionCtr-${index}`"
            v-model="section.pFields"
            :title="`pFields (${index})`"
          />
        </template>
      </Variant>
    </div>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { logEvent } from 'histoire/client'
import { setWith } from 'lodash-es'
import PFieldSet from '.'
import { getMockedFields } from './PFieldSetMock'

type Section = {
  title: string,
  pFields: ReturnType<typeof getMockedFields>
}

type CustomModel = {
  person: {
    firstname: string,
    lastName?: string
  },
  contact: {
    email: string,
    phone?: string
  }
}

type Variant = {
  title: string,
  model: CustomModel,
  readonly: boolean,
  sections: Section[]
}

const sections = [{
  title: 'Identification de l\'entreprise',
  pFields: getMockedFields('companyIdentification')
}, {
  title: 'Coordonnées de l\'entreprise',
  pFields: getMockedFields('companyContact')
}, {
  title: 'Adresse de l\'entreprise',
  pFields: getMockedFields('companyAddress')
}, {
  title: 'Informations comptables et fiscales',
  pFields: getMockedFields('accountingAndTaxInformation')
}]

const model: CustomModel = {
  person: {
    firstname: 'Susan'
  },
  contact: {
    email: 'email@domain.tld'
  }
}

const PFieldSetCustom = PFieldSet<CustomModel>

const variants = ref<Variant[]>([{
  title: 'Informations d\'une personne morale',
  model,
  readonly: false,
  sections
}])

function onUpdatePModel(variant: Variant, fieldKey: string, fieldValue: any) {
  setWith(variant.model, fieldKey, fieldValue, Object)
  logEvent('update:pModel', { fieldKey, fieldValue })
}
</script>
