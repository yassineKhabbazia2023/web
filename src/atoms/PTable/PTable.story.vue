<template>
  <Story
    title="Atoms/PTable"
    icon="teenyicons:table-outline"
    :layout="{ type: 'grid', width: '80%' }">
    <Variant title="PTable">
      <PTable :data="tableInputs.data" :stripe="tableInputs.striped">
        <el-table-column
        type="selection"
        v-if="tableInputs.selectable" />
        <el-table-column
          v-for="column in tableInputs.tableColumn"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :sortable="tableInputs.sortable"
        />
      </PTable>
      <template #controls>
        <HstCheckbox v-model="tableInputs.striped" title="Striped" />
        <HstCheckbox v-model="tableInputs.sortable" title="Sortable" />
        <HstCheckbox v-model="tableInputs.selectable" title="Selectable" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import PTable from './'

const tableInputs = reactive({
  data: [
    {
      date: '2016-05-03',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles'
    },
    {
      date: '2016-05-02',
      name: 'Jean',
      address: 'No. 12, Park Av, San Francisco'
    },
    {
      date: '2016-05-04',
      name: 'Angelo',
      address: 'No. 28, Levage St, NYC'
    },
    {
      date: '2016-05-01',
      name: 'Patrick',
      address: 'Appt. 522, No. 32, Churchill Blv, Los Angeles'
    }
  ],
  tableColumn: [
    {
      prop: 'date',
      label: 'Date',
      width: 180
    },
    {
      prop: 'name',
      label: 'Name',
      width: 180
    },
    {
      prop: 'address',
      label: 'Address'
    }
  ],
  striped: true,
  sortable: true,
  selectable: true
})
</script>
