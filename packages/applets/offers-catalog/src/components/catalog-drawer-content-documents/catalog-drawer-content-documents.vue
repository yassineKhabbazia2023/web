<template>
  <ul
    class="list-style-none"
  >
    <li
      v-for="({ categoryLabel, documents }, categoryindex) in internalCategories"
      :key="categoryindex"
    >
      <div
        class="
          font-base
          font-semibold
          padding-y--5
        "
      >
        {{ categoryLabel }}
      </div>
      <div
        class="
          flex
          flex-gap--4
          flex--wrap
        "
      >
        <a
          v-for="({ documentName, link }, documentIndex) in documents"
          :key="`${categoryindex}-${documentIndex}`"
          :href="link"
          target="_blank"
          rel="noopener noreferrer"
          class="
            font-small
            font-semibold
          "
        >
          <div
            class="
              catalog-drawer-content-documents__image-wrapper
              position--relative
            "
          >
            <POverlay
              pHasOverEffect
              pBackgroundColor="neutral-gray-900"
              pIsVignette
              class="position--absolute"
            >
              <div
                class="
                  margin-top--7
                  bg--base-blue-pulse
                  text-color--base-white
                  padding--2
                  flex
                  flex--align-items-center
                "
              >
                <PIcon
                  pName="search"
                  pSize="16px"
                />
              </div>
            </POverlay>
            <PImage
              pName="offers-catalog-document"
              :alt="documentName"
            />
          </div>
          <div
            class="padding-top--2"
          >
            {{ documentName }}
          </div>
        </a>
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { POverlay, PIcon, PImage } from '@pulse/styleguide/components'
import type { CatalogDrawerContentDocumentsProps, InternalCategory } from './catalog-drawer-content-documents.types'
import { AmplitudeService } from '@pulse/common/services/amplitude'

const props = defineProps<CatalogDrawerContentDocumentsProps>()

const internalCategories = computed(() => {
  return (props.offerDocuments ?? [])
    .reduce((categories, offerDocument) => {
      const category = categories.find(({ categoryLabel }) => categoryLabel === offerDocument.category)
      if (category === undefined) {
        categories.push({
          categoryLabel: offerDocument.category,
          documents: [offerDocument],
        })
      } else {
        category.documents.push(offerDocument)
      }

      return categories
    }, [] as InternalCategory[])
})

onMounted(() => {
  AmplitudeService.track('Offer Detail Consulted', {
    offer_detail_consulted_tab: "Document de l'offre",
  })
})
</script>

<style lang="scss" scoped>
.catalog-drawer-content-documents{
  &__image-wrapper {
    height: 93px;
    width: 142px;
  }
}
</style>
