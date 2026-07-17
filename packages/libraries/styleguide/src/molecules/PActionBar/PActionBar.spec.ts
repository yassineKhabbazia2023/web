import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import PActionBar from './'
import type {
  PActionBarProps,
  PButtonActionBarProps,
  ComponentDefinitionProps,
} from './PActionBarTypes'
import { nextTick, type ComponentPublicInstance } from 'vue'

type PActionBarSetup = {
  isSearchExpanded: boolean
}

const defaultButtons: ComponentDefinitionProps[] = [
  {
    pButtonName: 'Hello',
    pButtonIconName: 'search',
    pButtonActionName: 'buttonActionName',
    pButton: {
      pType: 'white',
      pSize: 'small',
      pCircle: true,
      pLoading: false,
      pDisabled: false,
    },
  },
] as PButtonActionBarProps[]

const defaultProps: PActionBarProps = {
  pRightSideButtons: defaultButtons,
  pLeftSideButtons: defaultButtons,
}
export type PActionBarWrapper = VueWrapper<
  ComponentPublicInstance<PButtonActionBarProps, PActionBarSetup>
>

const createWrapper = (
  props: PActionBarProps = defaultProps,
): PActionBarWrapper => {
  return shallowMount(PActionBar, {
    props,
    global: {
      stubs: {
        PUpload: {
          name: 'PUpload',
          template: '<div><slot /></div>',
        },
        PButton: {
          name: 'PButton',
          template: '<div><slot /></div>',
          props: [
            'pCircle',
          ],
        },
        PIcon: {
          name: 'PIcon',
          template: '<div><slot /></div>',
        },
        PExpandableSearch: {
          name: 'PExpandableSearch',
          template: '<div><slot /></div>',
        },
      },
    },
  }) as unknown as PActionBarWrapper
}

const generateButtonsArray = (nbr: number): ComponentDefinitionProps[] => {
  return Array.from({ length: nbr }, () => ({
    pButtonName: 'Hello',
    pButtonIconName: 'search',
    pButtonActionName: 'action',
    pButton: {
      ...defaultButtons[0].pButton,
    },
  }))
}

describe('pActionBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetAllMocks()
  })
  describe('props', () => {
    describe('left side', () => {
      it('should display only 3 buttons', () => {
        const buttons = generateButtonsArray(10)
        const wrapper = createWrapper({
          pLeftSideButtons: buttons,
          pRightSideButtons: defaultProps.pRightSideButtons,
        })
        const leftZoneBtns = wrapper.find('.p-action-bar__left')
        expect(leftZoneBtns.findAllComponents({ name: 'PButton' })).toHaveLength(3)
      })

      it('should display the button in a rounded shape  if the button contain only an icon', () => {
        const buttons: ComponentDefinitionProps[] = [
          { ...defaultButtons[0], pButtonName: '' },
        ]

        const wrapper = createWrapper({
          pLeftSideButtons: buttons,
          pRightSideButtons: defaultProps.pRightSideButtons,
        })
        const leftZoneWrapper = wrapper.find('.p-action-bar__left')
        const pButton = leftZoneWrapper.findComponent({ name: 'PButton' })

        expect(pButton.props('pCircle')).toBeTruthy()
      })

      it('should display pupload when pComponentType is UPLOAD', () => {
        const pUploadButton: ComponentDefinitionProps = {
          ...defaultButtons[0],
          pComponentType: 'UPLOAD',
        }

        const wrapper = createWrapper({
          pLeftSideButtons: [pUploadButton],
          pRightSideButtons: defaultProps.pRightSideButtons,
        })

        const pUploadWrapper = wrapper.findComponent({ name: 'PUpload' })
        expect(pUploadWrapper.exists()).toBeTruthy()
      })
    })
    it('should display PSEARCH when pComponentType is SEARCH', () => {
      const pSearchButton: ComponentDefinitionProps = {
        ...defaultButtons[0],
        pComponentType: 'SEARCH',
      }

      const wrapper = createWrapper({
        pLeftSideButtons: [pSearchButton],
        pRightSideButtons: defaultProps.pRightSideButtons,
      })

      const pSearchWrapper = wrapper.findComponent({ name: 'PExpandableSearch' })
      expect(pSearchWrapper.exists()).toBeTruthy()
    })

    it.each([
      {
        testName: 'it should show the tooltip when upload button is disabled',
        isButtonDisabled: true,
        shouldTooltipBeDisabled: false,
      },
      {
        testName: 'it should hide the tooltip when upload button is enabled',
        isButtonDisabled: false,
        shouldTooltipBeDisabled: true,
      },
    ])('$testName', ({ isButtonDisabled, shouldTooltipBeDisabled }) => {
      const disabledUploadButton = defaultButtons[0]
      disabledUploadButton.pButton.pDisabled = isButtonDisabled
      const pUploadButton: ComponentDefinitionProps = {
        ...disabledUploadButton,
        pComponentType: 'UPLOAD',
        pTooltipContent: 'this is a tooltip',
      }

      const wrapper = createWrapper({
        pLeftSideButtons: [pUploadButton],
        pRightSideButtons: defaultProps.pRightSideButtons,
      })

      const pUploadWrapper = wrapper.findComponent({ name: 'PUpload' })
      const pTooltipWrapper = pUploadWrapper.findComponent({ name: 'PTooltip' })

      expect(pTooltipWrapper.props('disabled')).toBe(shouldTooltipBeDisabled)
    })
  })

  describe('right side', () => {
    it('should display only 5 buttons in the right side of action bar layout', () => {
      const buttons = generateButtonsArray(10)
      const wrapper = createWrapper({
        pLeftSideButtons: defaultProps.pLeftSideButtons,
        pRightSideButtons: buttons,
      })
      const rightZoneBtns = wrapper.find('.p-action-bar__right')
      expect(rightZoneBtns.findAllComponents({ name: 'PButton' })).toHaveLength(5)
    })

    it('should change buttons shape to circle upon  search-expand-change', async () => {
      const wrapper = createWrapper({
        pLeftSideButtons: [
          {
            pButton: {
              pType: 'white',
              pSize: 'small',
              pCircle: true,
              pLoading: false,
              pDisabled: false,
            },
            pButtonName: 'Hello',
            pButtonActionName: 'buttonActionName',
            pButtonIconName: 'search',
            pComponentType: 'SEARCH',
          },
        ],
        pRightSideButtons: defaultProps.pRightSideButtons,
      })

      const pSearchWrapper = wrapper.findComponent({ name: 'PExpandableSearch' })
      pSearchWrapper.vm.$emit('search-expand-change', true)
      await nextTick()
      const rightIconsWrapper = wrapper.find('.p-action-bar__right')
      const rightIconSampleButon = rightIconsWrapper.findAllComponents({ name: 'PButton' })[0]

      expect(rightIconSampleButon.props('pCircle')).toBeTruthy()
    })
  })
})
describe('events', () => {
  it('should emit the provided left buttonActionName event on click', async () => {
    const buttons: ComponentDefinitionProps[] = [
      {
        pButtonName: 'Hello',
        pButtonActionName: 'Hello i am your action',
        pButtonIconName: 'search',
        pButton: {
          pType: 'white',
          pSize: 'small',
          pCircle: true,
          pLoading: false,
          pDisabled: false,
        },
      },
    ]

    const wrapper = createWrapper({
      pLeftSideButtons: defaultProps.pLeftSideButtons,
      pRightSideButtons: buttons,
    })
    const button = wrapper
      .find('.p-action-bar__right')
      .findAllComponents({ name: 'PButton' })[0]

    await button.trigger('click')

    expect(wrapper.emitted('p-action-bar-button-clicked')).toHaveLength(1)
    expect(wrapper.emitted('p-action-bar-button-clicked')).toStrictEqual([
      ['Hello i am your action'],
    ])
  })

  it('should emit the provided right buttonActionName event on click', async () => {
    const buttons: ComponentDefinitionProps[] = [
      {
        pButtonName: 'Hello',
        pButtonActionName: 'Hello i am your action',
        pButtonIconName: 'search',
        pButton: {
          pType: 'white',
          pSize: 'small',
          pCircle: true,
          pLoading: false,
          pDisabled: false,
        },
      },
    ]

    const wrapper = createWrapper({
      pLeftSideButtons: buttons,
      pRightSideButtons: defaultProps.pRightSideButtons,
    })
    const button = wrapper
      .find('.p-action-bar__left')
      .findAllComponents({ name: 'PButton' })[0]

    await button.trigger('click')

    expect(wrapper.emitted('p-action-bar-button-clicked')).toHaveLength(1)
    expect(wrapper.emitted('p-action-bar-button-clicked')).toStrictEqual([
      ['Hello i am your action'],
    ])
  })

  it('should emit files-selected on PUpload files selected event', () => {
    const f = {
      name: 'image.png',
      size: 1,
      type: 'image/png',
    }

    const wrapper = createWrapper({
      pLeftSideButtons: [
        {
          pButton: {
            pType: 'white',
            pSize: 'small',
            pCircle: true,
            pLoading: false,
            pDisabled: false,
          },
          pButtonName: 'Hello',
          pButtonActionName: 'buttonActionName',
          pButtonIconName: 'search',
          pComponentType: 'UPLOAD',
        },
      ],
      pRightSideButtons: defaultProps.pRightSideButtons,
    })

    const pUploadWrapper = wrapper.findComponent({ name: 'PUpload' })
    pUploadWrapper.vm.$emit('files-selected', [f])

    expect(wrapper.emitted('p-upload-files-selected')).toHaveLength(1)
  })

  it('should emit p-search-input on PSearch files selected event', () => {
    const searchInput = 'this is the search input'

    const wrapper = createWrapper({
      pLeftSideButtons: [
        {
          pButton: {
            pType: 'white',
            pSize: 'small',
            pCircle: true,
            pLoading: false,
            pDisabled: false,
          },
          pButtonName: 'Hello',
          pButtonActionName: 'buttonActionName',
          pButtonIconName: 'search',
          pComponentType: 'SEARCH',
        },
      ],
      pRightSideButtons: defaultProps.pRightSideButtons,
    })

    const pSearchWrapper = wrapper.findComponent({ name: 'PExpandableSearch' })
    pSearchWrapper.vm.$emit('update:p-search-content', searchInput)

    expect(wrapper.emitted('p-search-input')).toHaveLength(1)
  })

  it('should check the state of the imput extended or not', () => {
    const wrapper = createWrapper({
      pLeftSideButtons: [
        {
          pButton: {
            pType: 'white',
            pSize: 'small',
            pCircle: true,
            pLoading: false,
            pDisabled: false,
          },
          pButtonName: 'Hello',
          pButtonActionName: 'buttonActionName',
          pButtonIconName: 'search',
          pComponentType: 'SEARCH',
        },
      ],
      pRightSideButtons: defaultProps.pRightSideButtons,
    })

    const pSearchWrapper = wrapper.findComponent({ name: 'PExpandableSearch' })
    pSearchWrapper.vm.$emit('search-expand-change', true)

    expect(wrapper.vm.isSearchExpanded).toBeTruthy()
  })

  it(
    'should emit search-expand-change upon PExpandableSearch search-expand-change event', () => {
      const wrapper = createWrapper({
        pLeftSideButtons: [
          {
            pButton: {
              pType: 'white',
              pSize: 'small',
              pCircle: true,
              pLoading: false,
              pDisabled: false,
            },
            pButtonName: 'Hello',
            pButtonActionName: 'buttonActionName',
            pButtonIconName: 'search',
            pComponentType: 'SEARCH',
          },
        ],
        pRightSideButtons: defaultProps.pRightSideButtons,
      })

      const pSearchWrapper = wrapper.findComponent({ name: 'PExpandableSearch' })
      pSearchWrapper.vm.$emit('search-expand-change', true)

      expect(wrapper.emitted('search-expand-change')).toStrictEqual([[true]])
    },
  )
})
