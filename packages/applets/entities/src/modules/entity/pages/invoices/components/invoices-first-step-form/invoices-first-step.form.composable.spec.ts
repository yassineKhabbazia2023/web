import { ref, shallowRef } from 'vue'
import type { FormInstance } from 'element-plus'
import { useInvoicesFirstStepForm } from './invoices-first-step.form.composable'

const createFormRefMock = () => shallowRef<FormInstance | null>(null)

describe('useInvoicesFirstStepForm', () => {
  describe('initial state', () => {
    it('should return formModel with initial values', () => {
      const formRef = createFormRefMock()
      const isReadOnly = ref(false)

      const { formModel } = useInvoicesFirstStepForm({ formRef, isReadOnly })

      expect(formModel.value).toEqual({
        email: '',
        acceptTerms: false,
      })
    })

    it('should return acceptTermsModel', () => {
      const formRef = createFormRefMock()
      const isReadOnly = ref(false)

      const { acceptTermsModel } = useInvoicesFirstStepForm({ formRef, isReadOnly })

      expect(acceptTermsModel).toBeDefined()
    })

    it('should return the same formRef that was passed', () => {
      const formRef = createFormRefMock()
      const isReadOnly = ref(false)

      const result = useInvoicesFirstStepForm({ formRef, isReadOnly })

      expect(result.formRef).toBe(formRef)
    })
  })

  describe('formModel', () => {
    it('should allow updating email', () => {
      const formRef = createFormRefMock()
      const isReadOnly = ref(false)

      const { formModel } = useInvoicesFirstStepForm({ formRef, isReadOnly })
      formModel.value.email = 'test@example.com'

      expect(formModel.value.email).toBe('test@example.com')
    })

    it('should allow updating acceptTerms', () => {
      const formRef = createFormRefMock()
      const isReadOnly = ref(false)

      const { formModel } = useInvoicesFirstStepForm({ formRef, isReadOnly })
      formModel.value.acceptTerms = true

      expect(formModel.value.acceptTerms).toBe(true)
    })
  })

  describe('acceptTermsModel', () => {
    it('should return a computed that gets acceptTerms value', () => {
      const formRef = createFormRefMock()
      const isReadOnly = ref(false)

      const { formModel, acceptTermsModel } = useInvoicesFirstStepForm({ formRef, isReadOnly })
      formModel.value.acceptTerms = true

      expect(acceptTermsModel.value).toBe(true)
    })

    it('should allow setting acceptTerms when not read only', () => {
      const formRef = createFormRefMock()
      const isReadOnly = ref(false)

      const { formModel, acceptTermsModel } = useInvoicesFirstStepForm({ formRef, isReadOnly })
      acceptTermsModel.value = true

      expect(formModel.value.acceptTerms).toBe(true)
    })

    it('should not allow setting acceptTerms when read only', () => {
      const formRef = createFormRefMock()
      const isReadOnly = ref(true)

      const { formModel, acceptTermsModel } = useInvoicesFirstStepForm({ formRef, isReadOnly })
      formModel.value.acceptTerms = false
      acceptTermsModel.value = true

      expect(formModel.value.acceptTerms).toBe(false)
    })

    it('should react to isReadOnly changes', () => {
      const formRef = createFormRefMock()
      const isReadOnly = ref(true)

      const { formModel, acceptTermsModel } = useInvoicesFirstStepForm({ formRef, isReadOnly })

      acceptTermsModel.value = true
      expect(formModel.value.acceptTerms).toBe(false)

      isReadOnly.value = false
      acceptTermsModel.value = true
      expect(formModel.value.acceptTerms).toBe(true)
    })
  })
})
