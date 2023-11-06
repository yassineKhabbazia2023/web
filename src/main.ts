import { defineAsyncComponent } from 'vue'

import {
  // Inner Depencies for Layout, DatePicker
  ElContainer,
  ElAside,
  ElHeader,
  ElMain,
  ElFooter,
  ElTimePicker,
  ElPopper,
  ElPopperArrow,
  ElPopperContent
} from 'element-plus'

// locales
import frLocale from 'element-plus/es/locale/lang/fr'
import enLocale from 'element-plus/es/locale/lang/en'
import dayjs from 'dayjs'

import './assets/scss/index.scss'

import toastPlugin from '@/molecules/PToaster'

dayjs.Ls.en.weekStart = 1

export const fr = frLocale
export const en = enLocale

export function install(app: any) {
  app.use(toastPlugin)
}

// @ts-ignore
export * from './atoms/PIcon/components'

export const PContainer = ElContainer
export const PAside = ElAside
export const PCHeader = ElHeader
export const PMain = ElMain
export const PFooter = ElFooter
export const PTimePicker = ElTimePicker
export const PPopper = ElPopper
export const PPopperArrow = ElPopperArrow
export const PPopperContent = ElPopperContent

// base UI library asynchrones
export const PAutocomplete =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElAutocomplete }) => ElAutocomplete)
  ) as any
export const PCol =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElCol }) => ElCol)
  )
export const PCollapse =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElCollapse }) => ElCollapse)
  )
export const PConfigProvider =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElConfigProvider }) => ElConfigProvider)
  )
export const PDropdown =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElSelect }) => ElSelect)
  ) as any
export const PForm =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElForm }) => ElForm)
  )
export const PFormItem =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElFormItem }) => ElFormItem)
  )
export const PInput =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElInput }) => ElInput)
  )
export const POption =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElOption }) => ElOption)
  )
export const POptionGroup =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElOptionGroup }) => ElOptionGroup)
  )
export const PRadio =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElRadio }) => ElRadio)
  )
export const PRow =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElRow }) => ElRow)
  )
export const PScrollbar =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElScrollbar }) => ElScrollbar)
  )
export const PStepItem =
defineAsyncComponent(
  () => import('element-plus').then(({ ElStep }) => ElStep)
)
export const PSteps =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElSteps }) => ElSteps)
  )
export const PSwitch =
defineAsyncComponent(
  () => import('element-plus').then(({ ElSwitch }) => ElSwitch)
)
export const PTableColumn =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElTableColumn }) => ElTableColumn)
  )
export const PTabPane =
defineAsyncComponent(
  () => import('element-plus').then(({ ElTabPane }) => ElTabPane)
)
export const PTabs =
defineAsyncComponent(
  () => import('element-plus').then(({ ElTabs }) => ElTabs)
)

export const PActionBar = defineAsyncComponent(() => import('@/molecules/PActionBar'))
export const PActivityCard = defineAsyncComponent(() => import('@/atoms/PActivityCard'))
export const PAlert = defineAsyncComponent(() => import('@/atoms/PAlert'))
export const PAvatar = defineAsyncComponent(() => import('@/atoms/PAvatar'))
export const PBankCard = defineAsyncComponent(() => import('@/atoms/PBankCard'))
export const PButton = defineAsyncComponent(() => import('@/atoms/PButton'))
export const PBottomMenu = defineAsyncComponent(() => import('@/molecules/PBottomMenu'))
export const PBreadcrumb = defineAsyncComponent(() => import('@/molecules/PBreadcrumb'))
export const PCarousel = defineAsyncComponent(() => import('@/molecules/PCarousel'))
export const PCarouselItem = defineAsyncComponent(() => import('@/atoms/PCarouselItem'))
export const PCheckbox = defineAsyncComponent(() => import('@/atoms/PCheckbox'))
export const PCollapseItem = defineAsyncComponent(() => import('@/atoms/PCollapseItem'))
export const PDatePicker = defineAsyncComponent(() => import('@/atoms/PDatePicker'))
export const PDocumentViewer = defineAsyncComponent(() => import('@/organisms/PDocumentViewer'))
export const PFileCard = defineAsyncComponent(() => import('@/molecules/PFileCard'))
export const PDoubleText = defineAsyncComponent(() => import('@/atoms/PDoubleText'))
export const PDialog = defineAsyncComponent(() => import('@/atoms/PDialog'))
export const PDrawer = defineAsyncComponent(() => import('@/molecules/PDrawer'))
export const PEntity = defineAsyncComponent(() => import('@/atoms/PEntity'))
export const PFileAndFolderLineCheck =
defineAsyncComponent(() => import('@/molecules/PFileAndFolderLineCheck'))
export const PFileLineNavigationItem =
defineAsyncComponent(() => import('@/atoms/PFileLineNavigationItem'))
export const PHeader = defineAsyncComponent(() => import('@/molecules/PHeader'))
export const PHeaderTabs = defineAsyncComponent(() => import('@/atoms/PHeaderTabs'))
export const PIcon = defineAsyncComponent(() => import('@/atoms/PIcon'))
export const PImage = defineAsyncComponent(() => import('@/atoms/PImage'))
export const PLineChart = defineAsyncComponent(() => import('@/atoms/PLineChart'))
export const PLoader = defineAsyncComponent(() => import('@/atoms/PLoader'))
export const PNavbar = defineAsyncComponent(() => import('@/molecules/PNavbar'))
export const PNotificationCard = defineAsyncComponent(() => import('@/atoms/PNotificationCard'))
export const PPagination = defineAsyncComponent(() => import('@/atoms/PPagination'))
export const PPopover = defineAsyncComponent(() => import('@/molecules/PPopover'))
export const PPastille = defineAsyncComponent(() => import('@/atoms/PPastille'))
export const PTable = defineAsyncComponent(() => import('@/atoms/PTable'))
export const PTag = defineAsyncComponent(() => import('@/atoms/PTag'))
export const PToolbox = defineAsyncComponent(() => import('@/molecules/PToolbox'))
export const PToolboxItem = defineAsyncComponent(() => import('@/atoms/PToolboxItem'))
export const PTooltip = defineAsyncComponent(() => import('@/atoms/PTooltip'))
export const PText = defineAsyncComponent(() => import('@/atoms/PText'))
export const PTree = defineAsyncComponent(() => import('@/organisms/PTree'))
