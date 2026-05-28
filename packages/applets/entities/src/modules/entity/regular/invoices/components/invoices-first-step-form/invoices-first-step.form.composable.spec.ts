import { ref, shallowRef } from 'vue'
import type { FormInstance } from 'element-plus'
import type { InvoicesFullFormModel } from '../../types'
import { useInvoicesFirstStepForm } from './invoices-first-step.form.composable'

const createFormRefMock = () => shallowRef<FormInstance | null>(null)

const createFormModelMock = () => ref<InvoicesFullFormModel>({
  email: '',
  acceptTerms: false,
  selectedContactId: null,
})

describe('useInvoicesFirstStepForm', () => {
  describe('initial state', () => {
    it('should return acceptTermsModel', () => {
      const formRef = createFormRefMock()
      const isReadOnly = ref(false)
      const formModel = createFormModelMock()

      const { acceptTermsModel } = useInvoicesFirstStepForm({ formRef, isReadOnly, formModel })

      expect(acceptTermsModel).toBeDefined()
    })

    it('should return the same formRef that was passed', () => {
      const formRef = createFormRefMock()
      const isReadOnly = ref(false)
      const formModel = createFormModelMock()

      const result = useInvoicesFirstStepForm({ formRef, isReadOnly, formModel })

      expect(result.formRef).toBe(formRef)
    })
  })

  describe('acceptTermsModel', () => {
    it('should return a computed that gets acceptTerms value from formModel', () => {
      const formRef = createFormRefMock()
      const isReadOnly = ref(false)
      const formModel = createFormModelMock()
      formModel.value.acceptTerms = true

      const { acceptTermsModel } = useInvoicesFirstStepForm({ formRef, isReadOnly, formModel })

      expect(acceptTermsModel.value).toBe(true)
    })

    it('should allow setting acceptTerms when not read only', () => {
      const formRef = createFormRefMock()
      const isReadOnly = ref(false)
      const formModel = createFormModelMock()

      const { acceptTermsModel } = useInvoicesFirstStepForm({ formRef, isReadOnly, formModel })
      acceptTermsModel.value = true

      expect(formModel.value.acceptTerms).toBe(true)
    })

    it('should not allow setting acceptTerms when read only', () => {
      const formRef = createFormRefMock()
      const isReadOnly = ref(true)
      const formModel = createFormModelMock()
      formModel.value.acceptTerms = false

      const { acceptTermsModel } = useInvoicesFirstStepForm({ formRef, isReadOnly, formModel })
      acceptTermsModel.value = true

      expect(formModel.value.acceptTerms).toBe(false)
    })

    it('should react to isReadOnly changes', () => {
      const formRef = createFormRefMock()
      const isReadOnly = ref(true)
      const formModel = createFormModelMock()

      const { acceptTermsModel } = useInvoicesFirstStepForm({ formRef, isReadOnly, formModel })

      acceptTermsModel.value = true
      expect(formModel.value.acceptTerms).toBe(false)

      isReadOnly.value = false
      acceptTermsModel.value = true
      expect(formModel.value.acceptTerms).toBe(true)
    })
  })
})
