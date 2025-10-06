import { envVarsMock, bookingLinkMock } from '@pulse/common/mocks'

import { getConfigurationLinkErrorMessage } from './booking-configuration-form.helper'

declare let window: {
  EnvVars: Record<string, string>
} & Window

const correctLinkMock = bookingLinkMock

describe('booking-configuration-form.helper', () => {
  describe('getConfigurationLinkErrorMessage', () => {
    const requiredErrorMessage = 'Configuration link is required.'
    const wrongFormatErrorMessage = 'Configuration link format is invalid.'

    const tests = [{
      description: 'should return the required error message when the configuration link is empty',
      input: '',
      bookingLinkRegExpPattern: envVarsMock.VITE_BOOKING_LINK_PATTERN,
      expected: requiredErrorMessage,
    }, {
      description: 'should return the wrong format error message when the configuration link does not match the regex',
      input: 'invalid-link',
      bookingLinkRegExpPattern: envVarsMock.VITE_BOOKING_LINK_PATTERN,
      expected: wrongFormatErrorMessage,
    }, {
      description: 'should return an empty string when the configuration link is valid',
      input: correctLinkMock,
      bookingLinkRegExpPattern: envVarsMock.VITE_BOOKING_LINK_PATTERN,
      expected: '',
    }, {
      description: 'should return an empty string when the regex pattern is empty (no validation)',
      input: 'invalid-link',
      bookingLinkRegExpPattern: '',
      expected: '',
    }]
    it.each(tests)('$description', ({
      input,
      bookingLinkRegExpPattern,
      expected,
    }) => {
      window.EnvVars = {
        VITE_BOOKING_LINK_PATTERN: bookingLinkRegExpPattern,
      }

      const result = getConfigurationLinkErrorMessage({
        configurationLink: input,
        requiredErrorMessage,
        wrongFormatErrorMessage,
      })
      expect(result).toBe(expected)
    })
  })
})
