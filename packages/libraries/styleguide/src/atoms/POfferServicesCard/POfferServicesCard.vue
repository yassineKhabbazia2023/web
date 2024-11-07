<template>
  <div class="p-offer-services-card radius--1 shadow--3 padding--4">
    <div class="p-offer-services-card__offer margin-bottom--3">
      <PImage
        class="p-offer-services-card__logo"
        pType="logos"
        :pName="pLogo"
        pFit="fill"
      />
      <p class="p-offer-services-card__title font-large font-normal margin-left--3">
        {{ pTitle }}
      </p>
    </div>
    <div class="p-offer-services-card__services">
      <div
        v-for="(service, index) in pServices"
        :key="index"
        :class="[
          ...getServiceClass(index),
          'padding-y--3',
          service.pDisabled ? 'p-offer-services-card__service--disabled' : ''
        ]"
      >
        <div class="p-offer-services-card__service-details">
          <PSwitch
            v-model="service.pStatus"
            class="p-offer-services-card__service-switch"
            :disabled="service.pDisabled"
            @change="$emit('changeServiceStatus', service)"
          />
          <!-- @TODO : change this by the active text of the switch
              when the component will be available -->
          <p class="p-offer-services-card__service-name font-semibold margin-left--4">
            {{ service.pName }}
          </p>
        </div>
        <PTag
          v-if="!!service.pTag"
          :pColor="service.pTag.pColor"
          pEffect="light"
          :pContent="service.pTag.pContent"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PImage from '@styleguide/atoms/PImage'
import PTag from '@styleguide/atoms/PTag'
import { ElSwitch as PSwitch } from 'element-plus'
import type { PService, POfferServicesCardProps } from './POfferServicesCardTypes'

const props = defineProps<POfferServicesCardProps>()
defineEmits<{
  changeServiceStatus: [PService]
}>()

const getServiceClass = (serviceIndex: number): string[] => {
  const services = props.pServices
  return (services.length > 0 && serviceIndex + 1 === services.length) ||
    services.length === 1
    ? ['p-offer-services-card__service']
    : [
        'p-offer-services-card__service',
        'p-offer-services-card__service--border',
        'margin-bottom--1',
      ]
}
</script>

<style lang="scss" scoped>
.p-offer-services-card {
  $self: &;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  flex-grow: 0;
  width: 100%;

  &__logo {
    width: 40px;
    height: 40px;
  }

  &__offer {
    display: flex;
    align-items: center;
  }

  &__services {
    display: flex;
    flex-direction: column;
  }

  &__service {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &--border {
      border-bottom: 1px solid var(--el-color-neutral-gray-100);
    }

    &--disabled {
      pointer-events: none;
    }

    &:hover,
    &:focus {
      #{$self}__service-details {
        color: var(--el-color-persian-500);
      }
    }
  }

  &__service-details {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    max-width: 70%;
    transition: all 0.3s ease;

    &__service-name {
      font-size: 1.4rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
