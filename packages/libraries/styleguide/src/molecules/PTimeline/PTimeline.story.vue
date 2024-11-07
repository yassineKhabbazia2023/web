<template>
  <Story
    title="3. Molecules/Timeline"
    icon="fluent:timeline-24-regular"
    :layout="{
      type: 'grid',
      width: 600,
    }"
  >
    <Variant title="Basic Usage">
      <PTimeline>
        <PTimelineItem
          pSize="normal"
        >
          <PHistoryCard
            pDate="03/03/2024"
            pType="Délégation"
            pEntityIcon="PIShop"
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
                  pType="generic"
                  pSize="default"
                  pIconOnly
                >
                  <PIcon>
                    <PITrash />
                  </PIcon>
                </PButton>
              </PTooltip>
            </template>
          </PHistoryCard>
        </PTimelineItem>
        <PTimelineItem
          pSize="normal"
        >
          <PHistoryCard
            pDate="03/03/2024"
            pType="Délégation"
            pEntityIcon="PIShop"
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
                  pType="generic"
                  pSize="default"
                  pIconOnly
                >
                  <PIcon>
                    <PITrash />
                  </PIcon>
                </PButton>
              </PTooltip>
            </template>
          </PHistoryCard>
        </PTimelineItem>
        <PTimelineItem
          pSize="normal"
        >
          <PHistoryCard
            pDate="03/03/2024"
            pType="Délégation"
            pEntityIcon="PIShop"
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
                  pType="generic"
                  pSize="default"
                  pIconOnly
                >
                  <PIcon>
                    <PITrash />
                  </PIcon>
                </PButton>
              </PTooltip>
            </template>
          </PHistoryCard>
        </PTimelineItem>
        <PTimelineItem
          pSize="normal"
        >
          <PHistoryCard
            pDate="03/03/2024"
            pType="Délégation"
            pEntityIcon="PIShop"
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
                  pType="generic"
                  pSize="default"
                  pIconOnly
                >
                  <PIcon>
                    <PITrash />
                  </PIcon>
                </PButton>
              </PTooltip>
            </template>
          </PHistoryCard>
        </PTimelineItem>
      </PTimeline>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import PHistoryCard from '@styleguide/atoms/PHistoryCard'
import PTooltip from '@styleguide/atoms/PTooltip'
import PButton from '@styleguide/atoms/PButton'
import PTimelineItem from '@styleguide/atoms/PTimelineItem'
import PTimeline from './'

</script>

<docs lang="md">
  ## Timeline

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D12742%253A4476%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
