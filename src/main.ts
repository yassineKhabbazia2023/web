// base UI library
import ElementPlus, {
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElOption,
  ElOptionGroup,
  ElRow,
  ElSelect,
  ElStep,
  ElSteps,
  ElSwitch,
  ElTableColumn,
  ElTabPane,
  ElTabs
} from 'element-plus'

// locales
import fr from 'element-plus/es/locale/lang/fr'
import en from 'element-plus/es/locale/lang/en'
import dayjs from 'dayjs'

import './assets/scss/index.scss'

import PActionBar from '@/molecules/PActionBar'
import PAlert from '@/atoms/PAlert'
import PAvatar from '@/atoms/PAvatar'
import PButton from '@/atoms/PButton'
import PBottomMenu from '@/molecules/PBottomMenu'
import PBreadcrumb from '@/molecules/PBreadcrumb'
import PCarousel from '@/molecules/PCarousel'
import PCarouselItem from '@/atoms/PCarouselItem'
import PDoubleText from '@/atoms/PDoubleText'
import PEntity from '@/atoms/PEntity'
import PText from '@/atoms/PText'
import PCheckbox from '@/atoms/PCheckbox'
import PDatePicker from '@/atoms/PDatePicker'
import PDialog from '@/atoms/PDialog'
import PDrawer from '@/molecules/PDrawer'
import PFileAndFolderLineCheck from '@/molecules/PFileAndFolderLineCheck'
import PFileCard from '@/molecules/PFileCard'
import PFileLineNavigationItem from '@/atoms/FileLineNavigationItem'
import PHeader from '@/molecules/PHeader'
import PHeaderTabs from '@/atoms/PHeaderTabs'
import PIcon from '@/atoms/PIcon'
import PImage from '@/atoms/PImage'
import PLineChart from '@/atoms/PLineChart'
import PNavbar from '@/molecules/PNavbar'
import PPagination from '@/atoms/PPagination'
import PPastille from '@/atoms/PPastille'
import PTable from '@/atoms/PTable'
import PTag from '@/atoms/PTag'
import PToolbox from '@/molecules/PToolbox'
import PToolboxItem from '@/atoms/PToolboxItem'
import PTooltip from '@/atoms/PTooltip'
import PTree from '@/organisms/PTree'
import PPopover from '@/molecules/PPopover'

import toastPlugin from '@/molecules/PToaster'

dayjs.Ls.en.weekStart = 1

export function install(app: any, { i18n }: any) {
  app.use(ElementPlus, { locale: i18n.global.locale === 'fr' ? fr : en })
  app.use(toastPlugin)
  app.component('PActionBar', PActionBar)
  app.component('PAlert', PAlert)
  app.component('PAvatar', PAvatar)
  app.component('PBottomMenu', PBottomMenu)
  app.component('PButton', PButton)
  app.component('PBreadcrumb', PBreadcrumb)
  app.component('PCarousel', PCarousel)
  app.component('PCarouselItem', PCarouselItem)
  app.component('PDoubleText', PDoubleText)
  app.component('PEntity', PEntity)
  app.component('PText', PText)
  app.component('PCheckbox', PCheckbox)
  app.component('PCol', ElCol)
  app.component('PDatePicker', PDatePicker)
  app.component('PDialog', PDialog)
  app.component('PDrawer', PDrawer)
  app.component('PDropdown', ElSelect)
  app.component('PFileAndFolderLineCheck', PFileAndFolderLineCheck)
  app.component('PFileCard', PFileCard)
  app.component('PFileLineNavigationItem', PFileLineNavigationItem)
  app.component('PForm', ElForm)
  app.component('PFormItem', ElFormItem)
  app.component('PHeader', PHeader)
  app.component('PHeaderTabs', PHeaderTabs)
  app.component('PIcon', PIcon)
  app.component('PImage', PImage)
  app.component('PInput', ElInput)
  app.component('PLineChart', PLineChart)
  app.component('PNavbar', PNavbar)
  app.component('POptionGroup', ElOptionGroup)
  app.component('POption', ElOption)
  app.component('PPagination', PPagination)
  app.component('PPastille', PPastille)
  app.component('PStepItem', ElStep)
  app.component('PSteps', ElSteps)
  app.component('PRow', ElRow)
  app.component('PSwitch', ElSwitch)
  app.component('PTable', PTable)
  app.component('PTableColumn', ElTableColumn)
  app.component('PTabPane', ElTabPane)
  app.component('PTabs', ElTabs)
  app.component('PTag', PTag)
  app.component('PToolbox', PToolbox)
  app.component('PToolboxItem', PToolboxItem)
  app.component('PTooltip', PTooltip)
  app.component('PTree', PTree)
  app.component('PPopover', PPopover)
}

const plugin = {
  install
}

export default plugin

export * from './atoms/PIcon/components'
