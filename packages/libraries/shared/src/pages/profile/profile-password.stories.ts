import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { http, HttpResponse } from 'msw'
import { getWorker } from '@pulse/e2e-mocks/msw'
import { useUserStore } from '@pulse/common/stores'
import { getMockedUser } from '@pulse/common/mocks'
import ProfilePasswordPage from './profile-password.page.vue'

function setupUserStore() {
  const userStore = useUserStore()
  userStore.setUser(getMockedUser({ isCollab: false }))
}

function setupUpdatePasswordMock() {
  getWorker().use(
    http.post('*/authentication/api/update-password', () => {
      return HttpResponse.json({ success: true })
    }),
  )
}

const meta: Meta<typeof ProfilePasswordPage> = {
  title: 'Libraries/Shared/Pages/Profile/Password',
  component: ProfilePasswordPage,
  tags: ['!autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { ProfilePasswordPage },
    setup() {
      setupUserStore()
      setupUpdatePasswordMock()
      return {}
    },
    template: '<ProfilePasswordPage />',
  }),
}
