<template>
  <div class="p-error-page">
    <div class="p-error-page__container">
      <div class="p-error-block">
        <PImage
          pType="splash"
          pName="background-error-page"
          class="p-error-block__splash hidden-sm-and-down"
        />
        <div class="p-error-block__content shadow--6 radius--4 shadow--6 bg--base-white flex">
          <div class="p-error-block__left">
            <div class="p-error-block__logo hidden-sm-and-down">
              <PImage pType="logos" pName="pulse-color" />
            </div>
            <div class="p-error-block__error-content">
              <h1 v-if="$slots.title" class="p-error-block__title">
                <slot name="title" />
              </h1>
              <p
                class="p-error-block__description text-color--neutral-gray-700"
              >
                {{ pDescription }}
              </p>
              <div class="p-error-block__button">
                <PButton
                  pType="primary"
                  data-testid="error-block-button"
                  @click="$emit('handleClick')"
                >
                  {{ pButtonText }}
                </PButton>
              </div>
            </div>
            <p class="p-error-block__error-type text-color--neutral-gray-500">
              <span class="font-semibold p-error-block__error-name">{{ pErrorName }}</span>
              <span class="padding-x--1">—</span>
              <span class="p-error-block__error-text">{{ pErrorText }}</span>
            </p>
          </div>
          <div class="p-error-block__right">
            <PImage
              class="p-error-block__image"
              pType="paupulse"
              :pName="pIllustrationName"
            />
          </div>
        </div>
      </div>
      <div v-if="$slots.footer" class="p-error-page__footer text-center">
        <slot name="footer" />
      </div>
    </div>
    <div class="p-error-page__logo">
      <PImage pType="logos" pName="kpmg-color" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import PImage from '../../atoms/PImage'
import PButton from '../../atoms/PButton'
import type { PErrorBlockProps } from './PErrorTypes'

defineProps<PErrorBlockProps>()

defineEmits<{
  handleClick: []
}>()
</script>

<style lang="scss" scoped>
.p-error-page {
  position: relative;
  width: 100%;
  min-height: 100%;
  padding: 1.6rem 0 3.2rem;
  background: var(--el-color-persian-50);

  @media screen and (min-width: 992px) {
    padding: 10rem 0 3.2rem;
    height: 100%;
    min-height: 0;
    overflow: hidden;
  }

  &__container {
    padding: 0 1.6rem;

    @media screen and (min-width: 992px) {
      width: 740px;
      padding: 0;
      margin: 0 auto;
    }

    @media screen and (min-width: 1440px) {
      width: 920px;
    }
  }
  &__logo {
    width: 76px;
    margin: 2.4rem auto 0;

    @media screen and (min-width: 992px) {
      position: absolute;
      bottom: 32px;
      right: 32px;
      width: 100px;
      margin: 0;
    }
  }

  &__footer {
    @media screen and (min-width: 992px) and (min-height: 700px) {
      position: absolute;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
.p-error-block {
  position: relative;
  z-index: 0;
  margin-bottom: 2.4rem;

  &__content {
    flex-direction: column-reverse;
    z-index: 0;
    @media screen and (min-width: 992px) {
      flex-direction: row;
      align-items: stretch;
    }
  }

  &__splash {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%);
    width: 1463px;
    height: 1576px;
    z-index: -1;

    @media screen and (min-width: 1440px) {
      transform: translateY(calc(-50% - 30px));
    }
  }

  &__logo {
    width: 146px;
  }
  &__left {
    padding: 1.6rem 1.6rem 1.6rem 3.2rem;
    @media screen and (min-width: 992px) {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 50%;
      padding: 3.2rem;
    }
  }

  &__title {
    margin-bottom: 1.2rem;
    @media screen and (min-width: 992px) {
      margin-bottom: 2.4rem;
    }
  }

  &__description {
    margin-bottom: 2.4rem;
    @media screen and (min-width: 992px) {
      margin-bottom: 5.6rem;
    }
  }

  &__button {
    margin-bottom: 1.6rem;
  }

  &__right {
    padding: 1.2rem 0 2rem;
    background: url('/src/assets/images/splash/background-error-block-mobile.svg')
      no-repeat;
    background-position: calc(50% - 70px) bottom;
    background-size: 668px 620px;

    @media screen and (min-width: 992px) {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 50%;
      padding: 144px 25px 170px 0;
      background: url('/src/assets/images/splash/background-error-block.svg') no-repeat;
      background-position: left center;
      background-size: 1463px 1576px;
      border-radius: 0 16px 16px 0;
      overflow: hidden;
    }

    @media screen and (min-width: 992px) and (max-height: 700px) {
      padding: 94px 25px 120px 0;
    }

    @media screen and (min-width: 1440px) {
      padding: 93px 20px 246px 0;
      background-position: left calc(50% - 30px);
    }
    @media screen and (min-width: 1980px) {
      padding: 103px 70px 237px 0;
    }
  }

  &__image {
    height: 84px;
    width: auto;
    text-align: center;
    @media screen and (min-width: 992px) {
      height: 204px;
    }
    @media screen and (min-width: 1440px) {
      height: 273px;
    }
  }
}
</style>
