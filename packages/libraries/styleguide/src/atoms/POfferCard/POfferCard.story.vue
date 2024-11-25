<template>
  <Story
    title="2. Atoms/Offer Card"
    :layout="{ type: 'grid', width: '750px' }"
    icon="mingcute:basket-fill"
  >
    <Variant title="Offer Card" icon="mingcute:basket-fill">
      <div
        v-for="(offer, index) in offerCardData"
        :key="index"
        class="padding--3"
      >
        <POfferCard
          :pLogo="offer.pLogo"
          :pTitle="offer.pTitle"
          :pDescription="offer.pDescription"
          :disabled="offer.disabled"
          @select-offer-event="logEvent('selectOfferEvent', $event)"
        />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import POfferCard from './'
import { logEvent } from 'histoire/client'
import { reactive } from 'vue'
import type { POfferCardProps } from './POfferCardTypes'

const offerCardData: POfferCardProps[] = reactive([
  {
    pLogo: 'loop-color',
    pTitle: 'Mes Modules de Compta',
    pDescription: 'Loop collaboratif (myPulse compta)',
    disabled: false,
  },
  {
    pLogo: 'meg',
    pTitle: 'Gestion Smart',
    pDescription:
      'Mon Expert en Gestion (MEG) en version start (inclu dans Pulse)',
    disabled: false,
  },
  {
    pLogo: 'iconpulse-color',
    pTitle: 'Ma Banque',
    pDescription: 'Visualisation des données bancaires',
    disabled: false,
  },
  {
    pLogo: 'silae-color',
    pTitle: 'Externalisation de la paie',
    pDescription: 'Silae en externalisation',
    disabled: true,
  },
])
</script>

<docs lang="md">
  ## Offer Card
  Button usage for accessibility. Attribute title will be read by the reader of the browser.

  <div class="reponsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/file/hycpUsOrc1fFD7xcYY0ryN/%F0%9F%A6%84-Librairie-de-composants?type=design&node-id=7166%3A2107&mode=design&t=r7bynAKyBs7sX5aF-1" allowfullscreen></iframe>
  </div>
</docs>
