<template>
  <Story
    title="2. Atoms/Table"
    icon="teenyicons:table-outline"
    :layout="{ type: 'grid', width: '80%' }">
    <Variant title="PTable basic">
      <PTable :pData="tableInputs.data" :pStripe="tableInputs.striped">
        <PTableColumn
          type="selection"
          v-if="tableInputs.selectable"
        />
        <PTableColumn
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
    <Variant title="PTable advanced">
      <PTable
        :pData="tableInputsWithCells.data"
        :pStripe="tableInputsWithCells.striped"
        fit
      >
        <PTableColumn
          type="selection"
          v-if="tableInputsWithCells.selectable"
        />
          v-if="tableInputsWithCells.selectable"
        />
        <PTableColumn
          label="Text"
          width="180"
          :sortable="tableInputsWithCells.sortable"
        >
          <template #default="scope">
            <PText
              :pContent="scope.row.text.content"
              :pIcon="iconResolver(scope.row.text.icon)"
              :pBold="false"
              :pType="scope.row.text.type"
              :disabled="false"
              :selected="false"
            >
           </PText>
          </template>
        </PTableColumn>
        <PTableColumn
          label="Entity"
          width="220"
          :sortable="tableInputsWithCells.sortable"
        >
          <template #default="scope">
            <PEntity
              :pContent="scope.row.entity.name"
              :pIcon="iconResolver(scope.row.entity.icon)"
              :pType="scope.row.entity.type"
              :pSelected="false"
            >
            </PEntity>
          </template>
        </PTableColumn>
        <PTableColumn
          label="Double Text"
          width="180"
          :sortable="tableInputsWithCells.sortable"
        >
          <template #default="scope">
            <PDoubleText
              :pIcon="iconResolver(scope.row.doubleText.icon)"
              :pProfile="scope.row.doubleText.profile"
              :pTitle="scope.row.doubleText.title"
              :pContent="scope.row.doubleText.content"
              :pType="scope.row.doubleText.type"
              :pDisabled="false"
              :pSelected="false"
            >
            </PDoubleText>
          </template>
        </PTableColumn>
        <PTableColumn
          label="Tag"
          width="180"
          :sortable="tableInputsWithCells.sortable"
          >
          <template #default="scope">
            <PTag
              pColor="success"
              pSize="default"
              pEffect="light"
              :pIconLeft="scope.row.tag.iconLeft"
              :pIconRight="scope.row.tag.iconRight"
              :pContent="scope.row.tag.content"
            >
            </PTag>
          </template>
        </PTableColumn>
        <PTableColumn
          label="Switch"
        >
          <template #default="scope">
            <PSwitch v-model="scope.row.switch.status" :disabled="scope.row.switch.disabled" />
          </template>
        </PTableColumn>
        <PTableColumn
          label="Smalls buttons"
          width="300"
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
import { reactive, ref } from 'vue'
import { iconResolver } from '@/utils/iconResolver'
import { PIFolder, PIStars } from '@/atoms/PIcon/components'
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

const tableInputsWithCells = reactive({
  data: [
    {
      text: {
        content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea',
        icon: 'PICupHot',
        type: 'primary'
      },
      entity: {
        icon: 'PIBuilding',
        name: 'Lorem Ipsum Factory'
      },
      doubleText: {
        icon: 'PICupHot',
        profile: 'JL',
        title: 'Lorem ipsum',
        content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea',
        type: 'primary'
      },
      tag: {
        content: 'Validated',
        iconLeft: PIFolder,
        iconRight: PIStars
      },
      switch: {
        status: ref(true),
        disabled: false
      }
    },
    {
      text: {
        content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea',
        icon: 'PICupHot',
        type: 'primary'
      },
      entity: {
        icon: 'PIPulse',
        name: 'Olympia Stadium',
        type: 'primary'
      },
      doubleText: {
        icon: 'PICupHot',
        profile: 'JL',
        title: 'Lorem ipsum',
        content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea',
        type: 'primary'
      },
      tag: {
        content: 'Validated',
        iconLeft: PIFolder,
        iconRight: PIStars
      },
      switch: {
        status: ref(false),
        disabled: false
      }
    },
    {
      text: {
        content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea',
        icon: 'PICupHot',
        type: 'primary'
      },
      entity: {
        icon: 'PICupStraw',
        name: 'Baquery'
      },
      doubleText: {
        icon: 'PICupHot',
        profile: 'JL',
        title: 'Lorem ipsum',
        content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea',
        type: 'primary'
      },
      tag: {
        content: 'Validated',
        iconLeft: PIFolder,
        iconRight: PIStars
      },
      switch: {
        status: ref(true),
        disabled: false
      }
    },
    {
      text: {
        content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea',
        icon: 'PICupHot',
        type: 'primary'
      },
      entity: {
        icon: 'PIShop',
        name: 'Lorem Ipsum Factory'
      },
      doubleText: {
        icon: 'PICupHot',
        profile: 'JL',
        title: 'Restaurant Alfredo\'s House',
        content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea',
        type: 'primary'
      },
      tag: {
        content: 'Validated',
        iconLeft: PIFolder,
        iconRight: PIStars
      },
      switch: {
        status: ref(true),
        disabled: true
      }
    },
    {
      text: {
        content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea',
        icon: 'PICupHot',
        type: 'primary'
      },
      entity: {
        icon: 'PIBuilding',
        name: 'Neverland Swiming Pool'
      },
      doubleText: {
        icon: 'PICupHot',
        profile: 'JL',
        title: 'Lorem ipsum',
        content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea',
        type: 'primary'
      },
      tag: {
        content: 'Validated'
      },
      switch: {
        status: ref(false),
        disabled: true
      }
    }
  ],
  striped: true,
  sortable: true,
  selectable: true
})
</script>

<docs lang="md">
  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D605%253A2161%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
