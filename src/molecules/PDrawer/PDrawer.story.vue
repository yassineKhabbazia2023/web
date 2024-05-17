<template>
  <Story
    title="3. Molecules/Drawer"
    :layout="{
      type: 'single',
      iframe: true
    }"
  >
    <div class="container">
      <Variant title="Drawer">
        <PButton
          pPlain
          pType="primary"
          @click="pDrawerControl.openDrawer = !pDrawerControl.openDrawer"
        >
          Open /close
        </PButton>
        <PDrawer
          v-model="pDrawerControl.openDrawer"
          :pTitle="pDrawerControl.title"
          :pShowPreviousStep="pDrawerControl.showPreviousStep"
          :pSize="pDrawerControl.size"
          :pDirection="pDrawerControl.direction"
          :pSuffixUnderTitle="pDrawerControl.pSuffixUnderTitle"
          @close-drawer-button="pDrawerControl.openDrawer = false"
          :pBreadcrumb="generateBreadCrumbItems(7)"
        >
          <template v-if="pDrawerControl.showHeaderPrefix" #header-prefix>
            <p class="drawer__header-prefix-text font-base">
              Second title example
            </p>
          </template>
          <template v-if="pDrawerControl.showHeaderSuffix" #header-suffix>
            <div class="drawer__header-suffix margin-left--3">
              <PIcon color="#5546FF" size="16">
                <PILink45deg />
              </PIcon>
              <a
                class="drawer__header-suffix-link font-base link margin-left--1"
                href="#"
              >
                Link example
              </a>
            </div>
          </template>
        </PDrawer>
        <template #controls>
          <HstText v-model="pDrawerControl.title" title="Title" />
          <HstRadio
            v-model="pDrawerControl.size"
            title="Size"
            :options="radioSizeOptions"
          />
          <HstRadio
            v-model="pDrawerControl.direction"
            title="Open direction"
            :options="radioDirectionOptions"
          />
          <HstCheckbox
            v-model="pDrawerControl.showPreviousStep"
            title="Show previous button"
          />
          <HstCheckbox
            v-model="pDrawerControl.openDrawer"
            title="Drawer visibility"
          />
          <HstCheckbox
            v-model="pDrawerControl.showHeaderPrefix"
            title="Header Prefix"
          />
          <HstCheckbox
            v-model="pDrawerControl.showHeaderSuffix"
            title="Header Suffix"
          />
          <HstCheckbox
            v-model="pDrawerControl.pSuffixUnderTitle"
            title="Header Suffix under title"
          />
        </template>
      </Variant>
      <Variant title="Drawer Top">
        <PButton
          pPlain
          pType="primary"
          @click="pDrawerControl.openDrawer = !pDrawerControl.openDrawer"
        >
          Open /close
        </PButton>
        <PDrawer
          v-model="pDrawerControl.openDrawer"
          :pTitle="pDrawerControl.title"
          pSize="100%"
          pDirection="ttb"
          pType="fullscreen"
          @close-drawer-button="pDrawerControl.openDrawer = false"
        >
          <template v-if="pDrawerControl.showHeaderPrefix" #header-prefix>
            <p class="drawer__header-prefix-text font-base">
              Second title example
            </p>
          </template>
          <template v-if="pDrawerControl.showHeaderSuffix" #header-suffix>
            <div class="drawer__header-suffix margin-left--3">
              <PIcon color="#5546FF" size="16">
                <PILink45deg />
              </PIcon>
              <a
                class="drawer__header-suffix-link font-base link margin-left--1"
                href="#"
              >
                Link example
              </a>
            </div>
          </template>
        </PDrawer>
        <template #controls>
          <HstText v-model="pDrawerControl.title" title="Title" />
          <HstCheckbox
            v-model="pDrawerControl.showHeaderPrefix"
            title="Header Prefix"
          />
          <HstCheckbox
            v-model="pDrawerControl.showHeaderSuffix"
            title="Header Suffix"
          />
        </template>
      </Variant>
      <Variant title="Drawer Mini">
        <PButton
          pPlain
          pType="primary"
          @click="pDrawerControl.openDrawer = !pDrawerControl.openDrawer"
        >
          Open /close
        </PButton>
        <PDrawer
          v-model="pDrawerControl.openDrawer"
          :pTitle="pDrawerControl.title"
          pDirection="ttb"
          pType="mini"
          modal
          @close-drawer-button="pDrawerControl.openDrawer = false"
        >
          <template v-if="pDrawerControl.showHeaderPrefix" #header-prefix>
            <p class="drawer__header-prefix-text font-base">
              Second title example
            </p>
          </template>
          <template v-if="pDrawerControl.showHeaderSuffix" #header-suffix>
            <div class="drawer__header-suffix margin-left--3">
              <PIcon color="#5546FF" size="16">
                <PILink45deg />
              </PIcon>
              <a
                class="drawer__header-suffix-link font-base link margin-left--1"
                href="#"
              >
                Link example
              </a>
            </div>
          </template>
          <p class="padding-bottom--4">
            "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
            voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati
            cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est
            laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore,
            cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus,
            omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis
            aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
            Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur
            aut perferendis doloribus asperiores repellat."
          </p>
          <p>
            "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
            voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati
            cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est
            laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore,
            cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus,
            omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis
            aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
            Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur
            aut perferendis doloribus asperiores repellat."
          </p>
          <template #footer>
            <PButton
              pType="primary"
              pPlain
              @click="pDrawerControl.openDrawer = !pDrawerControl.openDrawer"
            >
              Fermer
            </PButton>
          </template>
        </PDrawer>
        <template #controls>
          <HstText v-model="pDrawerControl.title" title="Title" />
          <HstCheckbox
            v-model="pDrawerControl.showHeaderPrefix"
            title="Header Prefix"
          />
          <HstCheckbox
            v-model="pDrawerControl.showHeaderSuffix"
            title="Header Suffix"
          />
        </template>
      </Variant>
    </div>
  </Story>
</template>

<script setup lang="ts">
import PDrawer from '.'
import PButton from '@/atoms/PButton'
import { reactive, ref } from 'vue'
import type { PDrawerProps } from './PDrawerTypes'
import type { BreadcrumbItems } from '@/molecules/PBreadcrumb/PBreadcrumbTypes'

const pDrawerControl = reactive({
  title: 'Title',
  direction: ref<PDrawerProps['pDirection']>('rtl'),
  showPreviousStep: false,
  size: '33%',
  openDrawer: false,
  showHeaderPrefix: false,
  showHeaderSuffix: false,
  pSuffixUnderTitle: false,
})

const generateBreadCrumbItems = (numberOfItems: number) => {
  const breadcrumbItems: BreadcrumbItems[] = []
  for (let i = 0; i < numberOfItems; i++) {
    breadcrumbItems.push({ pId: i, pText: `Lorem ${i}` })
  }
  return breadcrumbItems
}

const radioDirectionOptions: { label: string, value: string }[] = [
  {
    label: 'Right to left',
    value: 'rtl',
  },
  {
    label: 'Left to right',
    value: 'ltr',
  },
  {
    label: 'Top to bottom',
    value: 'ttb',
  },
]

const radioSizeOptions: { label: string, value: string }[] = [
  {
    label: '33%',
    value: '33%',
  },
  {
    label: '50%',
    value: '50%',
  },
]
</script>

<style lang="scss" scoped>
.drawer__header-suffix {
  display: flex;
  align-items: center;

  &-link {
    color: var(--el-color-persian-500);
    font-weight: 600;
    text-decoration: underline;
  }
}
.drawer__header-prefix-text {
  color: var(--el-color-neutral-gray-500);
}
</style>

<docs lang="md">
  ## Drawer Attributes

  This component is used for drawer.

  | Name             | Description                           | Type      | Accepted Values   | Default |
  | ---------------- | ------------------------------------- | --------- | ----------------- | ------- |
  | pTitle           | Drawer title                          | `String`  |                   |         |
  | pDirection       | Define the drawer direction opening   | `String`  | `rtl` or `ltr`    | `rtl`   |
  | showPreviousStep | Hide or show the previous step button | `Boolean` | `true` or `false` | `false` |
  | pSize            | The width of drawer when opened       | `String`  | `33%` or `50%`    | `33%`   |
  | pShowClose       | The el drawer close button visibility | `String`  | `33%` or `50%`    | `33%`   |
  | pSuffixUnderTitle| Props to put suffix under title       | `Boolean` | `33%` or `50%`    | `33%`   |

  ## Drawer Slots

  | Name            | Description                     |
  | --------------- | ------------------------------- |
  | `default`       | Drawer content                  |
  | `header-prefix` | Customize header prefix content |
  | `header-suffix` | Customize header suffix content |
  | `footer       ` | Customize footer content        |

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D1703%253A12592%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
