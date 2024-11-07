import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import PButton from '@styleguide/atoms/PButton'
import PUpload from '@styleguide/atoms/PUpload'
import PActionBar from './'
import type {
  PActionBarProps,
  PButtonActionBarProps,
  ComponentDefinitionProps,
} from './PActionBarTypes'
import PExpandableSearch from '@styleguide/atoms/PExpandableSearch'
import { nextTick, type ComponentPublicInstance } from 'vue'

type PActionBarSetup = {
  isSearchExpanded: boolean
}

const defaultButtons: ComponentDefinitionProps[] = [
  {
    pButtonName: 'Hello',
    pButtonIcon: 'PISearch',
    pButtonActionName: 'buttonActionName',
    pButton: {
      pType: 'white',
      pSize: 'small',
      pPlain: false,
      pRound: false,
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
  return mount(PActionBar, {
    props,
  }) as unknown as PActionBarWrapper
}

const generateButtonsArray = (nbr: number): ComponentDefinitionProps[] => {
  return Array.from({ length: nbr }, () => ({
    pButtonName: 'Hello',
    pButtonIcon: 'PISearch',
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
        expect(leftZoneBtns.findAllComponents(PButton)).toHaveLength(3)
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
        const button = leftZoneWrapper.find('button')

        expect(button.classes().includes('is-circle')).toBeTruthy()
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

        const pUploadWrapper = wrapper.findComponent(PUpload)
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

      const pSearchWrapper = wrapper.findComponent(PExpandableSearch)
      expect(pSearchWrapper.exists()).toBeTruthy()
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
      expect(rightZoneBtns.findAllComponents(PButton)).toHaveLength(5)
    })

    it('should change buttons shape to circle upon  search-expand-change', async () => {
      const wrapper = createWrapper({
        pLeftSideButtons: [
          {
            pButton: {
              pType: 'white',
              pSize: 'small',
              pPlain: false,
              pRound: false,
              pCircle: true,
              pLoading: false,
              pDisabled: false,
            },
            pButtonName: 'Hello',
            pButtonActionName: 'buttonActionName',
            pButtonIcon: 'PISearch',
            pComponentType: 'SEARCH',
          },
        ],
        pRightSideButtons: defaultProps.pRightSideButtons,
      })

      const pSearchWrapper = wrapper.findComponent(PExpandableSearch)
      pSearchWrapper.vm.$emit('search-expand-change', true)
      await nextTick()
      const rightIconsWrapper = wrapper.find('.p-action-bar__right')
      const rightIconSampleButon = rightIconsWrapper.findAllComponents(PButton)[0]

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
        pButtonIcon: 'PISearch',
        pButton: {
          pType: 'white',
          pSize: 'small',
          pPlain: false,
          pRound: false,
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
      .findAllComponents(PButton)[0]

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
        pButtonIcon: 'PISearch',
        pButton: {
          pType: 'white',
          pSize: 'small',
          pPlain: false,
          pRound: false,
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
      .findAllComponents(PButton)[0]

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
            pPlain: false,
            pRound: false,
            pCircle: true,
            pLoading: false,
            pDisabled: false,
          },
          pButtonName: 'Hello',
          pButtonActionName: 'buttonActionName',
          pButtonIcon: 'PISearch',
          pComponentType: 'UPLOAD',
        },
      ],
      pRightSideButtons: defaultProps.pRightSideButtons,
    })

    const pUploadWrapper = wrapper.findComponent(PUpload)
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
            pPlain: false,
            pRound: false,
            pCircle: true,
            pLoading: false,
            pDisabled: false,
          },
          pButtonName: 'Hello',
          pButtonActionName: 'buttonActionName',
          pButtonIcon: 'PISearch',
          pComponentType: 'SEARCH',
        },
      ],
      pRightSideButtons: defaultProps.pRightSideButtons,
    })

    const pSearchWrapper = wrapper.findComponent(PExpandableSearch)
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
            pPlain: false,
            pRound: false,
            pCircle: true,
            pLoading: false,
            pDisabled: false,
          },
          pButtonName: 'Hello',
          pButtonActionName: 'buttonActionName',
          pButtonIcon: 'PISearch',
          pComponentType: 'SEARCH',
        },
      ],
      pRightSideButtons: defaultProps.pRightSideButtons,
    })

    const pSearchWrapper = wrapper.findComponent(PExpandableSearch)
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
              pPlain: false,
              pRound: false,
              pCircle: true,
              pLoading: false,
              pDisabled: false,
            },
            pButtonName: 'Hello',
            pButtonActionName: 'buttonActionName',
            pButtonIcon: 'PISearch',
            pComponentType: 'SEARCH',
          },
        ],
        pRightSideButtons: defaultProps.pRightSideButtons,
      })

      const pSearchWrapper = wrapper.findComponent(PExpandableSearch)
      pSearchWrapper.vm.$emit('search-expand-change', true)

      expect(wrapper.emitted('search-expand-change')).toStrictEqual([[true]])
    },
  )
})
