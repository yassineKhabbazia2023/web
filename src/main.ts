// base UI library
import ElementPlus, { ElInput, ElRow, ElCol, ElSwitch } from 'element-plus'

// locales
import fr from 'element-plus/es/locale/lang/fr'
import en from 'element-plus/es/locale/lang/en'
import dayjs from 'dayjs'

import './assets/scss/index.scss'

import PLineChart from '@/atoms/PLineChart'
import PButton from '@/atoms/PButton'
import PTable from '@/atoms/PTable'
import PDatePicker from '@/atoms/PDatePicker'
import PAvatar from '@/atoms/PAvatar'
import PIcon from '@/atoms/PIcon'
import PTooltip from '@/atoms/PTooltip'
import PToolboxItem from '@/atoms/PToolboxItem'
import PToolbox from '@/molecules/PToolbox'
import PCheckbox from '@/atoms/PCheckbox'
import PNavbar from '@/molecules/PNavbar'
import PBottomMenu from '@/molecules/PBottomMenu'
import PPastille from '@/atoms/PPastille'
import PTag from '@/atoms/PTag'
import toastPlugin from '@/molecules/PToaster'
import PDropdown from '@/atoms/PDropdown'
import PActionBar from '@/molecules/PActionBar'
import PCarousel from '@/molecules/PCarousel'
import PCarouselItem from '@/atoms/PCarouselItem'
import PDialog from '@/atoms/PDialog'
import PCellEntity from '@/atoms/PCellEntity'
import PCellText from '@/atoms/PCellText'
import PHeader from '@/molecules/PHeader'
import PHeaderTabs from '@/atoms/PHeaderTabs'
import PDrawer from '@/molecules/PDrawer'
import PFileLineNavigationItem from '@/atoms/FileLineNavigationItem'
import PFileAndFolderLineCheck from '@/molecules/PFileAndFolderLineCheck'
import PCellDoubleText from '@/atoms/PCellDoubleText'
import PBreadcrumb from '@/molecules/PBreadcrumb'
import PImage from '@/atoms/PImage'

dayjs.Ls.en.weekStart = 1

export function install(app: any, { i18n }: any) {
  app.use(ElementPlus, { locale: i18n.global.locale === 'fr' ? fr : en })
  app.use(toastPlugin)
  app.component('PCol', ElCol)
  app.component('PRow', ElRow)
  app.component('PButton', PButton)
  app.component('PAvatar', PAvatar)
  app.component('PTooltip', PTooltip)
  app.component('PIcon', PIcon)
  app.component('PInput', ElInput)
  app.component('PDatePicker', PDatePicker)
  app.component('PToolboxItem', PToolboxItem)
  app.component('PToolbox', PToolbox)
  app.component('PCheckbox', PCheckbox)
  app.component('PLineChart', PLineChart)
  app.component('PTable', PTable)
  app.component('PNavbar', PNavbar)
  app.component('PBottomMenu', PBottomMenu)
  app.component('PPastille', PPastille)
  app.component('PTag', PTag)
  app.component('PDropdown', PDropdown)
  app.component('PActionBar', PActionBar)
  app.component('PCarouselItem', PCarouselItem)
  app.component('PCarousel', PCarousel)
  app.component('PDialog', PDialog)
  app.component('PCellEntity', PCellEntity)
  app.component('PCellText', PCellText)
  app.component('PHeader', PHeader)
  app.component('PHeaderTabs', PHeaderTabs)
  app.component('PSwitch', ElSwitch)
  app.component('PDrawer', PDrawer)
  app.component('PFileLineNavigationItem', PFileLineNavigationItem)
  app.component('PFileANdFolderLineCheck', PFileAndFolderLineCheck)
  app.component('PCellDoubleText', PCellDoubleText)
  app.component('PBreadcrumb', PBreadcrumb)
  app.component('PImage', PImage)
}

const plugin = {
  install
}

export default plugin

export * from '@/atoms/PIcon/components'
