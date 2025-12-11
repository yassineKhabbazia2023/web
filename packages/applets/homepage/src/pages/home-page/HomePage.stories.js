import { useCurrentEntityStore, usePermissionsStore } from '@pulse/common/stores'
import { CustomerPermission } from '@pulse/common/enums'
import { getMockedCurrentEntity } from '@pulse/common/mocks'

import HomePageComponent from './HomePage.vue'

const withHomePageSetup = (entityConfig = {}) => {
  return (_story) => ({
    setup() {
      const currentEntityStore = useCurrentEntityStore()
      currentEntityStore.currentEntity = getMockedCurrentEntity({
        subscriptions: entityConfig.subscriptions ?? [],
      })

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
