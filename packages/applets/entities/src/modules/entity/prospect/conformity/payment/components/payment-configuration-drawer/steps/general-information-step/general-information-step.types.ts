import type { Ref } from 'vue'
import type { MandateBankDetails } from '../../payment-configuration-drawer.types'

export interface UseGeneralInformationStepParams {
  // The bank details and RIB file are owned by the drawer and shared with the step via v-model.
  bankDetails: Ref<MandateBankDetails>
  ribFile: Ref<File | null>
}
