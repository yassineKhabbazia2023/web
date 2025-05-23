import { useRouter } from 'vue-router'
import { RouteName } from '@pulse/common/enums'

export default function useNavigation() {
  const router = useRouter()

  const navigateToWallet = () => {
    router.push({ name: RouteName.WALLET })
  }

  const navigateToCustomerWallet = () => {
    router.push({ name: RouteName.WALLET_CLIENT })
  }

  return { navigateToWallet, navigateToCustomerWallet }
}
