<template>
  <div>
    <i18n-t
      class="margin-bottom--6"
      keypath="youCanModify"
      tag="p"
    >
      <template #administrator>
        <span class="font-bold">{{ t('administrator') }}</span>
      </template>
    </i18n-t>
    <PRadioGroup v-model="internalSelectedRoleId">
      <PRadioCard
        v-for="{ description, id, name } in roles"
        :key="id"
        :pLabel="id"
        :pTitle="name"
        :pDescription="description"
      >
        <PButton
          v-if="currentRole === name && preSelectedRoleId === selectedRoleId"
          pPlain
          pType="white"
          class="flex flex--align-items-center"
          data-testid="collab-roles-personalize-button"
          @click="emit('display-manage-rights')"
        >
          {{ t('personalize') }}
          <PIcon class="el-button__icon--right">
            <PIArrowRight />
          </PIcon>
        </PButton>
      </PRadioCard>
    </PRadioGroup>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import {
  PButton,
  PRadioCard,
  PRadioGroup,
  PIArrowRight,
  PIcon,
} from '@pulse/styleguide/components'
import type { CollabRolesProps } from './CollabRolesTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<CollabRolesProps>()
const emit = defineEmits<{
  'update:selectedRoleId': [number]
  'display-manage-rights': []
}>()

const internalSelectedRoleId = computed({
  get() {
    return props.selectedRoleId
  },
  set(roleId: number) {
    emit('update:selectedRoleId', roleId)
  },
})
</script>

<i18n lang="yaml">
  en-US:
    personalize: 'Personalize'
    youCanModify: 'As an {administrator}, you can modify the role of your colleague.'
    administrator: 'administrator'
  fr-FR:
    personalize: 'Personnaliser'
    youCanModify: "En tant qu'{administrator}, vous pouvez modifier le rôle de votre collaborateur."
    administrator: 'administrateur'
</i18n>
