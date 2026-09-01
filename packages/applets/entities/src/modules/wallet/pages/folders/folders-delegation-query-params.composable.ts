import { watch } from 'vue'
import type { Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isQueryParamTrue } from '@pulse/toolbox/utils/url'
import { DELEGATION_QUERY_PARAM_DRAWER } from '@entities/constants'

export function useFoldersDelegationQueryParams(
  isDelegationDrawerOpened: Ref<boolean>,
  openSelectedFoldersDelegationDrawer: () => void,
) {
  const route = useRoute()
  const router = useRouter()

  function hasDelegationQueryParam(): boolean {
    return isQueryParamTrue(route.query[DELEGATION_QUERY_PARAM_DRAWER])
  }

  function clearDelegationQueryParam() {
    if (hasDelegationQueryParam() === false) {
      return
    }
    const cleanQuery = { ...route.query }
    delete cleanQuery[DELEGATION_QUERY_PARAM_DRAWER]
    router.replace({ query: cleanQuery })
  }

  function handleDelegationQueryParam() {
    if (hasDelegationQueryParam() === false) {
      return
    }
    if (isDelegationDrawerOpened.value === true) {
      return
    }
    openSelectedFoldersDelegationDrawer()
  }

  watch(isDelegationDrawerOpened, (isOpen) => {
    if (isOpen === false) {
      clearDelegationQueryParam()
    }
  })

  handleDelegationQueryParam()
}
