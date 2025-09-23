<template>
  <span class="margin-right--1">{{ t('collaboratorRoles') }}</span>
  <PPopover
    :pTitle="t('rolesAndColorCodes')"
    pTrigger="hover"
    pShowArrow
    popperClass="roles-popover"
  >
    <template #content>
      <PTag
        v-for="(roleTag, index) in ROLE_COLORS"
        :key="index"
        :pContent="t(roleTag.label)"
        :pColor="roleTag.color"
        class="margin-x--1 margin-bottom--2"
      />
      <p class="role-source padding-x--1 margin-top--1">
        {{ t('roleSource') }}
      </p>
    </template>
    <div class="flex flex--align-items-center">
      <PIcon pName="infoCircle" />
    </div>
  </PPopover>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  PPopover,
  PIcon,
  PTag,
} from '@pulse/styleguide/components'
import { ROLE_COLORS } from '../../constants/collaborators.const'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

</script>

<style lang="scss">
.role-source {
  color: var(--p-gray-400);
  word-break: keep-all;
  overflow-wrap: normal;
}

.roles-popover {
  min-width: 241px !important;

  .el-popover__title {
    padding: 0px 4px;
    font-weight: 600;
  }
}
</style>


<i18n lang="yaml">
en-US:
  collaboratorRoles: 'Role(s)'
  rolesAndColorCodes: 'Roles and color codes'
  roleSource: 'These roles are determined by Akuiteo or our partners (external tools).'
  role:
    crossFunctional: "Cross-functional"
    esc: "ESC"
    consulting: "Consulting"
    legal: "Legal"
    socialManagement: "Social Management"
fr-FR:
  collaboratorRoles: 'Rôle(s)'
  rolesAndColorCodes: 'Rôles et codes couleurs'
  roleSource: 'Ces rôles sont déterminés par Akuiteo ou nos partenaires (outils externes).'
  role:
    crossFunctional: "Transverse"
    esc: "ESC"
    consulting: "Conseil"
    legal: "Juridique"
    socialManagement: "Gestion sociale"
</i18n>
