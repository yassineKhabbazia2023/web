<template>
  <PRow v-if="selectedEntity">
    <PCol :span="6">
      <Treeview
        :entityServices="entityServices"
        :currentService="currentService ?? ''"
        :selectedEntity="selectedEntity"
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
        @update-folder-name ="handleUpdateFolderName"
        @refresh-tree="handleTreeRefreshAndRedirectToFolder"
        @refresh-documents-list="refreshDocumentsList"
      />
    </PCol>

    <PCol v-if="currentService && currentServiceFolder && !currentBinService" :span="18">
      <Documents
        ref="documentsRef"
        :currentService="currentService"
        :selectedEntity="selectedEntity"
        :selectedFolder="currentFolder"
        :currentServiceFolder="currentServiceFolder"
        @update-source-folders="handleUpdateSourceFolder"
        @change-selected-folder="setCurrentFolderAndService"
      />
    </PCol>
    <PCol v-else-if="currentBinService" :span="18">
      <BinDocuments
        :currentBinService="currentBinService"
        :selectedEntity="selectedEntity"
        :selectedServiceName="currentBinServiceName"
        @navigate-to-folder="handleTreeRefreshAndRedirectToFolder"
      />
    </PCol>
  </PRow>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, provide } from 'vue'
import Treeview from '@/modules/Treeview'
import Documents from '@/modules/Documents'
import BinDocuments from '@/modules/Bin'
import { fetchServicesFolders } from '@/services/Folder'
import { fetchUserEntityServices } from '@/services/Services'
import type { Folder } from '@/models/Folder'
import type { Service } from '@/models/Service'
import {
  appendChildFolder,
  renameFolder,
  sortFolderByName,
  deleteFolder,
  findFolderDeepById,
} from '@/modules/Treeview/helpers/folderArrayHelper'
// import Notifications from './Notifications.vue'
import { PCol, PRow, PNotification } from '@kpmg/styleguide'
import { commonStore } from '@kpmg/common'
/* This might be refactored later to import 'PNotification' every time we need the notifications.
The current toaster uses a mock of the 'inject' property.
That's why we're providing the new PNotification for now.
*/
provide('toast', PNotification)
// Folders scope
const isLoadingServicesOrFolders = ref(true)
const currentFolder = ref<null | Folder>(null)
const servicesFolders = ref<Folder[][]>([])

const fetchGedFoldersAndServices = async () => {
  entityServices.value = await fetchUserEntityServices(
    selectedEntity.value,
  )

  const foldersFetchResult = await fetchServicesFolders(
    entityServices.value,
    selectedEntity.value,
  )

  servicesFolders.value = foldersFetchResult
  // Using the first folder serviceId by default
  currentService.value = servicesFolders.value[0][0].serviceId

  servicesFolders.value[0].filter((folder:Folder) => folder.serviceId === currentService.value)

  isLoadingServicesOrFolders.value = false
}

// Entities and services scope
const userStore = commonStore()

const selectedEntity = computed(() => userStore?.defaultEntity?.accountNumber.toString() ?? '')
const entityServices = ref<null | any>(null)
const currentService = ref<string | null>(null)
const currentServiceFolder = computed<null | Folder[]>(() => {
  return servicesFolders.value
    .filter((folder:Folder[]) => folder[0].serviceId === currentService.value)[0]
})

const setCurrentFolderAndService = async (folder: Folder) => {
  if (currentBinService.value) {
    await fetchGedFoldersAndServices()
    currentService.value = folder.serviceId
    setCurrentBinService(null)
    setCurrentFolder(folder.id)
  } else {
    if (currentFolder.value === folder) return
    currentFolder.value = folder

    if (currentService.value === folder.serviceId) return
    currentService.value = folder.serviceId
  }
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
  ) as Folder[]
  // Find deep only in currentService if defined
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
  if (selectedEntity.value) {
    await fetchGedFoldersAndServices()
  }
})

</script>

<style lang="scss">
@import './styles/main';
</style>
