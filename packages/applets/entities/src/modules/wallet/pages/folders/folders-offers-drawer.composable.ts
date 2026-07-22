import { nextTick, ref, useTemplateRef } from 'vue'
import type OffersDrawer from '@entities/components/OffersDrawer'

// Must match the `ref` attribute set on the OffersDrawer in Folders.vue.
const OFFERS_DRAWER_TEMPLATE_REF = 'offersDrawer'

export function useFoldersOffersDrawer(refreshAccountList: () => Promise<void>) {
  const openOffersDrawer = ref(false)
  const hasOffersDrawer = ref(false)
  const selectedCompanyName = ref('')
  const selectedAccountNumber = ref('')
  const selectedAccountId = ref<number>()

  const offersDrawerRef = useTemplateRef<InstanceType<typeof OffersDrawer>>(OFFERS_DRAWER_TEMPLATE_REF)

  async function onClickDeploy(accountId: number, accountNumber: string, companyName: string) {
    hasOffersDrawer.value = true
    selectedAccountNumber.value = accountNumber
    selectedAccountId.value = accountId
    selectedCompanyName.value = companyName
    await nextTick() // needed otherwise offersDrawerRef.value is not defined yet
    offersDrawerRef.value?.initDrawerForCurrentAccount()
    openOffersDrawer.value = true
  }

  async function onOfferSaved() {
    await refreshAccountList()
    openOffersDrawer.value = false
  }

  return {
    openOffersDrawer,
    hasOffersDrawer,
    selectedCompanyName,
    selectedAccountNumber,
    selectedAccountId,
    onClickDeploy,
    onOfferSaved,
  }
}
