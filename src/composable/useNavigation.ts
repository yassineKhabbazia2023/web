import { useRouter } from 'vue-router'

export default function useNavigation() {
  const router = useRouter()

  const navigateToEntities = () => {
    router.push({ name: 'entities' })
  }

  return { navigateToEntities }
}
