<template>
  <ul class="list-style-none">
    <li
      v-for="principalContact in principalContacts"
      :key="principalContact.contactId"
      class="margin-bottom--6"
    >
      <PrincipalContact
        :principalContact="principalContact"
        data-testid="subscription-details-principal-contact"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import PrincipalContact from '@/pages/entities/components/PrincipalContact'
import type { CustomersDetailsProps } from './CustomersDetailsTypes'

defineProps<CustomersDetailsProps>()
</script>
