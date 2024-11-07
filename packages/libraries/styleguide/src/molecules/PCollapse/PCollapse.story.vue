<template>
  <Story title="3. Molecules/Collapse" icon="mdi:collapse-all">
    <Variant title="Basic Usage">
      <div class="block-collapse">
        <PCollapse
          v-model="activeNames"
          :pAccordion="accordion"
        >
          <PCollapseItem
            pType="default"
            :pTitleCollapseItem="firstCollapseItem.pTitleCollapseItem"
            :pIcon="firstCollapseItem.pIcon"
            :disabled="firstCollapseItem.disabled"
            :pFullBody="firstCollapseItem.pFullBody"
            name="1"
          >
            <div>
              Content
            </div>
          </PCollapseItem>
          <PCollapseItem
            pType="default"
            :pTitleCollapseItem="secondCollapseItem.pTitleCollapseItem"
            :pIcon="firstCollapseItem.pIcon"
            :disabled="secondCollapseItem.disabled"
            :pFullBody="firstCollapseItem.pFullBody"
            name="2"
          >
            <div>
              Content
            </div>
          </PCollapseItem>
        </PCollapse>
      </div>
      <template #controls>
        <HstCheckbox v-model="accordion" title="Accordion" />
        <el-divider borderStyle="dotted" contentPosition="left">
          <span>First Collapse Item</span>
        </el-divider>
        <HstText v-model="firstCollapseItem.pTitleCollapseItem" title="titleCollapseItem" />
        <HstCheckbox v-model="firstCollapseItem.disabled" title="Disable" />
        <HstCheckbox v-model="firstCollapseItem.pFullBody" title="Full body" />
        <el-divider borderStyle="dotted" contentPosition="left">
          <span>Second Collapse Item</span>
        </el-divider>
        <HstText v-model="secondCollapseItem.pTitleCollapseItem" title="titleCollapseItem" />
        <HstCheckbox v-model="secondCollapseItem.disabled" title="Disable" />
      </template>
    </Variant>
    <Variant title="Shadow variant">
      <div class="block-collapse">
        <PCollapse
          v-model="activeNames"
          :pAccordion="accordion"
        >
          <PCollapseItem
            pType="shadow"
            :pTitleCollapseItem="firstCollapseItem.pTitleCollapseItem"
            :pIcon="firstCollapseItem.pIcon"
            :disabled="firstCollapseItem.disabled"
            :pFullBody="firstCollapseItem.pFullBody"
            name="1"
          >
            <div>
              Content
            </div>
          </PCollapseItem>
          <PCollapseItem
            pType="shadow"
            :pTitleCollapseItem="secondCollapseItem.pTitleCollapseItem"
            :pIcon="firstCollapseItem.pIcon"
            :disabled="secondCollapseItem.disabled"
            :pFullBody="firstCollapseItem.pFullBody"
            name="2"
          >
            <div>
              Content
            </div>
          </PCollapseItem>
        </PCollapse>
      </div>
      <template #controls>
        <HstCheckbox v-model="accordion" titleCollapseItem="Accordion" />
        <el-divider borderStyle="dotted" contentPosition="left">
          <span>First Collapse Item</span>
        </el-divider>
        <HstText v-model="firstCollapseItem.pTitleCollapseItem" title="titleCollapseItem" />
        <HstCheckbox v-model="firstCollapseItem.disabled" title="Disable" />
        <HstCheckbox v-model="firstCollapseItem.pFullBody" title="Full body" />
        <el-divider borderStyle="dotted" contentPosition="left">
          <span>Second Collapse Item</span>
        </el-divider>
        <HstText v-model="secondCollapseItem.pTitleCollapseItem" title="titleCollapseItem" />
        <HstCheckbox v-model="secondCollapseItem.disabled" title="Disable" />
      </template>
    </Variant>
    <Variant title="Alert Variant">
      <div class="block-collapse">
        <PCollapse
          v-model="activeNames"
          :pAccordion="accordion"
        >
          <PCollapseItem
            pType="alert"
            :pTitleCollapseItem="firstCollapseItem.pTitleCollapseItem"
            :pIcon="firstCollapseItem.pIcon"
            :disabled="firstCollapseItem.disabled"
            :pFullBody="firstCollapseItem.pFullBody"
            name="1"
          >
            <div>
              Content
            </div>
          </PCollapseItem>
          <PCollapseItem
            pType="alert"
            :pTitleCollapseItem="secondCollapseItem.pTitleCollapseItem"
            :pIcon="firstCollapseItem.pIcon"
            :disabled="secondCollapseItem.disabled"
            :pFullBody="firstCollapseItem.pFullBody"
            name="2"
          >
            <div>
              Content
            </div>
          </PCollapseItem>
        </PCollapse>
      </div>
      <template #controls>
        <HstCheckbox v-model="accordion" title="Accordion" />
        <el-divider borderStyle="dotted" contentPosition="left">
          <span>First Collapse Item</span>
        </el-divider>
        <HstText v-model="firstCollapseItem.pTitleCollapseItem" title="titleCollapseItem" />
        <HstCheckbox v-model="firstCollapseItem.disabled" title="Disable" />
        <HstCheckbox v-model="firstCollapseItem.pFullBody" title="Full body" />
        <el-divider borderStyle="dotted" contentPosition="left">
          <span>Second Collapse Item</span>
        </el-divider>
        <HstText v-model="secondCollapseItem.pTitleCollapseItem" title="titleCollapseItem" />
        <HstCheckbox v-model="secondCollapseItem.disabled" title="Disable" />
      </template>
    </Variant>
    <Variant title="Gray Variant">
      <div class="block-collapse">
        <PCollapse
          v-model="activeNames"
          :pAccordion="accordion"
        >
          <PCollapseItem
            pType="gray"
            :pTitleCollapseItem="firstCollapseItem.pTitleCollapseItem"
            :pIcon="firstCollapseItem.pIcon"
            :disabled="firstCollapseItem.disabled"
            :pFullBody="firstCollapseItem.pFullBody"
            name="1"
          >
            <div>
              Content
            </div>
          </PCollapseItem>
          <PCollapseItem
            pType="gray"
            :pTitleCollapseItem="secondCollapseItem.pTitleCollapseItem"
            :pIcon="firstCollapseItem.pIcon"
            :disabled="secondCollapseItem.disabled"
            :pFullBody="firstCollapseItem.pFullBody"
            name="2"
          >
            <div>
              Content
            </div>
          </PCollapseItem>
        </PCollapse>
      </div>
      <template #controls>
        <HstCheckbox v-model="accordion" title="Accordion" />
        <el-divider borderStyle="dotted" contentPosition="left">
          <span>First Collapse Item</span>
        </el-divider>
        <HstText v-model="firstCollapseItem.pTitleCollapseItem" title="titleCollapseItem" />
        <HstCheckbox v-model="firstCollapseItem.disabled" title="Disable" />
        <HstCheckbox v-model="firstCollapseItem.pFullBody" title="Full body" />
        <el-divider borderStyle="dotted" contentPosition="left">
          <span>Second Collapse Item</span>
        </el-divider>
        <HstText v-model="secondCollapseItem.pTitleCollapseItem" title="titleCollapseItem" />
        <HstCheckbox v-model="secondCollapseItem.disabled" title="Disable" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { PIArchive } from '@/atoms/PIcon/components'
import PCollapseItem from '@/atoms/PCollapseItem'

const activeNames = ref(['1'])
const accordion = ref(false)
const firstCollapseItem = reactive({
  pTitleCollapseItem: 'Consistency',
  pIcon: PIArchive,
  disabled: false,
  pFullBody: false,
})
const secondCollapseItem = reactive({
  pTitleCollapseItem: 'Feedback',
  disabled: false,
})
</script>

<style lang="scss" scoped>
.block-collapse {
  height: 300px;
  padding: 24px;
}
</style>

<docs lang="md">
  ## Collapse

  <div class="reponsive-iframe-container">
    <iframe class="reponsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D6337%253A7034%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
