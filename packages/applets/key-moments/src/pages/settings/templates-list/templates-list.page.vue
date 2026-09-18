<template>
  <div data-testid="key-moments-settings-templates-page">
    <div
      class="
        flex
        flex--justify-content-end
        margin-bottom--4
      "
    >
      <PButton
        pSize="small"
        pType="primary"
        pTestId="key-moments-settings-templates-new-button"
        @click="createDrawer?.openNew()"
      >
        {{ t('keyMoments.settings.templates.new') }}
      </PButton>
    </div>

    <div
      v-if="isLoading"
      class="
        flex
        flex--justify-content-center
        margin-top--8
      "
      data-testid="key-moments-settings-templates-loader"
    >
      <PLoader
        pType="primary"
        pSize="50"
      />
    </div>

    <PTable
      v-else
      :pData="catalogue"
      pRowKey="templateId"
      pStripe
      pTestId="key-moments-settings-templates-table"
    >
      <PTableColumn
        :pLabel="t('keyMoments.settings.templates.columns.code')"
        pProp="code"
      />
      <PTableColumn
        :pLabel="t('keyMoments.settings.templates.columns.label')"
        pProp="label"
      />
      <PTableColumn :pLabel="t('keyMoments.settings.templates.columns.visibleVersion')">
        <template #default="{ row }">
          <span v-if="row.visibleVersion !== null">{{ row.visibleVersion }}</span>
          <PTag
            v-else
            pColor="light-gray"
            pSize="small"
            :pContent="t('keyMoments.settings.templates.noVisibleVersion')"
          />
        </template>
      </PTableColumn>
      <PTableColumn :pLabel="t('keyMoments.settings.templates.columns.actions')">
        <template #default="{ row }">
          <div
            class="
              flex
              flex--align-items-center
              flex-gap--2
            "
          >
            <PButton
              pSize="small"
              pIconOnly
              :title="t('keyMoments.settings.templates.open')"
              :pTestId="`key-moments-settings-template-${row.code}-open-button`"
              @click="openEditor(row.templateId)"
            >
              <PIcon pName="pencilSquare" />
            </PButton>
            <PButton
              pSize="small"
              pIconOnly
              :pLoading="duplicatingId === row.templateId"
              :title="t('keyMoments.settings.templates.duplicate')"
              :pTestId="`key-moments-settings-template-${row.code}-duplicate-button`"
              @click="duplicate(row)"
            >
              <PIcon pName="files" />
            </PButton>
            <PButton
              v-if="row.visibleVersion !== null"
              pSize="small"
              pIconOnly
              :title="t('keyMoments.settings.templates.withdraw')"
              :pTestId="`key-moments-settings-template-${row.code}-withdraw-button`"
              @click="pendingWithdrawal = row"
            >
              <PIcon pName="eyeSlash" />
            </PButton>
          </div>
        </template>
      </PTableColumn>
    </PTable>

    <PConfirmationPopup
      :pIsVisible="pendingWithdrawal !== undefined"
      :pTitle="t('keyMoments.settings.templates.withdrawDialog.title')"
      :pConfirmButtonContent="t('keyMoments.settings.templates.withdrawDialog.confirm')"
      :pCancelButtonContent="t('keyMoments.settings.templates.createDrawer.cancel')"
      :pConfirmButtonIsLoading="isWithdrawing"
      pTestId="key-moments-settings-templates-withdraw-popup"
      @on-confirm-button-click="withdraw"
      @on-cancel-button-click="pendingWithdrawal = undefined"
    >
      <p>{{ t('keyMoments.settings.templates.withdrawDialog.text') }}</p>
    </PConfirmationPopup>

    <TemplateCreateDrawer
      ref="createDrawer"
      @created="onCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { RouteName } from '@pulse/common/enums'
import {
  PButton,
  PConfirmationPopup,
  PIcon,
  PLoader,
  PTable,
  PTableColumn,
  PTag,
} from '@pulse/styleguide/components'
import TemplateCreateDrawer from '@key-moments/components/editor/template-create-drawer/template-create-drawer.vue'
import { TemplateEditorManager } from '@key-moments/managers/template-editor.manager'
import { TemplateEditorService } from '@key-moments/services/template-editor.service'
import { readApiErrorDetail } from '@key-moments/utils/api-error.utils'
import { useTemplatesList } from './templates-list.composable'
import type { TemplateCatalogueItem } from '@key-moments/services/template-editor.service.types'

const { t } = useI18n()
const router = useRouter()

const { catalogue, isLoading, load } = useTemplatesList()

const createDrawer = useTemplateRef<InstanceType<typeof TemplateCreateDrawer>>('createDrawer')
const duplicatingId = ref<number>()

function openEditor(templateId: number): void {
  router.push({ name: RouteName.KEY_MOMENTS_TEMPLATE_EDITOR, params: { templateId } })
}

/**
 * Duplicating reads the content first: what is copied is a document, and the
 * catalogue only names it.
 */
async function duplicate(item: TemplateCatalogueItem): Promise<void> {
  duplicatingId.value = item.templateId

  try {
    // on the version the editor would open: a template nobody reads yet has no
    // visible version, and still has a document to copy
    const versions = await TemplateEditorService.getVersions(item.templateId)
    const content = await TemplateEditorService.getRawContent(
      item.templateId,
      TemplateEditorManager.defaultVersion(versions),
    )

    createDrawer.value?.openDuplicate({ label: item.label, content })
  } catch (error) {
    logger.error('[KeyMoments] settings: reading the template to duplicate failed', error)
    displayNotification('error', t('keyMoments.settings.templates.loadError'))
  } finally {
    duplicatingId.value = undefined
  }
}

/** A template just created is opened: creating one is meant to edit it. */
function onCreated(item: TemplateCatalogueItem): void {
  openEditor(item.templateId)
}

const pendingWithdrawal = ref<TemplateCatalogueItem>()
const isWithdrawing = ref(false)

/**
 * Takes a template out of the catalogue: it keeps every version it has, and no
 * dossier can pick it any more.
 */
async function withdraw(): Promise<void> {
  const item = pendingWithdrawal.value

  if (item === undefined) {
    return
  }

  isWithdrawing.value = true

  try {
    await TemplateEditorService.clearVisibleVersion(item.templateId)
    displayNotification('success', t('keyMoments.settings.templates.withdrawn'))
    pendingWithdrawal.value = undefined
    await load()
  } catch (error) {
    logger.error('[KeyMoments] settings: withdrawing the template failed', error)
    displayNotification(
      'error',
      readApiErrorDetail(error) ?? t('keyMoments.settings.templates.withdrawError'),
    )
  } finally {
    isWithdrawing.value = false
  }
}
</script>
