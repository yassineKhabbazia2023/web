<template>
  <div class="flex flex-gap--4 flex--wrap">
    <LaunchCard
      v-for="(launchCard, index) in launchCards"
      class="flex--basis-30 flex--grow-1"
      :key="index"
      :title="launchCard.title"
      :subtitle="launchCard.subtitle"
      :imageType="launchCard.imageType"
      :imageName="launchCard.imageName"
      :actionLabel="launchCard.actionLabel"
      :downloadUrl="launchCard.downloadUrl"
    />
  </div>
</template>

<script setup lang="ts">
import LaunchCard from '@/components/launchCard'
import type { LaunchCardProps } from '@/components/launchCard/LaunchCardTypes'

const launchCards: LaunchCardProps[] = [{
  title: 'Mon outil de gestion',
  subtitle: 'Accéder à votre outil de gestion afin de piloter votre entreprise',
  imageType: 'logos',
  imageName: 'iconpulse-color',
  actionLabel: "Se connecter à l'outil de gestion",
  downloadUrl: '',
}, {
  title: 'Silae',
  subtitle: 'Accéder à votre outil de gestion de planning et du personnel - À installer',
  imageType: 'logos',
  imageName: 'silae-color',
  actionLabel: 'Se connecter à Silae',
  downloadUrl: 'https://www.kpmg.fr',
}, {
  title: 'Pennylane',
  subtitle: 'Accéder à votre outil Pennylane pour votre gestion au quotidien',
  imageType: 'logos',
  imageName: 'pennylane-color',
  actionLabel: 'Se connecter à Pennylane',
  downloadUrl: '',
}]
</script>
