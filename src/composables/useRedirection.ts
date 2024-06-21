import { useRouter } from 'vue-router'

export const useRedirection = () => {
  const router = useRouter()

  const redirectToHome = () => {
    router.push('/')
  }

  return { redirectToHome }
}
