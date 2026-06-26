import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { onMounted, ref, useTemplateRef } from 'vue'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { getMockedEntitySummary } from '@pulse/common/mocks'
import { PButton } from '@pulse/styleguide/components'
import { ConformityPaymentType } from '@entities/enums'
import { ConformityPaymentService } from '@entities/services/conformity-payment'
import PaymentConfigurationDrawer from './components/payment-configuration-drawer/payment-configuration-drawer.vue'
import { PaymentConfigurationStep } from './components/payment-configuration-drawer/payment-configuration-drawer.enums'

// A clickable fake GetAccept page (real iframe points to a cross-origin GetAccept URL we cannot embed
// here). "Signer" navigates the iframe (to about:blank), which fires the real signature step's @load
// handler — the very mechanism the drawer uses to detect signature.
const FAKE_GETACCEPT_URL = `data:text/html,${encodeURIComponent(
  '<!doctype html><meta charset="utf-8">'
  + '<body style="margin:0;height:100vh;box-sizing:border-box;display:flex;flex-direction:column;'
  + 'align-items:center;justify-content:center;gap:16px;font-family:-apple-system,sans-serif;'
  + 'background:#f4f6f8;color:#15171a">'
  + '<div style="font-size:18px;font-weight:600;color:#0c4f41">GetAccept — Mandat SEPA (fake)</div>'
  + '<div style="color:#4b5563;text-align:center;max-width:360px">Écran de signature simulé. '
  + '« Signer » fait naviguer l\'iframe, ce qui déclenche la re-vérification et avance le drawer.</div>'
  + '<button id="sign" type="button" style="background:#0c4f41;color:#fff;border:none;border-radius:8px;'
  + 'padding:12px 28px;font-size:15px;font-weight:600;cursor:pointer">Signer le mandat</button>'
  + '<script>document.getElementById("sign").addEventListener("click",'
  + 'function(){window.location.href="about:blank"})</script></body>',
)}`

function mockSignedMandateDownload(): void {
  ConformityPaymentService.downloadSignedMandate = () =>
    Promise.resolve(new Blob(['mock signed SEPA mandate'], { type: 'application/pdf' }))
}

// Seed the current entity (used as prospectId/office) and stub the API so stories render offline.
function setupMocks(paymentType: ConformityPaymentType | null): void {
  useCurrentEntityStore().setCurrentEntity(getMockedEntitySummary({ prospectId: 1 }))
  ConformityPaymentService.getPaymentPreference = () => Promise.resolve({ paymentType })
  mockSignedMandateDownload()
}

// For the interactive signature simulation: SEPA generation hands back the clickable fake GetAccept
// page, the first preference read (initial iframe load) reports "not signed", and after the prospect
// "signs" (the iframe re-navigates) the next read reports signed.
function setupSignatureSimulationMocks(): void {
  useCurrentEntityStore().setCurrentEntity(getMockedEntitySummary({ prospectId: 1 }))
  let checkCount = 0
  ConformityPaymentService.getPaymentPreference = () => {
    checkCount += 1
    return Promise.resolve({
      paymentType: checkCount > 1 ? ConformityPaymentType.MandateSepa : null,
    })
  }
  ConformityPaymentService.generateSepaMandate = () => Promise.resolve({ signatureUrl: FAKE_GETACCEPT_URL })
  mockSignedMandateDownload()
}

const meta: Meta<typeof PaymentConfigurationDrawer> = {
  title: 'Applets/Entities/Prospect/Conformity/Payment/Drawer',
  component: PaymentConfigurationDrawer,
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Renders the full drawer (frame, steps header and footer actions) opened on a given step via its
// exposed openAtStep() method, with an "open" button. Closing the drawer resets its configuration, so
// reopening re-applies the step and re-seeds the mocks to bring it back to the same step.
const renderDrawerAtStep = (
  setupStory: () => void,
  initialStep: PaymentConfigurationStep,
  initialSignatureUrl = '',
): Story['render'] => () => ({
  components: { PaymentConfigurationDrawer, PButton },
  setup() {
    setupStory()
    const drawer = useTemplateRef<InstanceType<typeof PaymentConfigurationDrawer>>('drawer')
    const isOpen = ref(false)
    const open = (): void => {
      setupStory()
      drawer.value?.openAtStep(initialStep, initialSignatureUrl)
    }
    onMounted(open)
    return { isOpen, open }
  },
  template: `
    <div style="padding: 24px;">
      <PButton
        pType="primary"
        :pDisabled="isOpen"
        @click="open"
      >
        Ouvrir le drawer
      </PButton>
      <PaymentConfigurationDrawer
        ref="drawer"
        v-model="isOpen"
      />
    </div>
  `,
})

// Step 1 — RIB upload and banking information (empty entry state), within the full drawer frame.
export const StepGeneralInformation: Story = {
  render: renderDrawerAtStep(() => setupMocks(null), PaymentConfigurationStep.GeneralInformation),
}

// Step 2 — interactive signature inside the full drawer frame: clicking "Signer" in the fake
// GetAccept page simulates the signature, so the @load-driven detection advances to the last step.
export const StepSignature: Story = {
  render: renderDrawerAtStep(
    setupSignatureSimulationMocks,
    PaymentConfigurationStep.Signature,
    FAKE_GETACCEPT_URL,
  ),
}

// Step 3 — completion screen (within the full drawer frame) with the signed mandate downloadable.
export const StepCompleted: Story = {
  render: renderDrawerAtStep(
    () => setupMocks(ConformityPaymentType.MandateSepa),
    PaymentConfigurationStep.Completed,
  ),
}
