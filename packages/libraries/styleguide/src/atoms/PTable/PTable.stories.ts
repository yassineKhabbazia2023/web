import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { reactive } from 'vue'
import PTable from './PTable.vue'
import PTableColumn from '../PTableColumn/PTableColumn.vue'
import PText from '../PText/PText.vue'
import PEntity from '../PEntity/PEntity.vue'
import PDoubleText from '../PDoubleText/PDoubleText.vue'
import PTag from '../PTag/PTag.vue'
import PSwitch from '../PSwitch/PSwitch.vue'
import PButton from '../PButton/PButton.vue'

const meta: Meta<typeof PTable> = {
  title: 'Atoms/PTable',
  component: PTable as unknown as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Tableau avec colonnes simples et cellules personnalisées.',
      },
    },
  },
  argTypes: {
    pData: { control: false, description: 'Données du tableau' },
    pStripe: { control: 'boolean', description: 'Lignes alternées' },
  },
}

export default meta
export type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => ({
    components: { PTable, PTableColumn },
    setup() {
      const tableInputs = reactive({
        data: [
          { date: '2016-05-03', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
          { date: '2016-05-02', name: 'Jean', address: 'No. 12, Park Av, San Francisco' },
          { date: '2016-05-04', name: 'Angelo', address: 'No. 28, Levage St, NYC' },
          { date: '2016-05-01', name: 'Patrick', address: 'Appt. 522, No. 32, Churchill Blv, Los Angeles' },
        ],
        tableColumn: [
          { prop: 'date', label: 'Date', width: 180 },
          { prop: 'name', label: 'Nom', width: 180 },
          { prop: 'address', label: 'Adresse' },
        ],
        striped: true,
        sortable: true,
        selectable: true,
      })
      return { tableInputs }
    },
    template: `
      <PTable :pData="tableInputs.data" :pStripe="tableInputs.striped">
        <PTableColumn v-if="tableInputs.selectable" type="selection" />
        <PTableColumn
          v-for="column in tableInputs.tableColumn"
          :key="column.prop"
          :pProp="column.prop"
          :pLabel="column.label"
          :pWidth="column.width"
          :pSortable="tableInputs.sortable"
        />
      </PTable>
    `,
  }),
}

export const Advanced: Story = {
  render: () => ({
    components: { PTable, PTableColumn, PText, PEntity, PDoubleText, PTag, PSwitch, PButton },
    setup() {
      const tableInputs = reactive({
        data: [
          {
            text: { content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea', iconName: 'cupHot', type: 'primary' },
            entity: { iconName: 'building', name: 'Lorem Ipsum Factory' },
            doubleText: { iconName: 'cupHot', profile: 'JL', title: 'Lorem ipsum', content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea', type: 'primary' },
            tag: { content: 'Validé', iconLeftName: 'folder', iconRightName: 'stars' },
            switch: { status: true, disabled: false },
          },
          {
            text: { content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea', iconName: 'cupHot', type: 'primary' },
            entity: { iconName: 'pulse', name: 'Olympia Stadium', type: 'primary' },
            doubleText: { iconName: 'cupHot', profile: 'JL', title: 'Lorem ipsum', content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea', type: 'primary' },
            tag: { content: 'Validé', iconLeftName: 'folder', iconRightName: 'stars' },
            switch: { status: false, disabled: false },
          },
          {
            text: { content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea', iconName: 'cupHot', type: 'primary' },
            entity: { iconName: 'cupStraw', name: 'Baquery' },
            doubleText: { iconName: 'cupHot', profile: 'JL', title: 'Lorem ipsum', content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea', type: 'primary' },
            tag: { content: 'Validé', iconLeftName: 'folder', iconRightName: 'stars' },
            switch: { status: true, disabled: false },
          },
          {
            text: { content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea', iconName: 'cupHot', type: 'primary' },
            entity: { iconName: 'shop', name: 'Lorem Ipsum Factory' },
            doubleText: { iconName: 'cupHot', profile: 'JL', title: "Restaurant Alfredo's House", content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea', type: 'primary' },
            tag: { content: 'Validé', iconLeftName: 'folder', iconRightName: 'stars' },
            switch: { status: true, disabled: true },
          },
          {
            text: { content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea', iconName: 'cupHot', type: 'primary' },
            entity: { iconName: 'building', name: 'Neverland Swiming Pool' },
            doubleText: { iconName: 'cupHot', profile: 'JL', title: 'Lorem ipsum', content: 'Lorem ipsum dolor apicus storea parsem vida aleum parsea', type: 'primary' },
            tag: { content: 'Validé' },
            switch: { status: true, disabled: true },
          },
        ],
        striped: true,
        sortable: true,
        selectable: true,
      })

      const sortMethodsText = (a: any, b: any) => a.text.content.localeCompare(b.text.content)
      const sortMethodsDoubleText = (a: any, b: any) => a.doubleText.content.localeCompare(b.doubleText.content)
      const sortMethodsTags = (a: any, b: any) => (a.tag?.content || '').localeCompare(b.tag?.content || '')
      const sortMethodsEntity = (a: any, b: any) => a.entity.name.localeCompare(b.entity.name)

      return { tableInputs, sortMethodsText, sortMethodsDoubleText, sortMethodsTags, sortMethodsEntity }
    },
    template: `
      <PTable :pData="tableInputs.data" :pStripe="tableInputs.striped" fit>
        <PTableColumn v-if="tableInputs.selectable" type="selection" />

        <PTableColumn pLabel="Texte" pWidth="180" :pSortMethod="sortMethodsText" :pSortable="tableInputs.sortable">
          <template #default="scope">
            <PText :pContent="scope.row.text.content" :pIconName="scope.row.text.iconName" :pBold="false" :pType="scope.row.text.type" :disabled="false" :selected="false" />
          </template>
        </PTableColumn>

        <PTableColumn pLabel="Entité" pWidth="220" :pSortMethod="sortMethodsEntity" :pSortable="tableInputs.sortable">
          <template #default="scope">
            <PEntity :pContent="scope.row.entity.name" :pIconName="scope.row.entity.iconName" :pType="scope.row.entity.type" :pSelected="false" />
          </template>
        </PTableColumn>

        <PTableColumn pLabel="Double texte" pWidth="180" :pSortMethod="sortMethodsDoubleText" :pSortable="tableInputs.sortable">
          <template #default="scope">
            <PDoubleText :pIconName="scope.row.doubleText.iconName" :pProfile="scope.row.doubleText.profile" :pTitle="scope.row.doubleText.title" :pContent="scope.row.doubleText.content" :pType="scope.row.doubleText.type" :pDisabled="false" :pSelected="false" />
          </template>
        </PTableColumn>

        <PTableColumn pLabel="Tag" pWidth="180" :pSortMethod="sortMethodsTags" :pSortable="tableInputs.sortable">
          <template #default="scope">
            <PTag pColor="success" pSize="default" :pIconLeftName="scope.row.tag.iconLeftName" :pIconRightName="scope.row.tag.iconRightName" :pContent="scope.row.tag.content" />
          </template>
        </PTableColumn>

        <PTableColumn pLabel="Interrupteur">
          <template #default="scope">
            <PSwitch v-model="scope.row.switch.status" :disabled="scope.row.switch.disabled" />
          </template>
        </PTableColumn>

        <PTableColumn pLabel="Boutons" pWidth="300">
          <template #default>
            <PButton type="primary" size="small" plain class="margin-right--2">Bouton</PButton>
            <PButton type="primary" size="small" plain class="margin-right--2">Bouton</PButton>
            <PButton type="primary" size="small" class="margin-right--2">Bouton</PButton>
          </template>
        </PTableColumn>
      </PTable>
    `,
  }),
}
