import { type StubbedComponents, type VueComponent } from './types'

const elements: VueComponent[] = [
  {
    name: 'ElTable',
    template: '<div><slot name="empty"/><slot /></div>',
    props: [
      'data',
      'class',
      'showHeader',
      'style',
      'emptyText',
      'cellClassName'
    ]
  },
  {
    name: 'ElUpload'
  },
  {
    name: 'ElBreadcrumb'
  },
  {
    name: 'ElBreadcrumbItem'
  },
  {
    name: 'ElCard'
  },
  {
    name: 'ElRadioGroup',
    props: ['modelValue']
  },
  {
    template: '<div><slot name="title"/><slot /><slot name="footer"/></div>',
    name: 'ElDialog',
    props: ['modelValue']
  },
  {
    name: 'ElDatePicker',
    props: ['modelValue', 'placeholder', 'disabled-date']
  },
  {
    name: 'ElSelect',
    props: ['modelValue']
  },
  {
    name: 'ElOption'
  },
  {
    name: 'ElButton'
  },
  {
    name: 'ElTabs'
  },
  {
    name: 'ElTabPane'
  },
  {
    name: 'ElPagination'
  },
  {
    name: 'ElScrollbar'
  },
  {
    name: 'ElCollapseTransition'
  },
  {
    template: '<div><slot name="prefix"/><slot /><slot name="append"/></div>',
    name: 'ElInput',
    props: ['modelValue']
  },
  {
    name: 'ElDropdownItem',
    props: ['disabled', 'icon'],
    template: '<slot/>'
  },
  {
    name: 'ElDropdown',
    props: ['trigger'],
    template: '<slot/><slot name="dropdown" />'
  },
  {
    name: 'ElDropdownMenu',
    template: '<slot/>'
  },
  {
    name: 'ElTooltip',
    template: '<div><slot/><slot name="content" /></div>'
  },
  {
    name: 'ElBadge'
  },
  {
    name: 'ElTableColumn',
    template:
      '<slot :row="{ id: 45, permissions: [`CAN_RESTORE_DOCUMENT`] }" />'
  },
  {
    name: 'ElTag'
  },
  {
    name: 'ElDrawer'
  },
  {
    name: 'ElTree',
    template: '<div><slot :node="{ id: 19 }" :data="{ id: 19 }" /></div>'
  },
  {
    name: 'ElCheckboxGroup'
  },
  {
    name: 'ElCheckbox'
  }
]

const useElement = (): StubbedComponents => {
  const result: StubbedComponents = {}

  const template = '<div><slot/></div>'

  elements.forEach((element) => {
    result[element.name] = {
      ...element,
      template: element.template ?? template
    }
  })

  return result
}

export default useElement
