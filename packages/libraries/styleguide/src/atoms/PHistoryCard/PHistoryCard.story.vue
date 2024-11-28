<template>
  <Story
    title="2. Atoms/HistoryCard"
    icon="mdi:clipboard-text-history-outline"
    :layout="{ type: 'grid', width: '700px' }"
  >
    <Variant title="Basic Usage">
      <div class="padding--3">
        <PHistoryCard
          pDate="03/03/2024"
          pType="Délégation"
          pEntityIconName="shop"
          pEntity="Restaurant Le Grand Bleu"
        >
          <template #text>
            <span class="font-bold">Corinne CAMPISCIANNO</span>
            a délégué le dossier à
            <span class="font-bold"> Ouassim HAYANI.</span>
          </template>
          <template #action>
            <PTooltip pContent="Supprimer la délégation">
              <PButton
                pSize="default"
                pIconOnly
              >
                <PIcon pName="trash" />
              </PButton>
            </PTooltip>
          </template>
        </PHistoryCard>
      </div>
    </Variant>
    <Variant title="Entity tooltip">
      <div class="padding--3">
        <PHistoryCard
          pDate="03/03/2024"
          pType="Délégation"
          pEntityIconName="shop"
          pEntity="3 dossiers"
          pTooltipEntityContent="Bateau, Voiture, Moto"
        >
          <template #text>
            <span class="font-bold">Corinne CAMPISCIANNO</span>
            a délégué le dossier à
            <span class="font-bold"> Ouassim HAYANI.</span>
          </template>
          <template #action>
            <PTooltip pContent="Supprimer la délégation">
              <PButton
                pSize="default"
                pIconOnly
              >
                <PIcon pName="trash" />
              </PButton>
            </PTooltip>
          </template>
        </PHistoryCard>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PButton from '../../atoms/PButton'
import PIcon from '../../atoms/PIcon'
import PTooltip from '../../atoms/PTooltip'
import PHistoryCard from '.'
</script>

<docs lang="md">
  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" width="800" height="450"
      src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D12590%253A2083%26mode%3Ddev">
    </iframe>
  </div>
</docs>
