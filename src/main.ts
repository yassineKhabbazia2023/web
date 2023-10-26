
// locales
import frLocale from 'element-plus/es/locale/lang/fr'
import enLocale from 'element-plus/es/locale/lang/en'
import dayjs from 'dayjs'

import './assets/scss/index.scss'

import toastPlugin from '@/molecules/PToaster'

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

export { default as PButton } from '@/atoms/PButton'
export { default as PActionBar } from '@/molecules/PActionBar'
export { default as PAlert } from '@/atoms/PAlert'
export { default as PAvatar } from '@/atoms/PAvatar'
export { default as PBottomMenu } from '@/molecules/PBottomMenu'
export { default as PBreadcrumb } from '@/molecules/PBreadcrumb'
export { default as PCarousel } from '@/molecules/PCarousel'
export { default as PCarouselItem } from '@/atoms/PCarouselItem'
export { default as PCheckbox } from '@/atoms/PCheckbox'
export { default as PDatePicker } from '@/atoms/PDatePicker'
export { default as PDocumentViewer } from '@/organisms/PDocumentViewer'
export { default as PFileCard } from '@/molecules/PFileCard'
export { default as PDoubleText } from '@/atoms/PDoubleText'
export { default as PDialog } from '@/atoms/PDialog'
export { default as PDrawer } from '@/molecules/PDrawer'
export { default as PEntity } from '@/atoms/PEntity'
export { default as PFileAndFolderLineCheck } from '@/molecules/PFileAndFolderLineCheck'
export { default as PFileLineNavigationItem } from '@/atoms/PFileLineNavigationItem'
export { default as PHeader } from '@/molecules/PHeader'
export { default as PHeaderTabs } from '@/atoms/PHeaderTabs'
export { default as PIcon } from '@/atoms/PIcon'
export { default as PImage } from '@/atoms/PImage'
export { default as PLineChart } from '@/atoms/PLineChart'
export { default as PLoader } from '@/atoms/PLoader'
export { default as PNavbar } from '@/molecules/PNavbar'
export { default as PPagination } from '@/atoms/PPagination'
export { default as PPopover } from '@/molecules/PPopover'
export { default as PPastille } from '@/atoms/PPastille'
export { default as PTable } from '@/atoms/PTable'
export { default as PTag } from '@/atoms/PTag'
export { default as PToolbox } from '@/molecules/PToolbox'
export { default as PToolboxItem } from '@/atoms/PToolboxItem'
export { default as PTooltip } from '@/atoms/PTooltip'
export { default as PText } from '@/atoms/PText'
export { default as Ptree } from '@/organisms/PTree'
