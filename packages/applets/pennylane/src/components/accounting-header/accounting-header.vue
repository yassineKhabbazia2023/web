<template>
  <div
    class="position--relative"
  >
    <div
      class="
        position--absolute
        height--12
        width--100
        flex
        flex--justify-content-flex-end
        z-index-1000
      "
    >
      <PButton
        pPlain
        pIconOnly
        pSize="small"
        class="
          text-color--base-white
          padding-right--0
          padding-top--0
        "
        @click="emit('close')"
      >
        <PIcon
          pName="x"
          pSize="12"
        />
      </PButton>
    </div>
    <div
      class="
      flex
      bg--jungle-50
      accounting-header
    "
    >
      <div
        class="
          padding--6
          flex--basis-66
          flex--grow-1
        "
      >
        <i18n-t
          tag="h2"
          keypath="title.your"
          class="h2 text-color--black-rock-900"
        >
          <template #space>
            <span
              class="text-color--jungle-400"
            >
              {{ t('title.space') }}
            </span>
          </template>
        </i18n-t>

        <div>{{ t('explanations') }}</div>
        <ul
          class="
            list-style-none
            padding-left--1
            margin-top--2
          "
        >
          <i18n-t
            v-for="(line, index) in lines"
            :key="index"
            tag="li"
            :keypath="line.keypath1"
          >
            <template #place>
              <span
                class="font-semibold"
              >{{ t(line.keypath2) }}</span>
            </template>
          </i18n-t>
        </ul>
      </div>
      <div
        class="
          pennylane-card__right-section
          position--relative
          overflow-hidden
          flex--basis-33
          bg--partner-pennylane-dark-green
        "
      >
        <div
          class="
            flex
            flex--justify-content-flex-start
            padding-top--8
            padding-left--10
          "
        >
          <PImage
            pName="rydge-logo"
            class="
              height--8
              flex--grow-0
              width--inherit
            "
          />
          <PImage
            pName="pennylane-logo"
            class="
              height--6
              width--inherit
              padding-x--4
              margin-left--4
              border-left
              border-left--white
            "
          />
        </div>
        <PImage
          pName="pennylane-header-illustration"
          class="
            position--absolute
            margin-top--4
            margin-left--4
          "
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PImage, PButton, PIcon } from '@pulse/styleguide/components'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emit = defineEmits<{
  close: []
}>()

const lines = [{
  keypath1: 'line1.text',
  keypath2: 'line1.place',
}, {
  keypath1: 'line2.text',
  keypath2: 'line2.place',
}, {
  keypath1: 'line3.text',
  keypath2: 'line3.place',
}]
</script>

<i18n lang="yaml">
  en-US:
    title:
      your: 'Your {space} changes'
      space: 'documentary space'
    explanations: >
        As you've probably noticed, our platform is evolving and becoming simpler!
        From now on, everything is organized so you can find your documents more quickly and easily:
    line1:
  fr-FR:
    title:
      your: 'Votre {space} change'
      space: 'espace documentaire'
    explanations: >
      Comme vous l’avez sûrement remarqué, notre plateforme évolue et se simplifie !
      Désormais, tout est organisé pour que vous retrouviez vos documents plus rapidement et facilement :
    line1:
      text: >
        • Dans {place} :
        accédez à tous les documents produits par votre expert RYDGE Conseil (bilan, déclarations de TVA,..)
      place: '"Documents RYDGE Conseil"'
    line2:
      text: >
        • Dans {place} :
        retrouvez tous vos anciens documents comptables, déposés avant l’arrivée de Pennylane.
      place: '"Archives"'
    line3:
      text: >
        • Sur {place} :
        consultez les documents que vous avez déposés depuis la mise en place de l’outil.
      place: Pennylane
</i18n>
