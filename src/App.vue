<template>
  <PRow>
    <PCol :span="6">
      <Treeview
        :entityServices="entityServices"
        :currentService="currentService ?? ''"
        :selectedEntity="selectedEntity"
        :isLoading="isLoadingServicesOrFolders"
        :servicesFolders="servicesFolders"
        :selectedFolder="currentFolder"
        @selected-folder-change="setCurrentFolderAndService"
        @selected-bin-service-change="setCurrentBinService"
        @open-create-folder-modal="openCreateFolderModal"
        @update-source-folders="handleUpdateSourceFolder"
        @remove-folder-from-source="handleRemoveFolderFromSource"
        @update-folder-name ="handleUpdateFolderName"
      />
    </PCol>

    <PCol v-if="currentService" :span="18">
      <Documents
        :currentService="currentService"
        :selectedEntity="selectedEntity"
        :selectedFolder="currentFolder"
      />
    </PCol>
  </PRow>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Treeview from '@/modules/Treeview'
import Documents from '@/modules/Documents'
import { fetchServicesFolders } from '@/services/Folder'
import { fetchUserEntityServices } from '@/services/Services'

import type { Folder } from '@/models/Folder'
import type { Service } from '@/models/Service'
import {
  appendChildFolder,
  renameFolder,
  sortFolderByName,
  DeleteFolder
} from '@/modules/Treeview/helpers/folderArrayHelper'

import { PCol, PRow } from '@kpmg/styleguide'

// Folders scope
const isLoadingServicesOrFolders = ref(true)
const currentFolder = ref<null | Folder>(null)
const servicesFolders = ref<Folder[][]>([])

const fetchGedFoldersAndServices = async () => {
  entityServices.value = await fetchUserEntityServices(
    selectedEntity.value
  )
  const foldersFetchResult = await fetchServicesFolders(
    entityServices.value,
    selectedEntity.value
  )

  servicesFolders.value = foldersFetchResult
  // Using the first folder serviceId by default
  currentService.value = servicesFolders.value[0][0].serviceId

  isLoadingServicesOrFolders.value = false
}

// Entities and services scope
const selectedEntity = ref('93012cc8-77b9-4161-8dbd-61915d935e21')
const entityServices = ref<null | any>(null)
const currentService = ref<string | null>(null)

const setCurrentFolderAndService = (folder: Folder) => {
  if (currentFolder.value === folder) return
  currentFolder.value = folder

  if (currentService.value === folder.serviceId) return
  currentService.value = folder.serviceId
}

// Trash scope
const currentBinService = ref<null | Service['ServiceId']>(null)

const setCurrentBinService = (serviceId: Service['ServiceId']) => {
  currentBinService.value = serviceId
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
    currentService.value ?? ''
  )

  if (folderAdded) {
    sortFolderByName(
      servicesFolders.value,
      currentService.value ?? '',
      data.parent.id
    )
  }
}

// Delete folder scope
const handleRemoveFolderFromSource = (folder: Folder) => {
  DeleteFolder(
    servicesFolders.value,
    currentService.value ?? '',
    folder.parent.id,
    folder.id
  )
}

// Rename folder scope
const handleUpdateFolderName = (data: Folder) => {
  const folderUpdated = renameFolder(
    servicesFolders.value,
    currentService.value ?? '',
    data
  )

  if (folderUpdated) {
    sortFolderByName(
      servicesFolders.value,
      currentService.value ?? '',
      data.parent.id
    )
  }
}

// Main component actions
// eslint-disable-next-line vitest/require-hook
onMounted(async () => {
  await fetchGedFoldersAndServices()
})

</script>

<style>
html,
body {
  background-color: white !important;
  color: black;
}
</style>
