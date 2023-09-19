<template>
  <Story title="2. Atoms/Bank Card" icon="mingcute:bank-card-fill">
    <Variant title="Basic usage">
      <div class="padding--8">
        <PBankCard
          :startTitle="bankCardBasicData.startTitle"
          :title="bankCardBasicData.title"
          :accountNumber="bankCardBasicData.accountNumber"
          :accountText="bankCardBasicData.accountText"
          :amount="bankCardBasicData.amount"
        />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PBankCard from './'
import { reactive } from 'vue'

const bankCardBasicData = reactive({
  startTitle: 'Aller à la',
  title: 'Synthèse des comptes',
  accountNumber: 4,
  accountText: 'comptes actifs',
  amount: '248 660,00 €'
})
</script>

<docs lang="md">
  ## Bank card
  Button usage for accessibility. Attribute title will be read by the reader of the browser.

  <div class="reponsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D1074%253A5192%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
