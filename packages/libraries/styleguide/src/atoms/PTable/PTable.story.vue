<template>
  <Story
    title="2. Atoms/Table"
    icon="teenyicons:table-outline"
    :layout="{ type: 'grid', width: '80%' }"
  >
    <Variant title="PTable basic">
      <PTable :pData="tableInputs.data" :pStripe="tableInputs.striped">
        <PTableColumn
          v-if="tableInputs.selectable"
          type="selection"
        />
        <PTableColumn
          v-for="column in tableInputs.tableColumn"
          :key="column.prop"
          :pProp="column.prop"
          :pLabel="column.label"
          :pWidth="column.width"
          :pSortable="tableInputs.sortable"
        />
      </PTable>
      <template #controls>
        <HstCheckbox v-model="tableInputs.striped" title="Striped" />
        <HstCheckbox v-model="tableInputs.sortable" title="Sortable" />
        <HstCheckbox v-model="tableInputs.selectable" title="Selectable" />
      </template>
    </Variant>
    <Variant title="PTable advanced">
      <PTable
        :pData="tableInputsWithCells.data"
        :pStripe="tableInputsWithCells.striped"
        fit
      >
        <PTableColumn
          v-if="tableInputsWithCells.selectable"
          type="selection"
        />
        <PTableColumn
          pLabel="Text"
          pWidth="180"
          :pSortMethod="sortMethodsText"
          :pSortable="tableInputsWithCells.sortable"
        >
          <template #default="scope">
            <PText
              :pContent="scope.row.text.content"
              :pIconName="scope.row.text.iconName"
              :pBold="false"
              :pType="scope.row.text.type"
              :disabled="false"
              :selected="false"
            />
          </template>
        </PTableColumn>
        <PTableColumn
          pLabel="Entity"
          pWidth="220"
          :pSortMethod="sortMethodsEntity"
          :pSortable="tableInputsWithCells.sortable"
        >
          <template #default="scope">
            <PEntity
              :pContent="scope.row.entity.name"
              :pIconName="scope.row.entity.iconName"
              :pType="scope.row.entity.type"
              :pSelected="false"
            />
          </template>
        </PTableColumn>
        <PTableColumn
          pLabel="Double Text"
          pWidth="180"
          :pSortMethod="sortMethodsDoubleText"
          :pSortable="tableInputsWithCells.sortable"
        >
          <template #default="scope">
            <PDoubleText
              :pIconName="scope.row.doubleText.iconName"
              :pProfile="scope.row.doubleText.profile"
              :pTitle="scope.row.doubleText.title"
              :pContent="scope.row.doubleText.content"
              :pType="scope.row.doubleText.type"
              :pDisabled="false"
              :pSelected="false"
            />
          </template>
        </PTableColumn>
        <PTableColumn
          pLabel="Tag"
          pWidth="180"
          :pSortMethod="sortMethodsTags"
          :pSortable="tableInputsWithCells.sortable"
        >
          <template #default="scope">
            <PTag
              pColor="success"
              pSize="default"
              pEffect="light"
              :pIconLeftName="scope.row.tag.iconLeftName"
              :pIconRightName="scope.row.tag.iconRightName"
              :pContent="scope.row.tag.content"
            />
          </template>
        </PTableColumn>
        <PTableColumn
          pLabel="Switch"
        >
          <template #default="scope">
            <PSwitch v-model="scope.row.switch.status" :disabled="scope.row.switch.disabled" />
          </template>
        </PTableColumn>
        <PTableColumn
          pLabel="Smalls buttons"
          pWidth="300"
        >
          <template #default>
            <PButton
              type="primary"
              size="small"
              plain
              class="margin-right--2"
            >
              Button label
            </PButton>
            <PButton
              type="primary"
              size="small"
              plain
              class="margin-right--2"
            >
              Button label
            </PButton>
            <PButton
              type="primary"
              size="small"
              class="margin-right--2"
            >
              Button label
            </PButton>
          </template>
        </PTableColumn>
      </PTable>
      <template #controls>
        <HstCheckbox v-model="tableInputsWithCells.striped" title="Striped" />
        <HstCheckbox v-model="tableInputsWithCells.sortable" title="Sortable" />
        <HstCheckbox v-model="tableInputsWithCells.selectable" title="Selectable" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import PDoubleText from '../../atoms/PDoubleText'
import PEntity from '../../atoms/PEntity'
import PTag from '../../atoms/PTag'
import PText from '../../atoms/PText'
import PButton from '../../atoms/PButton'
import PSwitch from '../../atoms/PSwitch'
import PTable from './'
import PTableColumn from '../../atoms/PTableColumn'

const tableInputs = reactive({
  data: [
    {
      date: '2016-05-03',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-02',
      name: 'Jean',
      address: 'No. 12, Park Av, San Francisco',
    },
    {
      date: '2016-05-04',
      name: 'Angelo',
      address: 'No. 28, Levage St, NYC',
    },
    {
      date: '2016-05-01',
      name: 'Patrick',
      address: 'Appt. 522, No. 32, Churchill Blv, Los Angeles',
    },
  ],
  tableColumn: [
    {
      prop: 'date',
      label: 'Date',
      width: 180,
    },
    {
      prop: 'name',
      label: 'Name',
      width: 180,
    },
    {
      prop: 'address',
      label: 'Address',
    },
  ],
  striped: true,
  sortable: true,
  selectable: true,
})

const tableInputsWithCells = reactive({
  data: [
    {
      text: {
        content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea',
        iconName: 'cupHot',
        type: 'primary',
      },
      entity: {
        iconName: 'building',
        name: 'Lorem Ipsum Factory',
      },
      doubleText: {
        iconName: 'cupHot',
        profile: 'JL',
        title: 'Lorem ipsum',
        content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea',
        type: 'primary',
      },
      tag: {
        content: 'Validated',
        iconLeftName: 'folder',
        iconRightName: 'stars',
      },
      switch: {
        status: true,
        disabled: false,
      },
    },
    {
      text: {
        content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea',
        iconName: 'cupHot',
        type: 'primary',
      },
      entity: {
        iconName: 'pulse',
        name: 'Olympia Stadium',
        type: 'primary',
      },
      doubleText: {
        iconName: 'cupHot',
        profile: 'JL',
        title: 'Lorem ipsum',
        content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea',
        type: 'primary',
      },
      tag: {
        content: 'Validated',
        iconLeftName: 'folder',
        iconRightName: 'stars',
      },
      switch: {
        status: false,
        disabled: false,
      },
    },
    {
      text: {
        content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea',
        iconName: 'cupHot',
        type: 'primary',
      },
      entity: {
        iconName: 'cupStraw',
        name: 'Baquery',
      },
      doubleText: {
        iconName: 'cupHot',
        profile: 'JL',
        title: 'Lorem ipsum',
        content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea',
        type: 'primary',
      },
      tag: {
        content: 'Validated',
        iconLeftName: 'folder',
        iconRightName: 'stars',
      },
      switch: {
        status: true,
        disabled: false,
      },
    },
    {
      text: {
        content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea',
        iconName: 'cupHot',
        type: 'primary',
      },
      entity: {
        iconName: 'shop',
        name: 'Lorem Ipsum Factory',
      },
      doubleText: {
        iconName: 'cupHot',
        profile: 'JL',
        title: 'Restaurant Alfredo\'s House',
        content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea',
        type: 'primary',
      },
      tag: {
        content: 'Validated',
        iconLeftName: 'folder',
        iconRightName: 'stars',
      },
      switch: {
        status: true,
        disabled: true,
      },
    },
    {
      text: {
        content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea',
        iconName: 'cupHot',
        type: 'primary',
      },
      entity: {
        iconName: 'building',
        name: 'Neverland Swiming Pool',
      },
      doubleText: {
        iconName: 'cupHot',
        profile: 'JL',
        title: 'Lorem ipsum',
        content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea',
        type: 'primary',
      },
      tag: {
        content: 'Validated',
      },
      switch: {
        status: true,
        disabled: true,
      },
    },
  ],
  striped: true,
  sortable: true,
  selectable: true,
})

const sortMethodsText = (a: any, b: any) => a.text.content - b.text.content
const sortMethodsDoubleText = (a: any, b: any) => a.doubleText.content - b.doubleText.content
const sortMethodsTags = (a: any, b: any) => a.tag.content - b.tag.content
const sortMethodsEntity = (a: any, b: any) => a.entity.name - b.entity.name
</script>

<docs lang="md">
  ## Table
  Classe p-table__row--disabled disponible pour avoir l'effet disabled des lignes.
  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D605%253A2161%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
