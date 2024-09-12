import { useRouter } from 'vue-router'

export default function useNavigation() {
  const router = useRouter()

  const navigateToWallet = () => {
    router.push({ name: 'wallet' })
  }

  const navigateToCustomerWallet = () => {
    router.push({ name: 'wallet-client' })
  }

  return { navigateToWallet, navigateToCustomerWallet }
}
