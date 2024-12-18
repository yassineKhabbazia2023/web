<template>
  <PDoubleText
    v-if="fieldType === 'DoubleText'"
    pType="primary"
    :pDisabled="false"
    pProfile=""
    :pTitle="data.name"
    :pContent="getPathFromArray(data.path)"
    :pIconName="getIconName(data.name, 'fileText')"
    :pSelected="false"
  />
  <PText
    v-else-if="fieldType === 'Text'"
    :pContent="formatDateStr(data.deleted)"
    pType="primary"
    :pBold="false"
    :selected="false"
    :disabled="false"
  />
  <PIcon
    v-else-if="fieldType === 'ActionGroup'"
    style="cursor: pointer;"
    pName="arrowCounterclockwise"
    @click="$emit('restore-document-action', data)"
  />
</template>

<script setup lang="ts">
import { PText, PDoubleText, PIcon } from '@pulse/styleguide/components'
import { getIconName } from '@pulse/styleguide'
import type { BinTableElementProps } from './BinTableElementTypes'
import { getPathFromArray } from '@ged/modules/Documents/helpers/pathBuildingHelper'
import { formatDateStr } from '@ged/modules/common/helpers/dateFormatHelper'
import type { BinDocument } from '@ged/models/Document'
/* This component is meant to evolve so TableItem and BinTableItem can be used in one same component
The target is to be able to easily use any component whatever the context is.
Right now it's kind of an in between because the "table structure from the back end"
wasn't supposed to be a thing for now.
Still, having that in between for now is going to facilitate the transition to the final solution.
*/
defineProps<BinTableElementProps>()

defineEmits<{
  'restore-document-action': [BinDocument]
}>()
</script>

<style lang="scss" scoped>
.restore-icon {
  cursor: pointer;
}
</style>
