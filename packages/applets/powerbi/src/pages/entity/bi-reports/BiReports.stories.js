import { useCurrentEntityStore, useUserStore } from '@pulse/common/stores'
import { getMockedCurrentEntity } from '@pulse/common/mocks'

import BiReportsPageComponent from './BiReports.page.vue'

const withBiReportsSetup = (entityConfig = {}) => {
  return (_story) => ({
    setup() {
      const currentEntityStore = useCurrentEntityStore()
      currentEntityStore.currentEntity = getMockedCurrentEntity({
        isClarityVisible: entityConfig.isClarityVisible ?? false,
        isSignatory: entityConfig.isSignatory ?? false,
        subscriptions: entityConfig.subscriptions ?? [],
      })

      const userStore = useUserStore()
      userStore.user = {
        isCollab: entityConfig.isCollab ?? false,
      }

      return {}
    },
    template: '<story />',
  })
}

const meta = {
  title: 'Applets/PowerBI/BiReportsPage',
  component: BiReportsPageComponent,
  tags: ['!autodocs'],
}

export default meta

export const Default = {
  decorators: [withBiReportsSetup()],
  render: () => ({
    components: { BiReportsPageComponent },
    template: '<BiReportsPageComponent />',
  }),
}

export const WithClarityOffer = {
  decorators: [withBiReportsSetup({
    isClarityVisible: true,
    isSignatory: true,
  })],
  render: () => ({
    components: { BiReportsPageComponent },
    template: '<BiReportsPageComponent />',
  }),
}
