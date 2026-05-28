import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { http, HttpResponse } from 'msw'
import { getWorker } from '@pulse/e2e-mocks/msw'
import { getMockedUserApi } from '@pulse/common/mocks'
import ProfileInformationPage from './profile-information.page.vue'

function setupCurrentUserMock() {
  getWorker().use(
    http.get('*/contact/me', () => {
      return HttpResponse.json(getMockedUserApi())
    }),
    http.patch('*/contact/api/contacts/currentuser', () => {
      return HttpResponse.json({ success: true })
    }),
  )
}

const meta: Meta<typeof ProfileInformationPage> = {
  title: 'Libraries/Shared/Pages/Profile/Information',
  component: ProfileInformationPage,
  tags: ['!autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { ProfileInformationPage },
    setup() {
      setupCurrentUserMock()
      return {}
    },
    template: '<ProfileInformationPage />',
  }),
}

export const Customer: Story = {
  render: () => ({
    components: { ProfileInformationPage },
    setup() {
      getWorker().use(
        http.get('*/contact/me', () => {
          return HttpResponse.json(getMockedUserApi({
            isCustomer: true,
            persona: {
              id: 2,
              name: 'Client',
              description: '',
            },
          }))
        }),
        http.patch('*/contact/api/contacts/currentuser', () => {
          return HttpResponse.json({ success: true })
        }),
      )
      return {}
    },
    template: '<ProfileInformationPage />',
  }),
}
