<template>
  <Story
    title="2. Atoms/Offer Card"
    :layout="{ type: 'grid', width: '750px' }"
    icon="mingcute:basket-fill"
  >
    <Variant title="Offer Card" icon="mingcute:basket-fill">
      <div
        class="padding--4"
        v-for="(offer, index) in offerCardData"
        :key="index"
      >
        <POfferCard
          :pLogo="offer.pLogo"
          :pTitle="offer.pTitle"
          :pDescription="offer.pDescription"
        />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import POfferCard from './'
import { reactive } from 'vue'
import type { POfferCardProps } from './POfferCardTypes'

const offerCardData: POfferCardProps[] = reactive([
  {
    pLogo: 'loop-color',
    pTitle: 'Mes Modules de Compta',
    pDescription: 'Loop collaboratif (myPulse compta)'
  },
  {
    pLogo: 'meg',
    pTitle: 'Gestion Smart',
    pDescription:
      'Mon Expert en Gestion (MEG) en version start (inclu dans Pulse)'
  },
  {
    pLogo: 'iconpulse-color',
    pTitle: 'Ma Banque',
    pDescription: 'Visualisation des données bancaires'
  }
])
</script>

<docs lang="md">
  ## Offer Card
  Button usage for accessibility. Attribute title will be read by the reader of the browser.

  <div class="reponsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/file/DTKKmx0ueMPoRpEPaZCMY3/Collab-V2-offres-%26-demandes?node-id=2076%3A2170&mode=dev" allowfullscreen></iframe>
  </div>
</docs>
