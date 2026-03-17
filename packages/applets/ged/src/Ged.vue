<template>
  <PRow v-if="accountNumber">
    <PCol
      v-if="shouldDisplayGED === false"
      :span="24"
      class="padding--4"
    >
      <MobileNotAvailableAlert />
    </PCol>
    <PCol v-if="shouldDisplayGED === true" :span="6">
      <Treeview
        :entityServices="entityServices"
        :currentService="currentService ?? ''"
        :currentServiceName="currentServiceName"
        :currentEntity="accountNumber"
        :accountId="selectedAccountId"
        :isLoading="isLoadingServicesOrFolders"
        :servicesFolders="servicesFolders"
        :selectedFolder="currentFolder"
        :currentServiceFolder="currentServiceFolder"
        :isInBinContext="currentBinService !== null"
        @selected-folder-change="setCurrentFolderAndService"
        @selected-bin-service-change="setCurrentBinService"
        @open-create-folder-modal="openCreateFolderModal"
        @update-source-folders="handleUpdateSourceFolder"
        @remove-folder-from-source="handleRemoveFolderFromSource"
        @update-folder-name="handleUpdateFolderName"
        @refresh-tree="handleTreeRefreshAndRedirectToFolder"
        @refresh-documents-list="refreshDocumentsList"
      />
    </PCol>

    <PCol
      v-if="shouldDisplayGED === true &&
        currentService !== null &&
        currentServiceName !== null &&
        isCurrentServiceReadOnly !== null &&
        currentServiceFolder !== undefined &&
        currentBinService === null"
      :span="18"
    >
      <Documents
        ref="documentsRef"
        :key="$router.currentRoute.value.fullPath"
        :currentService="currentService"
        :currentServiceName="currentServiceName"
        :isCurrentServiceReadOnly="isCurrentServiceReadOnly"
        :currentEntity="accountNumber"
        :accountId="selectedAccountId"
        :currentEntityAvatarColor="currentEntityAvatarColor"
        :currentEntityName="currentEntityName"
        :selectedFolder="currentFolder"
        :currentServiceFolder="currentServiceFolder"
        :gedContext
        @update-source-folders="handleUpdateSourceFolder"
        @change-selected-folder="setCurrentFolderAndService"
      />
    </PCol>
    <PCol v-else-if="shouldDisplayGED === true && currentBinService !== null" :span="18">
      <BinDocuments
        :currentBinService="currentBinService"
        :currentEntity="accountNumber"
        :accountId="selectedAccountId"
        :selectedServiceName="currentBinServiceName"
        @navigate-to-folder="handleTreeRefreshAndRedirectToFolder"
      />
    </PCol>
  </PRow>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import Treeview from '@ged/modules/Treeview'
import Documents from '@ged/modules/Documents'
import BinDocuments from '@ged/modules/Bin'
import { fetchServicesFolders } from '@ged/services/Folder'
import { fetchUserEntityServices } from '@ged/services/Services'
import type { Folder } from '@ged/models/Folder'
import type { Service } from '@ged/models/Service'
import {
  appendChildFolder,
  renameFolder,
  sortFolderByName,
  deleteFolder,
  findFolderDeepById,
} from '@ged/modules/Treeview/helpers/folderArrayHelper'
import { PCol, PRow } from '@pulse/styleguide/components'
import { PNotification, useResponsive } from '@pulse/styleguide'
import { MobileNotAvailableAlert } from '@pulse/shared/components'
import { logger } from '@pulse/toolbox'
import { useCurrentEntityStore, useUserStore } from '@pulse/common/stores'
import { GedManager } from '@ged/ged.manager'
import { GedContext } from '@pulse/common/enums'
import { GED_CONTEXT_META } from '@pulse/common/constants'
import { gedLegacyRouteUpdate } from '@ged/guard/ged-context-navigation.guard'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      unavailableService: 'The {serviceName} document management service is temporarily unavailable.',
    },
    'fr-FR': {
      unavailableService: 'Le service GED {serviceName} est momentanément indisponible',
    },
  },
})

const { isMobile } = useResponsive()

const userStore = useUserStore()
const { isCollab } = storeToRefs(userStore)

const shouldDisplayGED = computed(() =>
  // no GED on mobile
  isMobile.value === false ||
  // unless user is collaborator
 isCollab.value === true,
)
// Folders scope
const isLoadingServicesOrFolders = ref(true)
const currentFolder = ref<null | Folder>(null)
const servicesFolders = ref<Folder[][]>([])

const currentEntityStore = useCurrentEntityStore()
const { currentEntity } = storeToRefs(currentEntityStore)
const route = useRoute()

// Handle navigation between GED legacy instances (when route params change but same route)
onBeforeRouteUpdate(gedLegacyRouteUpdate)

const gedContext = computed<GedContext>(() => {
  return (route.meta?.[GED_CONTEXT_META] as GedContext) ?? GedContext.LEGACY
})

const fetchGedFoldersAndServices = async () => {
  try {
    entityServices.value = await fetchUserEntityServices(
      accountNumber.value,
      selectedAccountId.value,
      gedContext.value,
    )

    const { foldersByService, unavailableServices } = await fetchServicesFolders(
      entityServices.value,
      accountNumber.value,
      selectedAccountId.value,
    )

    displayUnavailableServicesNotification(unavailableServices)
    servicesFolders.value = foldersByService

    // Using the first folder serviceId by default
    currentService.value = servicesFolders.value[0][0].serviceId
    currentServiceName.value = findServiceNameFromId(currentService.value)
    isCurrentServiceReadOnly.value = GedManager.findIsServiceReadOnly(entityServices.value, currentService.value)
  } catch (error) {
    logger.error(error)
  } finally {
    isLoadingServicesOrFolders.value = false
  }
}
// Entities and services scope

const accountNumber = computed(() => currentEntity?.value?.accountNumber?.toString() ?? '')
watch(accountNumber, async (currentEntityValue) => {
  if (currentEntityValue) {
    isLoadingServicesOrFolders.value = true
    await fetchGedFoldersAndServices()
    isLoadingServicesOrFolders.value = false
  }
})

// Watch for GED context changes (e.g., switching between Social Management and Accounting)
watch(
  gedContext,
  async (newContext, oldContext) => {
    // Only refetch if context actually changed and we have an entity
    if (newContext !== oldContext && oldContext !== undefined && accountNumber.value) {
      isLoadingServicesOrFolders.value = true
      currentBinService.value = null // Reset bin context when switching GED contexts
      await fetchGedFoldersAndServices()
      isLoadingServicesOrFolders.value = false
    }
  },
)

const selectedAccountId = computed(() => currentEntity?.value?.accountId ?? 0)
const currentEntityAvatarColor = computed(() => currentEntity?.value?.color)
const currentEntityName = computed(() => currentEntity?.value?.legalName ?? '')
const entityServices = ref<Service[]>([])
const currentService = ref<null | Service['ServiceId']>(null)
const currentServiceName = ref<null | Service['ServiceName']>(null)
const isCurrentServiceReadOnly = ref<null | Service['IsReadOnly']>(null)
const currentServiceFolder = computed<Folder[] | undefined>(() => {
  return servicesFolders.value
    .filter((folder:Folder[]) => folder[0].serviceId === currentService.value)[0]
})

function displayUnavailableServicesNotification(services: Service[]) {
  services.forEach((service) => {
    PNotification({
      message: t('unavailableService', { serviceName: service.ServiceName }),
      iconName: 'x',
      showClose: true,
      customClass: 'error',
      position: 'bottom-right',
    })
  })
}

const setCurrentFolderAndService = async (folder: Folder) => {
  if (currentBinService.value) {
    await fetchGedFoldersAndServices()
    currentService.value = folder.serviceId
    currentServiceName.value = findServiceNameFromId(currentService.value)
    isCurrentServiceReadOnly.value = GedManager.findIsServiceReadOnly(entityServices.value, currentService.value)
    setCurrentBinService(null)
    setCurrentFolder(folder.id)
  } else {
    if (currentFolder.value === folder) {
      return
    }
    currentFolder.value = folder

    if (currentService.value === folder.serviceId) {
      return
    }
    currentService.value = folder.serviceId
    currentServiceName.value = findServiceNameFromId(currentService.value)
    isCurrentServiceReadOnly.value = GedManager.findIsServiceReadOnly(entityServices.value, currentService.value)

  }
}

function findServiceNameFromId(serviceId: Service['ServiceId']) {
  const foundService = entityServices.value.find((service) => service.ServiceId === serviceId)?.ServiceName
  return foundService || ''
}

// Trash scope
const currentBinService = ref<null | Service['ServiceId']>(null)
const currentBinServiceName = ref<string>('')

const setCurrentBinService = (serviceId: null | Service['ServiceId']) => {
  currentBinService.value = serviceId
  if (currentBinService.value) {
    currentBinServiceName.value = entityServices.value
      .filter((service:Service) => service.ServiceId === serviceId)[0].ServiceName
  }
}

// Create folder scope
const isCreateFolderModalVisible = ref(false)
const openCreateFolderModal = () => {
  isCreateFolderModalVisible.value = true
}

const handleUpdateSourceFolder = (data: Folder) => {
  const folderAdded = appendChildFolder(
    servicesFolders.value,
    data.parent.id,
    data,
    currentService.value ?? '',
  )

  if (folderAdded) {
    sortFolderByName(
      servicesFolders.value,
      currentService.value ?? '',
      data.parent.id,
    )
    setCurrentFolder(data.id)
  }
}

const setCurrentFolder = (folderId: number | null) => {
  const currentServiceFolder = servicesFolders.value.find(
    (sf) => sf[0].serviceId === currentService.value,
  )
  // Find deep only in currentService if defined
  if (!currentServiceFolder) {
    return
  }
  const folderToRedirectTo = findFolderDeepById(currentServiceFolder, folderId)
  if (folderToRedirectTo) {
    currentFolder.value = folderToRedirectTo
  }
}

// Delete folder scope
const handleRemoveFolderFromSource = (folder: Folder) => {
  deleteFolder(
    servicesFolders.value,
    currentService.value ?? '',
    folder.parent.id,
    folder.id,
  )
  setCurrentFolder(folder.parent.id)
}

// Rename folder scope
const handleUpdateFolderName = (data: Folder) => {
  const folderUpdated = renameFolder(
    servicesFolders.value,
    currentService.value ?? '',
    data,
  )

  if (folderUpdated) {
    sortFolderByName(
      servicesFolders.value,
      currentService.value ?? '',
      data.parent.id,
    )
    setCurrentFolder(data.id)
  }
}

const handleTreeRefreshAndRedirectToFolder = async (folderId: Folder['id']) => {
  await fetchGedFoldersAndServices()

  if (currentBinService.value) {
    currentService.value = currentBinService.value.toString()
  }
  setCurrentBinService(null)
  setCurrentFolder(folderId)
}

const documentsRef = ref()

function refreshDocumentsList() {
  documentsRef.value.refreshDocumentsList()
}

// Main component actions
onMounted(async () => {
  if (accountNumber.value) {
    await fetchGedFoldersAndServices()
  }
})
</script>

