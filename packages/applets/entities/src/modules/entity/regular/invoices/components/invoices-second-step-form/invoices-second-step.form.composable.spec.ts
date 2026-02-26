import { ref, shallowRef } from 'vue'
import { flushPromises } from '@vue/test-utils'
import type { FormInstance } from 'element-plus'
import { withSetup } from '@pulse/toolbox/utils/test'
import { useInvoicesSecondStepForm } from './invoices-second-step.form.composable'
import { InvoicesSecondStepFormManager } from './invoices-second-step.form.manager'

vi.mock('./invoices-second-step.form.manager')

const createFormRefMock = () => shallowRef<FormInstance | null>(null)

const mockOptions = [
  { pValue: 'contact-1', pLabel: 'John Doe', pDescription: 'john@example.com' },
  { pValue: 'contact-2', pLabel: 'Jane Smith', pDescription: 'jane@example.com' },
]

describe('useInvoicesSecondStepForm', () => {
  beforeEach(() => {
    vi.mocked(InvoicesSecondStepFormManager.fetchCustomerOptions).mockResolvedValue({
      success: true,
      options: mockOptions,
    })
  })

  describe('initial state', () => {
    it('should return empty customerOptions initially', () => {
      const formRef = createFormRefMock()
      const isReadOnly = ref(false)
      const accountId = ref<number | undefined>(100)

      const [result, app] = withSetup(() =>
        useInvoicesSecondStepForm({ formRef, isReadOnly, accountId }),
      )

      expect(result.customerOptions.value).toEqual([])

      app.unmount()
    })

    it('should return isLoadingCustomers as false initially then true during fetch', async () => {
      const formRef = createFormRefMock()
      const isReadOnly = ref(false)
      const accountId = ref<number | undefined>(100)

      let resolvePromise: ((value: { success: boolean, options: typeof mockOptions }) => void) | undefined
      vi.mocked(InvoicesSecondStepFormManager.fetchCustomerOptions).mockImplementationOnce(
        () => new Promise((resolve) => {
          resolvePromise = resolve
        }),
      )

      const [result, app] = withSetup(() =>
        useInvoicesSecondStepForm({ formRef, isReadOnly, accountId }),
      )

      expect(result.isLoadingCustomers.value).toBe(true)

      resolvePromise!({ success: true, options: mockOptions })
      await flushPromises()

      expect(result.isLoadingCustomers.value).toBe(false)

      app.unmount()
    })

    it('should return the same formRef that was passed', () => {
      const formRef = createFormRefMock()
      const isReadOnly = ref(false)
      const accountId = ref<number | undefined>(100)

      const [result, app] = withSetup(() =>
        useInvoicesSecondStepForm({ formRef, isReadOnly, accountId }),
      )

      expect(result.formRef).toBe(formRef)

      app.unmount()
    })

    it('should return the same isReadOnly that was passed', () => {
      const formRef = createFormRefMock()
      const isReadOnly = ref(true)
      const accountId = ref<number | undefined>(100)

      const [result, app] = withSetup(() =>
        useInvoicesSecondStepForm({ formRef, isReadOnly, accountId }),
      )

      expect(result.isReadOnly.value).toBe(true)

      app.unmount()
    })
  })

  describe('onMounted behavior', () => {
    it('should fetch customers on mount when accountId is defined', async () => {
      const formRef = createFormRefMock()
      const isReadOnly = ref(false)
      const accountId = ref<number | undefined>(100)

      const [_result, app] = withSetup(() =>
        useInvoicesSecondStepForm({ formRef, isReadOnly, accountId }),
      )
      await flushPromises()

      expect(vi.mocked(InvoicesSecondStepFormManager.fetchCustomerOptions)).toHaveBeenCalledWith(100)

      app.unmount()
    })

    it('should not fetch customers when accountId is undefined', async () => {
      const formRef = createFormRefMock()
      const isReadOnly = ref(false)
      const accountId = ref<number | undefined>(undefined)

      const [_result, app] = withSetup(() =>
        useInvoicesSecondStepForm({ formRef, isReadOnly, accountId }),
      )
      await flushPromises()

      expect(vi.mocked(InvoicesSecondStepFormManager.fetchCustomerOptions)).not.toHaveBeenCalled()

      app.unmount()
    })

    it('should populate customerOptions after successful fetch', async () => {
      const formRef = createFormRefMock()
      const isReadOnly = ref(false)
      const accountId = ref<number | undefined>(100)

      const [result, app] = withSetup(() =>
        useInvoicesSecondStepForm({ formRef, isReadOnly, accountId }),
      )
      await flushPromises()

      expect(result.customerOptions.value).toEqual(mockOptions)

      app.unmount()
    })

    it('should keep customerOptions empty when fetch fails', async () => {
      vi.mocked(InvoicesSecondStepFormManager.fetchCustomerOptions).mockResolvedValueOnce({
        success: false,
        options: [],
      })

      const formRef = createFormRefMock()
      const isReadOnly = ref(false)
      const accountId = ref<number | undefined>(100)

      const [result, app] = withSetup(() =>
        useInvoicesSecondStepForm({ formRef, isReadOnly, accountId }),
      )
      await flushPromises()

      expect(result.customerOptions.value).toEqual([])

      app.unmount()
    })
  })

  describe('fetchCustomers', () => {
    it('should be exposed and callable', async () => {
      const formRef = createFormRefMock()
      const isReadOnly = ref(false)
      const accountId = ref<number | undefined>(100)

      const [result, app] = withSetup(() =>
        useInvoicesSecondStepForm({ formRef, isReadOnly, accountId }),
      )
      await flushPromises()

      expect(result.fetchCustomers).toBeInstanceOf(Function)

      vi.mocked(InvoicesSecondStepFormManager.fetchCustomerOptions).mockClear()
      await result.fetchCustomers()

      expect(vi.mocked(InvoicesSecondStepFormManager.fetchCustomerOptions)).toHaveBeenCalledWith(100)

      app.unmount()
    })
  })
})
