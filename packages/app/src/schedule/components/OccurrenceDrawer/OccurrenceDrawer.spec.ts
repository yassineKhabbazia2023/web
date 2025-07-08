import { nextTick } from 'vue'
import wrapperFactory from '@app/__mocks__/wrapper.factory'
import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import { expect, describe, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import type { OccurrenceDrawerProps } from './OccurrenceDrawerTypes'
import { getOccurrenceAttachmentMock, getOccurrenceMock, scheduleServicesMock } from '@app/__mocks__/schedule.service.mocks'
import { getMockedOccurrence, getMockedScheduleOccurrence } from '@app/__mocks__/occurrence.mocks'
import * as scheduleServices from '@app/schedule/services'
import { downloadFile, saveFileAs } from '@app/schedule/helpers/utils'
import { AmplitudeService as AmplitudeServiceMock } from '@pulse/common/services/amplitude'

import OccurrenceDrawer from '.'

const mockedOccurrence = getMockedOccurrence({
  schedule: getMockedScheduleOccurrence({
    frequency: 'Monthly',
    description: 'Description',
  }),
})
const fileName = 'declaration_tva_mai_2024.pdf'
const attachmentContent = 'schedule attachment data'

interface Window {
  showSaveFilePicker: any
  URL: any
  atob: any
}
declare let window: Window

vi.mock('@pulse/core', async (importActual) => {
  const actual = await importActual() as Record<string, any>
  return {
    ...actual,
    logger: loggerMock,
  }
})

vi.mock('@app/schedule/services', () => scheduleServicesMock)

vi.mock('./OccurrenceDrawerHelper', async (importActual) => {
  const actual = await importActual() as Record<string, any>

  return {
    ...actual,
    getFrequencyLabel: vi.fn(() => 'Frequency label'),
    getCreatedByLabel: vi.fn(() => 'createdby label'),
    getShortLabel: vi.fn(() => 'short label'),
    getLongLabel: vi.fn(() => 'long label'),
  }
})

vi.mock('@app/schedule/helpers/utils', () => ({
  saveFileAs: vi.fn(),
  downloadFile: vi.fn(),
  fileSizeHumanFormatter: vi.fn(() => ''),
}))

vi.mock('@pulse/common/services/amplitude')

const occurrenceId = 442

const createWrapper = (override: Partial<OccurrenceDrawerProps> = {}) => {
  const defaultProps: OccurrenceDrawerProps = {
    modelValue: true,
    occurrenceId,
    isCollab: true,
  }
  const props = {
    ...defaultProps,
    ...override,
  }

  return wrapperFactory(OccurrenceDrawer, {
    props,
  })
}

describe('test OccurrenceDrawer', () => {
  beforeEach(() => {
    getOccurrenceMock.mockReturnValueOnce(mockedOccurrence)
  })

  it('should display loader until data are loaded', async () => {
    const wrapper = createWrapper({ modelValue: true })
    await nextTick()
    const pLoader = wrapper.findComponent({ name: 'PLoader' })
    expect(pLoader.exists()).toBeTruthy()
  })

  it("should emit the 'update:modelValue' event when the v-model is updated", async () => {
    const wrapper = createWrapper({ modelValue: true })
    const drawer = wrapper.findComponent({ name: 'PDrawer' })
    drawer.vm.$emit('update:modelValue', false)
    await nextTick()

    expect(drawer.emitted('update:modelValue')).toStrictEqual([[false]])
  })

  it('give proper attributes to PDrawer when data are loaded', async () => {
    const expectedTitle = 'short label'
    const wrapper = createWrapper({ modelValue: true })
    await flushPromises()
    await nextTick()

    const pLoader = wrapper.findComponent({ name: 'PLoader' })
    const pDrawer = wrapper.findComponent({ name: 'PDrawer' })

    expect(pLoader.exists()).toBeFalsy()
    expect(pDrawer.props('pTitle')).toBe(expectedTitle)
  })

  it('should emit update:model-value false when drawer is closed', async () => {
    const wrapper = createWrapper({ modelValue: true })
    await flushPromises()

    const pDrawer = wrapper.findComponent({ name: 'pDrawer' })
    pDrawer.vm.$emit('close-drawer-button')
    expect(wrapper.emitted('update:model-value')).toStrictEqual([[false]])
  })

  it('should display properly', async () => {
    const wrapper = createWrapper({ modelValue: true })
    await flushPromises()

    const fields = wrapper.findAll('[data-testid*="occurrence-drawer-"]')
    const display = fields.reduce((texts, field) => {
      const dataTextId = field.attributes('data-testid') ?? ''
      texts[dataTextId] = field.text()

      return texts
    }, {} as Record<string, string>)

    const expectedDisplay: Record<string, string> = {
      'occurrence-drawer-attachment-download': '',
      'occurrence-drawer-long-label': 'long label',
      'occurrence-drawer-frequency-label': 'Frequency label',
      'occurrence-drawer-description': 'Description',
      'occurrence-drawer-created-by': 'Created bycreatedby label',
      'occurrence-drawer-occurrence-date': 'Wednesday, May 1, 2024',
    }

    expect(display).toStrictEqual(expectedDisplay)
  })

  it('should call postDeadlineAccountStatus when DeadlineAccount emits toggle-status', async () => {
    const postDeadlineAccountStatusSpy = vi.spyOn(scheduleServices, 'postDeadlineAccountStatus')
    const accountId = 12
    const status = 'Todo'
    const expectedStatus = 'Done'

    const wrapper = createWrapper({ modelValue: true })

    await flushPromises()
    const firstDeadlineAccount = wrapper.findComponent({ name: 'DeadlineAccounts' })
    firstDeadlineAccount.vm.$emit('toggle-status', accountId, status)
    await nextTick()

    expect(postDeadlineAccountStatusSpy).toHaveBeenCalledOnce()
    expect(postDeadlineAccountStatusSpy).toHaveBeenNthCalledWith(1, occurrenceId, accountId, expectedStatus)
    expect(AmplitudeServiceMock.track).toHaveBeenCalledOnce()
  })
  it('should log a logger.error message when the getOccurrence request fails', async () => {
    const expectedErrorMessage = 'Authorization Error: API Access Denied'

    vi.spyOn(scheduleServices, 'getOccurrence').mockRejectedValue(expectedErrorMessage)

    createWrapper({ modelValue: true })

    await flushPromises()

    expect(loggerErrorSpy).toHaveBeenCalledOnce()
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expectedErrorMessage,
    )
  })
  it('should log a logger.error message when the postDeadlineAccountStatus request fails', async () => {
    const expectedErrorMessage = 'Authorization Error: API Access Denied'

    vi.spyOn(scheduleServices, 'postDeadlineAccountStatus').mockRejectedValue(expectedErrorMessage)
    const accountId = 12
    const status = 'Todo'

    const wrapper = createWrapper({ modelValue: true })

    await flushPromises()
    const firstDeadlineAccount = wrapper.findComponent({ name: 'DeadlineAccounts' })
    firstDeadlineAccount.vm.$emit('toggle-status', accountId, status)
    await flushPromises()

    expect(loggerErrorSpy).toHaveBeenCalledOnce()
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expectedErrorMessage,
    )
  })
  it('should show alert note when not checked', async () => {
    const wrapper = createWrapper({ isCollab: false })
    await flushPromises()
    expect(wrapper.findComponent({ name: 'PAlert' }).exists()).toBeTruthy()
  })
  it('should hide alert note when clicked', async () => {
    const wrapper = createWrapper({ isCollab: false })
    await flushPromises()
    await wrapper.findComponent({ name: 'PAlert' }).vm.$emit('close')
    expect(wrapper.findComponent({ name: 'PAlert' }).exists()).toBeFalsy()
  })
  it('should NEVER display delete button only to Collab', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    expect(wrapper.find('[data-testid=occurrence-drawer-delete]').exists()).toBeFalsy()
    await wrapper.setProps({ isCollab: false })
    expect(wrapper.find('[data-testid=occurrence-drawer-delete]').exists()).toBeFalsy()
  })

  it('should display deadlinesReminders component when isCollab', async () => {
    const isCollab = true
    const wrapper = createWrapper({
      isCollab,
    })
    await flushPromises()
    const deadlineReminders = wrapper.findComponent({ name: 'DeadlineReminders' })
    expect(deadlineReminders.exists()).toBeTruthy()
  })

  it('should NOT display deadlinesReminders component when NOT isCollab', async () => {
    const isCollab = false
    const wrapper = createWrapper({
      isCollab,
    })
    await flushPromises()
    const deadlineReminders = wrapper.findComponent({ name: 'DeadlineReminders' })
    expect(deadlineReminders.exists()).toBeFalsy()
  })


  describe('download feature', () => {
    beforeEach(() => {
      getOccurrenceMock.mockReturnValueOnce(mockedOccurrence)
      getOccurrenceAttachmentMock.mockReturnValueOnce({ data: attachmentContent })
    })

    it('should use showSaveFilePicker when available', async () => {

      window.atob = vi.fn(() => 'abcdef')
      const wrapper = createWrapper()
      await flushPromises()

      window.showSaveFilePicker = vi.fn(() => Promise.resolve({
        createWritable: vi.fn(() => Promise.resolve({
          write: vi.fn(),
          close: vi.fn(),
        })),
      }))
      await wrapper.find('[data-testid="occurrence-drawer-attachment-download"]').trigger('click')
      expect(saveFileAs).toHaveBeenCalledWith(fileName, attachmentContent)
    })

    it('should use traditional download method when showSaveFilePicker is not available', async () => {

      window.atob = vi.fn(() => 'abcdef')
      const wrapper = createWrapper()
      await flushPromises()
      delete window.showSaveFilePicker
      await wrapper.find('[data-testid="occurrence-drawer-attachment-download"]').trigger('click')
      expect(downloadFile).toHaveBeenCalledWith(fileName, attachmentContent)
    })

    it('should use download fallback when showSaveFilePicker is available but failed in runtime', async () => {
      const wrapper = createWrapper()
      await flushPromises()

      window.showSaveFilePicker = vi.fn(() => Promise.resolve({
        createWritable: vi.fn(() => Promise.resolve({
          write: vi.fn(),
          close: vi.fn(),
        })),
      }))
      vi.mocked(saveFileAs).mockRejectedValueOnce(new Error('Failed to execute  showSaveFilePicker on Window'))
      await wrapper.find('[data-testid="occurrence-drawer-attachment-download"]').trigger('click')
      await flushPromises()
      expect(downloadFile).toHaveBeenCalledWith(fileName, attachmentContent)
      expect(true).toBeTruthy()
    })

    it('should throw and not call downloadFile', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      vi.mocked(scheduleServices.getOccurrenceAttachment).mockRejectedValueOnce(new Error('Failed to execute schedule'))
      await wrapper.find('[data-testid="occurrence-drawer-attachment-download"]').trigger('click')
      expect(downloadFile).not.toHaveBeenCalledWith(fileName, attachmentContent)
    })
  })
})
