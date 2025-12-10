import { useCurrentEntityStore, usePermissionsStore } from '@pulse/common/stores'
import { CustomerPermission } from '@pulse/common/enums'

import HomePageComponent from './HomePage.vue'

const withHomePageSetup = (entityConfig = {}) => {
  return (_story) => ({
    setup() {
      // Setup stores
      const currentEntityStore = useCurrentEntityStore()
      currentEntityStore.currentEntity = {
        accountId: 602,
        accountNumber: '2025546345',
        legalName: 'Boulangerie Bel Epi',
        subscriptions: entityConfig.subscriptions ?? [],
      }

      // Setup permissions
      const permissionsStore = usePermissionsStore()
      permissionsStore.setCurrentEntityPermissions(entityConfig.permissions ?? [])

      return {}
    },
    template: '<story />',
  })
}

const meta = {
  title: 'Applets/Homepage/HomePage',
  component: HomePageComponent,
  tags: ['!autodocs'],
}

export default meta

export const Default = {
  decorators: [withHomePageSetup()],
  render: () => ({
    components: { HomePageComponent },
    template: '<HomePageComponent />',
  }),
}

export const WithPennylane = {
  decorators: [withHomePageSetup({
    subscriptions: [{ offerCode: 'Pennylane', status: 'validated' }],
    permissions: [CustomerPermission.ACCEDER_DOCUMENTS_PENNYLANE],
  })],
  render: () => ({
    components: { HomePageComponent },
    template: '<HomePageComponent />',
  }),
}
