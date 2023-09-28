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
    <PCol :span="18">
      <div style="width: 200px; display: inline-block">
        {{ t('auth') }}
        <PInput v-model="userToken" />
        <PButton
          type="primary"
          :disabled="isGedFetchDisabled"
          class="margin-top--4"
          @click="fetchGedFoldersAndServices"
        >
          {{ t('fetchFolders') }}
        </PButton>
      </div>

      <div
        style="
          display: inline-block;
          vertical-align: top;
          margin-top: 21px;
          margin-left: 24px;
        "
      >
        <PDropdown v-model="selectedEntity">
          <POption
            v-for="entity in entities"
            :key="entity.value"
            :label="entity.label"
            :value="entity.value"
          />
        </PDropdown>
      </div>
    </PCol>
  </PRow>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Treeview from '@/modules/Treeview'
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

import { PCol, PRow, PInput, PButton, PDropdown, POption } from '@kpmg/styleguide'
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const isLoadingServicesOrFolders = ref(true)
const currentService = ref<string | null>(null)

const currentFolder = ref<null | Folder>(null)
const setCurrentFolderAndService = (folder: Folder) => {
  if (currentFolder.value === folder) return
  currentFolder.value = folder

  if (currentService.value === folder.serviceId) return
  currentService.value = folder.serviceId
}

const currentBinService = ref<null | Service['ServiceId']>(null)
const setCurrentBinService = (serviceId: Service['ServiceId']) => {
  currentBinService.value = serviceId
}

const selectedEntity = ref('93012cc8-77b9-4161-8dbd-61915d935e21')
const entities = [
  {
    label: 'Jean Lévage',
    value: '93012cc8-77b9-4161-8dbd-61915d935e21'
  },
  {
    label: 'Basset Finance Holding SARL',
    value: 'c0394a52-e232-4406-aa02-001e87722828'
  }
]

const userToken = ref('')
const entityServices = ref<null | any>(null)
const isGedFetchDisabled = computed(() => !userToken.value)

const servicesFolders = ref<Folder[][]>([])
const fetchGedFoldersAndServices = async () => {
  entityServices.value = await fetchUserEntityServices(
    userToken.value,
    selectedEntity.value
  )
  const foldersFetchResult = await fetchServicesFolders(
    userToken.value,
    entityServices.value,
    selectedEntity.value
  )

  servicesFolders.value = foldersFetchResult
  // Using the first folder serviceId by default
  currentService.value = servicesFolders.value[0][0].serviceId
  isLoadingServicesOrFolders.value = false
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

const handleRemoveFolderFromSource = (folder: Folder) => {
  DeleteFolder(
    servicesFolders.value,
    currentService.value ?? '',
    folder.parent.id,
    folder.id
  )
}
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
</script>

<i18n lang="yaml">
fr-FR:
  auth: 'Auth token'
  fetchFolders: 'Récupérer les dossiers'
en-US:
  auth: 'Auth token'
  fetchFolders: 'Fetch folders'
</i18n>

<style>
html,
body {
  background-color: white !important;
  color: black;
}
</style>
