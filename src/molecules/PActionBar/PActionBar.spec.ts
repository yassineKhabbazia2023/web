import { describe, it, expect } from 'vitest'
import wrapperFactory from 'tests/utils/wrapperFactory'
import PActionBar from '@/molecules/PActionBar'

type Buttons = {
  buttonName: string,
  buttonType: string,
  buttonIcon: string,
  buttonActionName: string,
  size: string,
  plain: Boolean,
  round: Boolean,
  circle: Boolean,
  loading: Boolean,
  disabled: Boolean
}

type PActionBarProps = {
  rightSideButtons: Buttons[];
  leftSideButtons: Buttons[];
};

const defaultButtons = [
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
] as Buttons[]

const defaultProps: PActionBarProps = {
  rightSideButtons: defaultButtons,
  leftSideButtons: defaultButtons
}

const createWrapper = (props = defaultProps) =>
  wrapperFactory(PActionBar, {
    props
  })
const generateButtonsArray = (nbr:number) => {
  return Array.from({ length: nbr }, () => ({
    buttonName: 'Hello'
  }))
}

describe('pActionBar', () => {

  describe('props', () => {
    describe('left side', () => {
      it('should display only 3 buttons', () => {
        const buttons = generateButtonsArray(10) as Buttons[]
        const wrapper = createWrapper({
          leftSideButtons: buttons,
          rightSideButtons: defaultProps.rightSideButtons
        })
        const leftZoneBtns = wrapper.find('.p-action-bar__left')
        expect(leftZoneBtns.findAll('p-button-stub')).toHaveLength(3)
      })
      it('should remove the 10px gap if the button contain only an icon', () => {

        const buttons = [{ ...defaultButtons, buttonName: '' }] as unknown as Buttons[]

        const wrapper = createWrapper({
          leftSideButtons: buttons,
          rightSideButtons: defaultProps.rightSideButtons
        })
        const button = wrapper.find('.p-action-bar__left').findAll('p-button-stub')[0]

        expect(button.classes().includes('el-button--icon')).toBeTruthy()

      })

      it('should display the button in a rounded shape  if the button contain only an icon', () => {

        const buttons = [
          { ...defaultButtons, buttonName: '' }
        ] as unknown as Buttons[]

        const wrapper = createWrapper({
          leftSideButtons: buttons,
          rightSideButtons: defaultProps.rightSideButtons
        })
        const button = wrapper
          .find('.p-action-bar__left')
          .findAll('p-button-stub')[0]

        expect(button.attributes('circle')).toBe('true')
      })

    })
    describe('right side', () => {
      it('should display only 5 buttons in the right side of action bar layout', () => {
        const buttons = generateButtonsArray(10) as Buttons[]
        const wrapper = createWrapper({
          leftSideButtons: defaultProps.leftSideButtons,
          rightSideButtons: buttons
        })
        const rightZoneBtns = wrapper.find('.p-action-bar__right')
        expect(rightZoneBtns.findAll('p-button-stub')).toHaveLength(5)
      })
    })
  })
  describe('events', () => {
    it('should emit the provded buttonActionName event on click', async () => {

      const buttons = [
        { ...defaultButtons, buttonActionName: 'Hello i am your action' }
      ] as unknown as Buttons[]

      const wrapper = createWrapper({
        leftSideButtons: buttons,
        rightSideButtons: defaultProps.rightSideButtons
      })
      const button = wrapper
        .find('.p-action-bar__left')
        .findAll('p-button-stub')[0]

      await button.trigger('click')

      expect(wrapper.emitted('Hello i am your action')).toHaveLength(1)
    })
  })
})

