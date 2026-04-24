<template>
  <section
    class="
      widget-contacts
      height--100
      flex
      flex--direction-column
      flex-gap--4
    "
    data-testid="widget-contacts"
  >
    <PTitle :pTitle="t('widgets.contacts.title')" />

    <div
      class="
        flex
        flex--direction-column
        flex-gap--2
      "
    >
      <PUserActionCard
        v-for="contact in cards"
        :key="contact.email"
        :pAvatarProps="contact.pAvatarProps ?? DEFAULT_AVATAR_PROPS"
        :pTopLeftSectionText="getFullNameWithUppercaseLastName(contact.firstname, contact.lastname)"
        :pTopLeftSubText="contact.role"
        class="padding--2"
      >
        <template #avatar>
          <PIcon
            v-if="contact.iconName !== undefined"
            :pName="contact.iconName"
          />
          <template v-else>
            {{ getInitials(contact.firstname, contact.lastname) }}
          </template>
        </template>
        <template #actions>
          <div
            class="
              flex
              flex--align-items-center
              flex-gap--2
            "
          >
            <PTooltip :pContent="tooltipContent(contact.phoneNumber)">
              <PButton
                pIconOnly
                pType="default"
                pSize="small"
                @click="copyValueToClipboard(contact.phoneNumber)"
              >
                <PIcon pName="telephone" />
              </PButton>
            </PTooltip>
            <PTooltip :pContent="tooltipContent(contact.email)">
              <PButton
                pIconOnly
                pType="default"
                pSize="small"
                @click="copyValueToClipboard(contact.email)"
              >
                <PIcon pName="send" />
              </PButton>
            </PTooltip>
          </div>
        </template>
      </PUserActionCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PButton, PIcon, PTitle, PTooltip, PUserActionCard } from '@pulse/styleguide/components'
import { AvatarRoles, displayNotification } from '@pulse/styleguide'
import { SUPPORT_EMAIL_CLIENT, SUPPORT_PHONE_CLIENT } from '@pulse/common/constants'
import { getFullNameWithUppercaseLastName, getInitials } from '@pulse/common/utils'
import { copyToClipboard } from '@pulse/toolbox/utils/browser'
import type { PAvatarProps } from '@pulse/styleguide/types'
import type { ContactsWidgetProps, WidgetContact } from './contact.widget.types'

const COPIED_FEEDBACK_DURATION_MS = 1000

const DEFAULT_AVATAR_PROPS: PAvatarProps = {
  pType: 'default',
  pRole: AvatarRoles.COLLAB,
  pShape: 'circle',
}

const SUPPORT_AVATAR_PROPS: PAvatarProps = {
  pType: 'default',
  pColor: 'blue-pulse',
  pShape: 'circle',
}

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const supportContact = computed<WidgetContact>(() => ({
  firstname: t('widgets.contacts.supportFirstname'),
  lastname: t('widgets.contacts.supportLastname'),
  role: t('widgets.contacts.supportSubtitle'),
  phoneNumber: SUPPORT_PHONE_CLIENT,
  email: SUPPORT_EMAIL_CLIENT,
  iconName: 'headset',
  pAvatarProps: SUPPORT_AVATAR_PROPS,
}))

const props = withDefaults(defineProps<ContactsWidgetProps>(), {
  contacts: () => [],
})

const cards = computed<WidgetContact[]>(() => [...props.contacts, supportContact.value])

const lastCopiedValue = ref<string | null>(null)
let copiedResetTimeoutId: ReturnType<typeof setTimeout> | null = null

const tooltipContent = (value: string): string =>
  (lastCopiedValue.value === value ? t('widgets.contacts.copied') : value)

const copyValueToClipboard = async (value: string): Promise<void> => {
  const hasCopied = await copyToClipboard(value)
  if (hasCopied === false) {
    displayNotification('error', t('widgets.contacts.copyError'))
    return
  }
  lastCopiedValue.value = value
  if (copiedResetTimeoutId !== null) {
    clearTimeout(copiedResetTimeoutId)
  }
  copiedResetTimeoutId = setTimeout(() => {
    if (lastCopiedValue.value === value) {
      lastCopiedValue.value = null
    }
    copiedResetTimeoutId = null
  }, COPIED_FEEDBACK_DURATION_MS)
}

onBeforeUnmount(() => {
  if (copiedResetTimeoutId !== null) {
    clearTimeout(copiedResetTimeoutId)
  }
})
</script>
