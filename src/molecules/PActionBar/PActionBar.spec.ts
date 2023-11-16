import { describe, it, expect, vi, beforeEach } from 'vitest'
import PActionBar from '@/molecules/PActionBar'
import PUpload from '@/atoms/PUpload'
import PButton from '@/atoms/PButton'
import { mount } from '@vue/test-utils'
import type { ComponentDefinitionProps } from './PActionBarTypes'

type PActionBarProps = {
  rightSideButtons: ComponentDefinitionProps[]
  leftSideButtons: ComponentDefinitionProps[]
}

const defaultButtons: ComponentDefinitionProps[] = [
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
    disabled: false
  }
]

const defaultProps: PActionBarProps = {
  rightSideButtons: defaultButtons,
  leftSideButtons: defaultButtons
}

const createWrapper = (props = defaultProps) => {
  return mount(PActionBar, {
    props

  })
}
const generateButtonsArray = (nbr: number): ComponentDefinitionProps[] => {
  return Array.from({ length: nbr }, () => ({
    buttonName: 'Hello',
    buttonIcon: 'PISearch'
  } as ComponentDefinitionProps))
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
          leftSideButtons: buttons,
          rightSideButtons: defaultProps.rightSideButtons
        })
        const leftZoneBtns = wrapper.find('.p-action-bar__left')
        expect(leftZoneBtns.findAllComponents(PButton)).toHaveLength(3)
      })

      it('should display the button in a rounded shape  if the button contain only an icon', () => {
        const buttons: ComponentDefinitionProps[] = [
          { ...defaultButtons[0], buttonName: '' }
        ]

        const wrapper = createWrapper({
          leftSideButtons: buttons,
          rightSideButtons: defaultProps.rightSideButtons
        })
        const leftZoneWrapper = wrapper.find('.p-action-bar__left')
        const button = leftZoneWrapper.find('button')

        expect(button.classes().includes('is-circle')).toBeTruthy()
      })
      it('should display pupload when componentType is UPLOAD', () => {
        const pUploadButton: ComponentDefinitionProps = {
          ...defaultButtons[0],
          componentType: 'UPLOAD'
        }

        const wrapper = createWrapper({
          leftSideButtons: [pUploadButton],
          rightSideButtons: defaultProps.rightSideButtons
        })

        const pUploadWrapper = wrapper.findComponent(PUpload)
        expect(pUploadWrapper.exists()).toBeTruthy()
      })
    })
    describe('right side', () => {
      it('should display only 5 buttons in the right side of action bar layout', () => {
        const buttons = generateButtonsArray(10)
        const wrapper = createWrapper({
          leftSideButtons: defaultProps.leftSideButtons,
          rightSideButtons: buttons
        })
        const rightZoneBtns = wrapper.find('.p-action-bar__right')
        expect(rightZoneBtns.findAllComponents(PButton)).toHaveLength(5)
      })
    })
  })
  describe('events', () => {
    it('should emit the provided buttonActionName event on click', async () => {
      const buttons: ComponentDefinitionProps[] = [
        {
          buttonName: 'Hello',
          buttonType: 'white',
          buttonIcon: 'PISearch',
          buttonActionName: 'Hello i am your action',
          size: 'small',
          plain: false,
          round: false,
          circle: true,
          loading: false,
          disabled: false
        }
      ]

      const wrapper = createWrapper({
        leftSideButtons: buttons,
        rightSideButtons: defaultProps.rightSideButtons
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
