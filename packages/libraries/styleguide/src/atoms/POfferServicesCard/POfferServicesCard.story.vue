<template>
  <Story
    title="2. Atoms/Offer Services Card"
    icon="mingcute:rows-4-fill"
    :layout="{ type: 'grid', width: '700px' }"
  >
    <Variant title="Basic usage">
      <div
        v-for="(offer, index) in offersData"
        :key="index"
        class="padding--3"
      >
        <POfferServicesCard
          :pLogo="offer.pLogo"
          :pTitle="offer.pTitle"
          :pServices="offer.pServices"
          @change-service-status="logEvent('switch', $event)"
        />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { logEvent } from 'histoire/client'
import POfferServicesCard from './'
import type { POfferServicesCardProps } from './POfferServicesCardTypes'

const offersData = reactive<POfferServicesCardProps[]>([
  {
    pLogo: 'iconpulse-color',
    pTitle: 'RYDGE platform services',
    pServices: [
      {
        pStatus: true,
        pDisabled: true,
        pName: 'GED Accounting',
        pTag: {
          pContent: 'Included',
          pColor: 'gray-900',
          pEffect: 'light',
        },
      },
    ],
  },
  {
    pLogo: 'meg',
    pTitle: "MEG partner's services",
    pServices: [
      {
        pStatus: true,
        pDisabled: true,
        pName: 'Access to the Meg tool',
        pTag: {
          pContent: 'Included',
          pColor: 'gray-900',
          pEffect: 'light',
        },
      },
      {
        pStatus: true,
        pDisabled: false,
        pName: 'Cash register module',
      },
      {
        pStatus: true,
        pDisabled: false,
        pName: 'Billing module',
      },
      {
        pStatus: false,
        pDisabled: false,
        pName: 'Initiation training in Meg',
        pTag: {
          pContent: 'Additional price',
          pColor: 'amethyste',
          pEffect: 'light',
        },
      },
    ],
  },
  {
    pLogo: 'loop-color',
    pTitle: "LOOP partner's services",
    pServices: [
      {
        pStatus: true,
        pDisabled: true,
        pName: 'Access to the Loop tool',
        pTag: {
          pContent: 'Included',
          pColor: 'gray-900',
          pEffect: 'light',
        },
      },
      {
        pStatus: false,
        pDisabled: false,
        pName: 'Complete support training in Meg',
        pTag: {
          pContent: 'Additional price',
          pColor: 'amethyste',
          pEffect: 'light',
        },
      },
    ],
  },
])
</script>

<docs lang="md">
  ## Offer Services Card
  The Offer Services Card component is designed to efficiently display offers and associated services, ensuring a concise yet informative presentation for users.

  <div class="reponsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/file/hycpUsOrc1fFD7xcYY0ryN/%F0%9F%A6%84-Librairie-de-composants?type=design&node-id=7629-2539&mode=design&t=kqf2eFn08TT50x9N-0" allowfullscreen></iframe>
  </div>
</docs>
