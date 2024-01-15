import { useRouter } from 'vue-router'

export default function useNavigation() {
  const router = useRouter()

  const navigateToWallet = () => {
    router.push({ name: 'wallet' })
  }

  return { navigateToWallet }
}
