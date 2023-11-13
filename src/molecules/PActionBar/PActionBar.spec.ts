import { describe, it, expect, vi, beforeEach } from 'vitest'
import PActionBar from '@/molecules/PActionBar'
import type { PActionBarProps, PButtonActionBarProps } from './PActionBarTypes'

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
      pDisabled: false
    }
  }
] as PButtonActionBarProps[]

const defaultProps: PActionBarProps = {
  pRightSideButtons: defaultButtons,
  pLeftSideButtons: defaultButtons
}

const createWrapper = (props = defaultProps) => {
  return mount(PActionBar, {
    props

  })
}
const generateButtonsArray = (nbr: number): ComponentDefinitionProps[] => {
  return Array.from({ length: nbr }, () => ({
    pButtonName: 'Hello',
    pButton: {}
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
        const buttons = generateButtonsArray(10) as PButtonActionBarProps[]
        const wrapper = createWrapper({
          pLeftSideButtons: buttons,
          pRightSideButtons: defaultProps.pRightSideButtons
        })
        const leftZoneBtns = wrapper.find('.p-action-bar__left')
        expect(leftZoneBtns.findAllComponents(PButton)).toHaveLength(3)
      })
      it('should add the class "el-button--icon" when the button dose not contain a value', () => {
        const buttons =
          [
            {
              ...defaultButtons, pButtonName: '', pButton: {}
            }
          ] as unknown as PButtonActionBarProps[]

        const wrapper = createWrapper({
          pLeftSideButtons: buttons,
          pRightSideButtons: defaultProps.pRightSideButtons
        })
        const leftZoneWrapper = wrapper.find('.p-action-bar__left')
        const button = leftZoneWrapper.find('button')

        expect(button.classes().includes('is-circle')).toBeTruthy()
      })

      it('should display the button in a rounded shape', () => {
        const buttons = [
          { ...defaultButtons, pButtonName: '', pButton: {} }
        ] as unknown as PButtonActionBarProps[]

        const wrapper = createWrapper({
          pLeftSideButtons: buttons,
          pRightSideButtons: defaultProps.pRightSideButtons
        })
        const button = wrapper
          .find('.p-action-bar__left')
          .findAll('p-button-stub')[0]
        expect(button.attributes('pcircle')).toBe('true')
      })
    })
    describe('right side', () => {
      it('should display only 5 buttons in the right side of action bar layout', () => {
        const buttons = generateButtonsArray(10) as PButtonActionBarProps[]
        const wrapper = createWrapper({
          pLeftSideButtons: defaultProps.pLeftSideButtons,
          pRightSideButtons: buttons
        })
        const rightZoneBtns = wrapper.find('.p-action-bar__right')
        expect(rightZoneBtns.findAllComponents(PButton)).toHaveLength(5)
      })
    })
  })
  describe('events', () => {
    it('should emit the provided buttonActionName event on click', async () => {
      const buttons = [
        { ...defaultButtons, pButtonActionName: 'Hello i am your action', pButton: {} }
      ] as unknown as PButtonActionBarProps[]

      const wrapper = createWrapper({
        pLeftSideButtons: buttons,
        pRightSideButtons: defaultProps.pRightSideButtons
      })
      const button = wrapper
        .find('.p-action-bar__left')
        .findAllComponents(PButton)[0]

      await button.trigger('click')

      expect(wrapper.emitted('p-action-bar-button-clicked')).toHaveLength(1)
      expect(wrapper.emitted('p-action-bar-button-clicked')).toStrictEqual([
        ['Hello i am your action']
      ])
    })

    it('should emit files-selected on PUpload files selected event', async () => {
      const f = {
        name: 'image.png',
        size: 1,
        type: 'image/png'
      }

      const wrapper = createWrapper({
        leftSideButtons: [
          {
            buttonName: 'Hello',
            buttonType: 'white',
            buttonIcon: 'PISearch',
            buttonActionName: 'buttonActionName',
            size: 'small',
            plain: false,
            round: false,
            circle: true,
            loading: false,
            disabled: false,
            componentType: 'UPLOAD'
          }
        ],
        rightSideButtons: defaultProps.rightSideButtons
      })

      const pUploadWrapper = wrapper.findComponent(PUpload)
      pUploadWrapper.vm.$emit('files-selected', [f])

      expect(wrapper.emitted('p-upload-files-selected')).toHaveLength(1)
    })
  })
})
