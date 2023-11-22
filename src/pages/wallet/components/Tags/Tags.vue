<template>
<div class="margin-bottom--6">
  <PLoader v-if="state.isLoading" />
  <div
    v-if="!state.isLoading"
    class="
      flex
      tags
      padding-top--3
      padding-bottom--4
      padding-x--6
      shadow--3
      margin-negative-x--6
    "
  >
    <div>
      <p class="tags_title font-semibold margin-bottom--3">
        {{ t('fileBoardingRate') }}
      </p>
      <div class="tags_list flex">
        <TagWrapper
          v-for="{ content, number, icon, color } in state.entityTags"
          :key="content"
          :number="number"
          :content="content"
          :icon="icon"
          :color="color"
        />
      </div>
    </div>
    <div
      class="
        separator
        margin-x--6
        hidden-sm-and-down"
    >
    </div>
    <div>
      <div>
        <p class="tags_title font-semibold margin-bottom--3">
          {{ t('userConnectionRate') }}
        </p>
        <div class="tags_list flex">
          <TagWrapper
            v-for="{ content, number, icon } in state.userTags"
            :key="content"
            :number="number"
            :content="content"
            :icon="icon"
            color="gray-500"
          />
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { markRaw, onMounted, reactive } from 'vue'
import {
  PIArrowRepeat,
  PICheckCircle,
  PIPatchCheck,
  PIPerson,
  PIPower,
  PIArrowUpCircle,
  PLoader
} from '@kpmg/styleguide'
import { commonApi } from '@kpmg/common'
import type { ITag, IState } from './types'
import TagWrapper from '../TagWrapper'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const TAGS = [
  {
    content: t('toDeploy'),
    icon: markRaw(PIArrowUpCircle),
    color: 'warning',
    apiKey: 'entityToDeploy'
  },
  {
    content: t('inProgress'),
    icon: markRaw(PIArrowRepeat),
    color: 'persian',
    apiKey: 'entityInProgress'
  },
  {
    content: t('connected'),
    icon: markRaw(PICheckCircle),
    color: 'success',
    apiKey: 'entityConnected'
  },
  {
    content: t('declared'),
    icon: markRaw(PIPatchCheck),
    apiKey: 'userDeclared'
  },
  {
    content: t('connected'),
    icon: markRaw(PIPower),
    apiKey: 'userConnected'
  },
  {
    content: t('guests'),
    icon: markRaw(PIPerson),
    apiKey: 'userInvited'
  }
] as ITag[]

const state: IState = reactive({
  userTags: [],
  entityTags: [],
  isLoading: undefined
})

onMounted(async () => {
  state.isLoading = true
  try {
    const { data } = await commonApi().wallet.get('statistics')
    const tagsWithNumber = TAGS.map(({ apiKey, ...rest }) => ({
      ...rest,
      apiKey,
      number: data[apiKey]
    }))
    state.userTags = tagsWithNumber.filter(({ apiKey }) => apiKey.startsWith('user'))
    state.entityTags = tagsWithNumber.filter(({ apiKey }) => apiKey.startsWith('entity'))
  } catch (err) {
    console.error(err)
  }
  state.isLoading = false
})
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}
.tags {
  @media (min-width: 993px) {
    align-items: end;
  }
  @media (max-width: 992px) {
    flex-direction: column;
    align-items: start;
    gap: 2.4rem
  }
}
.tags_list {
  column-gap: 1.2rem;
}
.tags_title {
  font-size: var(--el-font-size-small);
  color: var(--el-color-neutral-gray-500);
}
.separator {
  height: 3.8rem;
  width: 0.2rem;
  background: var(--el-color-neutral-gray-100);
}
</style>

<i18n lang="yaml">
  en-US:
    fileBoardingRate: 'File boarding rate'
    toDeploy: 'To Deploy'
    inProgress: 'In progress'
    connected: 'Connected'
    userConnectionRate: 'User connection rate'
    declared: 'Declared'
    guests: 'Guest(s)'
  fr-FR:
    fileBoardingRate: "Taux d'embarquement dossier"
    toDeploy: 'A déployer'
    inProgress: 'En cours'
    connected: 'Connecté(s)'
    userConnectionRate: 'Taux de connexion utilisateur'
    declared: 'Déclaré(s)'
    guests: 'Invité(s)'
</i18n>
