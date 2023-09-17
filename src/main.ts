// import { defineAsyncComponent } from 'vue'

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
  ElPopperContent,
  ElAutocomplete,
  ElCol,
  ElConfigProvider,
  ElSelect,
  ElForm,
  ElFormItem,
  ElInput,
  ElOption,
  ElOptionGroup,
  ElRadio,
  ElRow,
  ElScrollbar,
  ElStep,
  ElSteps,
  ElSwitch,
  ElTableColumn,
  ElTabPane,
  ElTabs
} from 'element-plus'

// locales
import frLocale from 'element-plus/es/locale/lang/fr'
import enLocale from 'element-plus/es/locale/lang/en'
import dayjs from 'dayjs'

import './assets/scss/index.scss'

import toastPlugin from '@/molecules/PToaster'
import Button from '@/atoms/PButton'
import ActionBar from '@/molecules/PActionBar'
import Alert from '@/atoms/PAlert'
import Avatar from '@/atoms/PAvatar'
import BottomMenu from '@/molecules/PBottomMenu'
import Breadcrumb from '@/molecules/PBreadcrumb'
import Carousel from '@/molecules/PCarousel'
import CarouselItem from '@/atoms/PCarouselItem'
import Checkbox from '@/atoms/PCheckbox'
import DatePicker from '@/atoms/PDatePicker'
import DocumentViewer from '@/organisms/PDocumentViewer'
import FileCard from '@/molecules/PFileCard'
import DoubleText from '@/atoms/PDoubleText'
import Dialog from '@/atoms/PDialog'
import Drawer from '@/molecules/PDrawer'
import Entity from '@/atoms/PEntity'
import FileAndFolderLineCheck from '@/molecules/PFileAndFolderLineCheck'
import FileLineNavigationItem from '@/atoms/PFileLineNavigationItem'
import Header from '@/molecules/PHeader'
import HeaderTabs from '@/atoms/PHeaderTabs'
import Icon from '@/atoms/PIcon'
import Image from '@/atoms/PImage'
import LineChart from '@/atoms/PLineChart'
import Loader from '@/atoms/PLoader'
import Navbar from '@/molecules/PNavbar'
import Pagination from '@/atoms/PPagination'
import Popover from '@/molecules/PPopover'
import Pastille from '@/atoms/PPastille'
import Table from '@/atoms/PTable'
import Tag from '@/atoms/PTag'
import Toolbox from '@/molecules/PToolbox'
import ToolboxItem from '@/atoms/PToolboxItem'
import Tooltip from '@/atoms/PTooltip'
import Text from '@/atoms/PText'
import Tree from '@/organisms/PTree'

// @ts-ignore
// export * from './atoms/PIcon/components'
/* import ICheck from '@/atoms/PIcon/components/PICheck'
import IArrowRight from '@/atoms/PIcon/components/PIArrowRight'
import IQuestionCircle from '@/atoms/PIcon/components/PIQuestionCircle'
import IAdd from '@/atoms/PIcon/components/PIAdd' */

dayjs.Ls.en.weekStart = 1

export const fr = frLocale
export const en = enLocale

export default function install(app: any) {
  app.use(toastPlugin)
}
// export { default as PICheck } from '@/atoms/PIcon/components/PICheck.vue'

/* export const PICheck = ICheck
export const PIArrowRight = IArrowRight
export const PIQuestionCircle = IQuestionCircle
export const PIAdd = IAdd */

export const PContainer = ElContainer
export const PAside = ElAside
export const PCHeader = ElHeader
export const PMain = ElMain
export const PFooter = ElFooter
export const PTimePicker = ElTimePicker
export const PPopper = ElPopper
export const PPopperArrow = ElPopperArrow
export const PPopperContent = ElPopperContent
export const PAutocomplete = ElAutocomplete
export const PCol = ElCol
export const PConfigProvider = ElConfigProvider
export const PDropdown = ElSelect
export const PForm = ElForm
export const PFormItem = ElFormItem
export const PInput = ElInput
export const POption = ElOption
export const POptionGroup = ElOptionGroup
export const PRadio = ElRadio
export const PRow = ElRow
export const PScrollbar = ElScrollbar
export const PStepItem = ElStep
export const PSteps = ElSteps
export const PSwitch = ElSwitch
export const PTableColumn = ElTableColumn
export const PTabPane = ElTabPane
export const PTabs = ElTabs
export const PButton = Button
export const PActionBar = ActionBar
export const PAlert = Alert
export const PAvatar = Avatar
export const PBottomMenu = BottomMenu
export const PBreadcrumb = Breadcrumb
export const PCarousel = Carousel
export const PCarouselItem = CarouselItem
export const PCheckbox = Checkbox
export const PDatePicker = DatePicker
export const PDocumentViewer = DocumentViewer
export const PFileCard = FileCard
export const PDoubleText = DoubleText
export const PDialog = Dialog
export const PDrawer = Drawer
export const PEntity = Entity
export const PFileAndFolderLineCheck = FileAndFolderLineCheck
export const PFileLineNavigationItem = FileLineNavigationItem
export const PHeader = Header
export const PHeaderTabs = HeaderTabs
export const PIcon = Icon
export const PImage = Image
export const PLineChart = LineChart
export const PLoader = Loader
export const PNavbar = Navbar
export const PPagination = Pagination
export const PPopover = Popover
export const PPastille = Pastille
export const PTable = Table
export const PTag = Tag
export const PToolbox = Toolbox
export const PToolboxItem = ToolboxItem
export const PTooltip = Tooltip
export const PText = Text
export const Ptree = Tree

// export default { Ptree, PDrawer, PButton, PForm, PFormItem, PInput, PDialog, PIcon, PNavbar }
// base UI library asynchrones
/* export const PAutocomplete =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElAutocomplete }) => ElAutocomplete)
  ) as any */
/* export const PCol =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElCol }) => ElCol)
  ) */
/* export const PConfigProvider =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElConfigProvider }) => ElConfigProvider)
  ) */
/* export const PDropdown =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElSelect }) => ElSelect)
  ) as any */
/* export const PForm =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElForm }) => ElForm)
  ) */
/* export const PFormItem =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElFormItem }) => ElFormItem)
  ) */
/* export const PInput =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElInput }) => ElInput)
  ) */
/* export const POption =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElOption }) => ElOption)
  ) */
/* export const POptionGroup =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElOptionGroup }) => ElOptionGroup)
  ) */
/* export const PRadio =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElRadio }) => ElRadio)
  )
export const PRow =
  defineAsyncComponent(
    () => import('element-plus').then(({ ElRow }) => ElRow)
  ) */
/* export const PScrollbar =
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
) */

/* export const PActionBar = defineAsyncComponent(() => import('@/molecules/PActionBar'))
export const PAlert = defineAsyncComponent(() => import('@/atoms/PAlert'))
export const PAvatar = defineAsyncComponent(() => import('@/atoms/PAvatar'))
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
export const PFolderLineNavigationItem =
defineAsyncComponent(() => import('@/atoms/PFolderLineNavigationItem'))
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
export const PButton = defineAsyncComponent(() => import('@/atoms/PButton')) */
