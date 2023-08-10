<template>
  <div>
    <PActionBar
    :leftSideButtons="actionBarContent.leftSideButtons"
    :rightSideButtons="actionBarContent.rightSideButtons"
    />
    {{ t('ged') }}
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const actionBarContent = {
  rightSideButtons: [
    {
      buttonName: 'Renommer',
      buttonType: 'white',
      buttonIcon: 'PIPencilSquare',
      buttonActionName: 'buttonActionName',
      plain: true,
      round: false,
      circle: false,
      loading: false,
      disabled: false,
      size: 'small'
    },
    {
      buttonName: 'Envoi immédiat',
      buttonType: 'white',
      buttonIcon: 'PIRocket',
      buttonActionName: 'buttonActionName',
      plain: true,
      round: false,
      circle: false,
      loading: false,
      disabled: false,
      size: 'small'
    },
    {
      buttonName: 'Filtrer',
      buttonType: 'white',
      buttonIcon: 'PIFunnel',
      buttonActionName: 'buttonActionName',
      plain: true,
      round: false,
      circle: false,
      loading: false,
      disabled: false,
      size: 'small'
    },
    {
      buttonName: 'Télécharger',
      buttonType: 'white',
      buttonIcon: 'PIDownload',
      buttonActionName: 'buttonActionName',
      plain: false,
      round: false,
      circle: false,
      loading: false,
      disabled: false,
      size: 'small'
    },
    {
      buttonName: 'Supprimer',
      buttonType: 'white',
      buttonIcon: 'PITrash',
      buttonActionName: 'buttonActionName',
      plain: false,
      round: false,
      circle: false,
      loading: false,
      disabled: false,
      size: 'small'
    },
    {
      buttonName: 'Consulter',
      buttonType: 'white',
      buttonIcon: 'PIEye',
      buttonActionName: 'buttonActionName',
      plain: false,
      round: false,
      circle: false,
      loading: false,
      disabled: false,
      size: 'small'
    }
  ],
  leftSideButtons: [
    {
      buttonName: 'Déposer un document',
      buttonType: 'primary',
      buttonIcon: 'PIUpload',
      buttonActionName: 'buttonActionName',
      plain: false,
      round: false,
      circle: false,
      loading: false,
      disabled: false,
      size: 'small'
    },
    {
      buttonName: 'Filtrer',
      buttonType: 'primary',
      buttonIcon: 'PIFunnel',
      buttonActionName: 'buttonActionName',
      plain: true,
      round: false,
      circle: false,
      loading: false,
      disabled: false,
      size: 'small'
    },
    {
      buttonName: '',
      buttonType: 'white',
      buttonIcon: 'PISearch',
      buttonActionName: 'buttonActionName',
      plain: false,
      round: false,
      circle: true,
      loading: false,
      disabled: false,
      size: 'small'
    }
  ]
}
</script>

<i18n lang="yaml">
en-US:
  ged: 'You are on the GED page !'
fr-FR:
  ged: 'Vous êtes bien sur la GED !'
</i18n>
