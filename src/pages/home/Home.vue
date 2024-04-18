<template>
  <div class="flex flex-gap--4 flex--wrap">
    <LauncherCard
      v-for="(LaunchCard, index) in LaunchCards"
      class="flex--basis-30 flex--grow-1"
      :key="index"
      :title="LaunchCard.title"
      :subtitle="LaunchCard.subtitle"
      :imageType="LaunchCard.imageType"
      :imageName="LaunchCard.imageName"
      :actionLabel="LaunchCard.actionLabel"
      :actionHref="LaunchCard.actionHref"
      :downloadHref="LaunchCard.downloadHref"
    />
  </div>
</template>

<script setup lang="ts">
import LauncherCard from '@/components/launch-card'
import type { LaunchCardProps } from '@/components/launch-card/LaunchCardTypes'

const LaunchCards: LaunchCardProps[] = [{
  title: 'Mon outil de gestion',
  subtitle: 'Accéder à votre outil de gestion afin de piloter votre entreprise',
  imageType: 'logos',
  imageName: 'iconpulse-color',
  actionLabel: "Se connecter à l'outil de gestion",
  actionHref: 'https://www.kpmg.fr',
  downloadHref: '',
}, {
  title: 'Silae',
  subtitle: 'Accéder à votre outil de gestion de planning et du personnel - À installer',
  imageType: 'logos',
  imageName: 'silae-color',
  actionLabel: 'Se connecter à Silae',
  actionHref: 'https://www.kpmg.fr',
  downloadHref: 'https://www.kpmg.fr',
}, {
  title: 'Pennylane',
  subtitle: 'Accéder à votre outil Pennylane pour votre gestion au quotidien',
  imageType: 'logos',
  imageName: 'pennylane-color',
  actionLabel: 'Se connecter à Pennylane',
  actionHref: 'https://www.kpmg.fr',
  downloadHref: '',
}]
</script>
