
// locales
import frLocale from 'element-plus/es/locale/lang/fr'
import enLocale from 'element-plus/es/locale/lang/en'
import dayjs from 'dayjs'

import './assets/scss/index.scss'

import toastPlugin from '@/molecules/PToaster'
// import Button from '@/atoms/PButton'
// import ActionBar from '@/molecules/PActionBar'
// import Alert from '@/atoms/PAlert'
// import Avatar from '@/atoms/PAvatar'
// import BottomMenu from '@/molecules/PBottomMenu'
// import Breadcrumb from '@/molecules/PBreadcrumb'
// import Carousel from '@/molecules/PCarousel'
// import CarouselItem from '@/atoms/PCarouselItem'
// import Checkbox from '@/atoms/PCheckbox'
// import DatePicker from '@/atoms/PDatePicker'
// import DocumentViewer from '@/organisms/PDocumentViewer'
// import FileCard from '@/molecules/PFileCard'
// import DoubleText from '@/atoms/PDoubleText'
// import Dialog from '@/atoms/PDialog'
// import Drawer from '@/molecules/PDrawer'
// import Entity from '@/atoms/PEntity'
// import FileAndFolderLineCheck from '@/molecules/PFileAndFolderLineCheck'
// import FileLineNavigationItem from '@/atoms/PFileLineNavigationItem'
// import Header from '@/molecules/PHeader'
// import HeaderTabs from '@/atoms/PHeaderTabs'
// import Icon from '@/atoms/PIcon'
// import Image from '@/atoms/PImage'
// import LineChart from '@/atoms/PLineChart'
// import Loader from '@/atoms/PLoader'
// import Navbar from '@/molecules/PNavbar'
// import Pagination from '@/atoms/PPagination'
// import Popover from '@/molecules/PPopover'
// import Pastille from '@/atoms/PPastille'
// import Table from '@/atoms/PTable'
// import Tag from '@/atoms/PTag'
// import Toolbox from '@/molecules/PToolbox'
// import ToolboxItem from '@/atoms/PToolboxItem'
// import Tooltip from '@/atoms/PTooltip'
// import Text from '@/atoms/PText'
// import Tree from '@/organisms/PTree'

export * from './atoms/PIcon/components'

dayjs.Ls.en.weekStart = 1

export const fr = frLocale
export const en = enLocale

export default function install(app: any) {
  app.use(toastPlugin)
}

export {
  // Inner Depencies for Layout, DatePicker
  ElContainer as PContainer,
  ElAside as PAside,
  ElHeader as PCHeader,
  ElMain as PMain,
  ElFooter as PFooter,
  ElTimePicker as PTimePicker,
  ElPopper as PPopper,
  ElPopperArrow as PPopperArrow,
  ElPopperContent as PPopperContent,
  ElAutocomplete as PAutocomplete,
  ElCol as PCol,
  ElConfigProvider as PConfigProvider,
  ElForm as PForm,
  ElFormItem as PFormItem,
  ElInput as PInput,
  ElOption as POption,
  ElOptionGroup as POptionGroup,
  ElRadio as PRadio,
  ElRow as PRow,
  ElScrollbar as PScrollbar,
  ElSelect as PSelect,
  ElStep as PStepItem,
  ElSteps as PSteps,
  ElSwitch as PSwitch,
  ElTableColumn as PTableColumn,
  ElTabPane as PTabPane,
  ElTabs as PTabs
} from 'element-plus'

// export const PContainer = ElContainer
// export const PAside = ElAside
// export const PCHeader = ElHeader
// export const PMain = ElMain
// export const PFooter = ElFooter
// export const PTimePicker = ElTimePicker
// export const PPopper = ElPopper
// export const PPopperArrow = ElPopperArrow
// export const PPopperContent = ElPopperContent
// export const PAutocomplete = ElAutocomplete
// export const PCol = ElCol
// export const PConfigProvider = ElConfigProvider
// export const PDropdown = ElSelect
// export const PForm = ElForm
// export const PFormItem = ElFormItem
// export const PInput = ElInput
// export const POption = ElOption
// export const POptionGroup = ElOptionGroup
// export const PRadio = ElRadio
// export const PRow = ElRow
// export const PScrollbar = ElScrollbar
// export const PStepItem = ElStep
// export const PSteps = ElSteps
// export const PSwitch = ElSwitch
// export const PTableColumn = ElTableColumn
// export const PTabPane = ElTabPane
// export const PTabs = ElTabs
// export const PButton = Button
export { default as PButton } from '@/atoms/PButton'
// export const PActionBar = ActionBar
export { default as PActionBar } from '@/molecules/PActionBar'
// export const PAlert = Alert
export { default as PAlert } from '@/atoms/PAlert'
// export const PAvatar = Avatar
export { default as PAvatar } from '@/atoms/PAvatar'
// export const PBottomMenu = BottomMenu
export { default as PBottomMenu } from '@/molecules/PBottomMenu'
// export const PBreadcrumb = Breadcrumb
export { default as PBreadcrumb } from '@/molecules/PBreadcrumb'
// export const PCarousel = Carousel
export { default as PCarousel } from '@/molecules/PCarousel'
// export const PCarouselItem = CarouselItem
export { default as PCarouselItem } from '@/atoms/PCarouselItem'
// export const PCheckbox = Checkbox
export { default as PCheckbox } from '@/atoms/PCheckbox'
// export const PDatePicker = DatePicker
export { default as PDatePicker } from '@/atoms/PDatePicker'
// export const PDocumentViewer = DocumentViewer
export { default as PDocumentViewer } from '@/organisms/PDocumentViewer'
// export const PFileCard = FileCard
export { default as PFileCard } from '@/molecules/PFileCard'
// export const PDoubleText = DoubleText
export { default as PDoubleText } from '@/atoms/PDoubleText'
// export const PDialog = Dialog
export { default as PDialog } from '@/atoms/PDialog'
// export const PDrawer = Drawer
export { default as PDrawer } from '@/molecules/PDrawer'
// export const PEntity = Entity
export { default as PEntity } from '@/atoms/PEntity'
// export const PFileAndFolderLineCheck = FileAndFolderLineCheck
export { default as PFileAndFolderLineCheck } from '@/molecules/PFileAndFolderLineCheck'
// export const PFileLineNavigationItem = FileLineNavigationItem
export { default as PFileLineNavigationItem } from '@/atoms/PFileLineNavigationItem'
// export const PHeader = Header
export { default as PHeader } from '@/molecules/PHeader'
// export const PHeaderTabs = HeaderTabs
export { default as PHeaderTabs } from '@/atoms/PHeaderTabs'
// export const PIcon = Icon
export { default as PIcon } from '@/atoms/PIcon'
// export const PImage = Image
export { default as PImage } from '@/atoms/PImage'
// export const PLineChart = LineChart
export { default as PLineChart } from '@/atoms/PLineChart'
// export const PLoader = Loader
export { default as PLoader } from '@/atoms/PLoader'
// export const PNavbar = Navbar
export { default as PNavbar } from '@/molecules/PNavbar'
// export const PPagination = Pagination
export { default as PPagination } from '@/atoms/PPagination'
// export const PPopover = Popover
export { default as PPopover } from '@/molecules/PPopover'
// export const PPastille = Pastille
export { default as PPastille } from '@/atoms/PPastille'
// export const PTable = Table
export { default as PTable } from '@/atoms/PTable'
// export const PTag = Tag
export { default as PTag } from '@/atoms/PTag'
// export const PToolbox = Toolbox
export { default as PToolbox } from '@/molecules/PToolbox'
// export const PToolboxItem = ToolboxItem
export { default as PToolboxItem } from '@/atoms/PToolboxItem'
// export const PTooltip = Tooltip
export { default as PTooltip } from '@/atoms/PTooltip'
// export const PText = Text
export { default as PText } from '@/atoms/PText'
// export const Ptree = Tree
export { default as Ptree } from '@/organisms/PTree'
