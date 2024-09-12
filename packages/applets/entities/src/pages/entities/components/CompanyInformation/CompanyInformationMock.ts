import type { FormSection, FormField } from './CompanyInformationTypes'

export function getMockedFormField(override: Partial<FormField> = {}): FormField {
  const defaultFormField: FormField = {
    pFieldType: 'input',
    pFieldKey: 'field-key',
    pLabel: 'field-label',
  }

  return {
    ...defaultFormField,
    ...override,
  }
}

export function getMockedFormSection(override: Partial<FormSection> = {}): FormSection {
  const fields = [getMockedFormField()]

  const defaultFormSection: FormSection = {
    title: 'Title',
    fields,
  }

  return {
    ...defaultFormSection,
    ...override,
  }
}
