import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import LaunchCard from '.'
import type { LaunchCardProps } from './LaunchCardTypes'

const defaultProps: LaunchCardProps = {
  title: 'Title',
  subtitle: 'Sub-title',
  imageType: 'image-type',
  imageName: 'image-name',
  actionLabel: 'action-label',
  actionUrl: 'action-url',
  downloadLabel: 'Download',
}

function getWrapper(override: Partial<LaunchCardProps> = {}) {
  const props = {
    ...defaultProps,
    ...override,
  }
  return shallowMount(LaunchCard, {
    props,
    global: {
      stubs: {
        PButton: {
          template: '<div><slot /></div>',
        },
        PIcon: {
          template: '<div><slot /></div>',
        },
      },
    },
  })
}

describe('test LaunchCard', () => {
  describe('default display', () => {
    const wrapper = getWrapper()
    it('proper image pName and pType', () => {
      const image = wrapper.find('[data-testid="launch-card-image"]')

      expect(image.attributes('pname')).toBe(defaultProps.imageName)
      expect(image.attributes('ptype')).toBe(defaultProps.imageType)
    })

    it('proper title', () => {
      const title = wrapper.find('[data-testid="launch-card-title"]')

      expect(title.text()).toBe(defaultProps.title)
    })

    it('proper subtitle', () => {
      const subtitle = wrapper.find('[data-testid="launch-card-subtitle"]')

      expect(subtitle.text()).toBe(defaultProps.subtitle)
    })

    it('proper download button', () => {
      const download = wrapper.find('[data-testid="launch-card-download"]')

      expect(download.text()).toBe('Download')
    })

    it('proper action button', () => {
      const action = wrapper.find('[data-testid="launch-card-action"]')

      expect(action.text()).toBe(defaultProps.actionLabel)
      expect(action.attributes('href')).toBe(defaultProps.actionUrl)
    })
  })

  describe('when no downloadButton', () => {
    const wrapper = getWrapper({ downloadLabel: '' })

    it('do not display download button', () => {
      const download = wrapper.find('[data-testid="launch-card-download"]')

      expect(download.exists()).toBeFalsy()
    })
  })

  describe('when no actionUrl', () => {
    const wrapper = getWrapper({ actionUrl: '' })

    it('do not set href', () => {
      const action = wrapper.find('[data-testid="launch-card-action"]')

      expect(action.attributes('href')).toBeUndefined()
    })
  })

  describe('when no actionLabel', () => {
    const wrapper = getWrapper({ actionLabel: '' })

    it('do not display action button', () => {
      const action = wrapper.find('[data-testid="launch-card-action"]')

      expect(action.exists()).toBeFalsy()
    })
  })

  describe('when click on download button', () => {
    const wrapper = getWrapper()

    it('emits click-download', async () => {
      const action = wrapper.findComponent('[data-testid="launch-card-download"]')

      await action.trigger('click')
      expect(wrapper.emitted('click-download')).toStrictEqual([[]])
    })
  })

  describe('when click on action button', () => {
    const wrapper = getWrapper()

    it('emits click-action', async () => {
      const action = wrapper.findComponent('[data-testid="launch-card-action"]')

      await action.trigger('click')
      expect(wrapper.emitted('click-action')).toStrictEqual([[]])
    })
  })
})
