
// locales
import frLocale from 'element-plus/es/locale/lang/fr'
import enLocale from 'element-plus/es/locale/lang/en'
import dayjs from 'dayjs'

import './assets/scss/index.scss'

import toastPlugin from './molecules/PToaster'

export * from './atoms/PIcon/components'

dayjs.Ls.en.weekStart = 1

export const fr = frLocale
export const en = enLocale

export default function install(app: any) {
  app.use(toastPlugin)
}

export {
  // Inner Depencies for Layout, DatePicker
  ElAside as PAside,
  ElAutocomplete as PAutocomplete,
  ElCol as PCol,
  ElCollapse as PCollapse,
  ElConfigProvider as PConfigProvider,
  ElContainer as PContainer,
  ElFooter as PFooter,
  ElForm as PForm,
  ElFormItem as PFormItem,
  ElHeader as PCHeader,
  ElInput as PInput,
  ElMain as PMain,
  ElOption as POption,
  ElOptionGroup as POptionGroup,
  ElPopper as PPopper,
  ElPopperArrow as PPopperArrow,
  ElPopperContent as PPopperContent,
  ElRadio as PRadio,
  ElRow as PRow,
  ElScrollbar as PScrollbar,
  ElSelect as PSelect,
  ElStep as PStepItem,
  ElSteps as PSteps,
  ElSwitch as PSwitch,
  ElTableColumn as PTableColumn,
  ElTabPane as PTabPane,
  ElTabs as PTabs,
  ElTimePicker as PTimePicker
} from 'element-plus'

export { default as PActivityCard } from './atoms/PActivityCard'
export { default as PActionBar } from './molecules/PActionBar'
export { default as PAlert } from './atoms/PAlert'
export { default as PAvatar } from './atoms/PAvatar'
export { default as PBankCard } from './atoms/PBankCard'
export { default as PBottomMenu } from './molecules/PBottomMenu'
export { default as PBreadcrumb } from './molecules/PBreadcrumb'
export { default as PButton } from './atoms/PButton'
export { default as PButtonGroup } from './atoms/PButtonGroup'
export { default as PCarousel } from './molecules/PCarousel'
export { default as PCarouselItem } from './atoms/PCarouselItem'
export { default as PCheckbox } from './atoms/PCheckbox'
export { default as PCollapseItem } from './atoms/PCollapseItem'
export { default as PDatePicker } from './atoms/PDatePicker'
export { default as PDialog } from './atoms/PDialog'
export { default as PDrawer } from './molecules/PDrawer'
export { default as PDocumentViewer } from './organisms/PDocumentViewer'
export { default as PDoubleText } from './atoms/PDoubleText'
export { default as PEntity } from './atoms/PEntity'
export { default as PFileAndFolderLineCheck } from './molecules/PFileAndFolderLineCheck'
export { default as PFileCard } from './molecules/PFileCard'
export { default as PFolderLineNavigationItem } from './atoms/PFolderLineNavigationItem'
export { default as PHeader } from './molecules/PHeader'
export { default as PHeaderTabs } from './atoms/PHeaderTabs'
export { default as PIcon } from './atoms/PIcon'
export { default as PImage } from './atoms/PImage'
export { default as PLineChart } from './atoms/PLineChart'
export { default as PLoader } from './atoms/PLoader'
export { default as PNavbar } from './molecules/PNavbar'
export { default as PNotificationCard } from './atoms/PNotificationCard'
export { default as POfferCard } from './atoms/POfferCard'
export { default as PPagination } from './atoms/PPagination'
export { default as PPastille } from './atoms/PPastille'
export { default as PPopover } from './molecules/PPopover'
export { default as PTable } from './atoms/PTable'
export { default as PTag } from './atoms/PTag'
export { default as PText } from './atoms/PText'
export { default as PToolbox } from './molecules/PToolbox'
export { default as PToolboxItem } from './atoms/PToolboxItem'
export { default as PTooltip } from './atoms/PTooltip'
export { default as PTree } from './organisms/PTree'
export { default as PUpload } from './atoms/PUpload'

// Export types from components with ENUM
export * from './atoms/PAvatar/PAvatarTypes'
export * from './atoms/PButton/PButtonTypes'
export * from './atoms/PCollapseItem/PCollapseItemTypes'
export * from './atoms/PDoubleText/PDoubleTextTypes'
export * from './atoms/PEntity/PEntityTypes'
export * from './atoms/PHeaderTabs/PHeaderTabsTypes'
export * from './atoms/PImage/PImageTypes'
export * from './atoms/PLoader/PLoaderTypes'
export * from './atoms/PPastille/PPastilleTypes'
export * from './atoms/PTag/PTagTypes'
export * from './atoms/PText/PTextTypes'
export * from './atoms/PToolboxItem/PToolboxItemTypes'
export * from './atoms/PTooltip/PTooltipTypes'

export * from './molecules/PCarousel/PCarouselTypes'
export * from './molecules/PDrawer/PDrawerTypes'
export * from './molecules/PFileAndFolderLineCheck/PFileAndFolderLineCheckTypes'
export * from './molecules/PToolbox/PToolboxTypes'

export * from './organisms/PDocumentViewer/PDocumentViewerTypes'
