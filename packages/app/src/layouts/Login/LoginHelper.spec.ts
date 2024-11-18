import { describe, expect, it } from 'vitest'
import { getIllustration } from './LoginHelper'
import { type RouteRecordNameGeneric } from 'vue-router'

describe('test LoginHelper', () => {
  const tests: {
    routeName: RouteRecordNameGeneric
    expected: ReturnType<typeof getIllustration>
  }[] = [{
    routeName: undefined,
    expected: 'connection-default',
  }, {
    routeName: 'home',
    expected: 'connection-default',
  }, {
    routeName: 'validationCGU',
    expected: 'document-authentification',
  }]

  it.each(tests)('shoult return \'$expected\' when routeName is \'$expected\'', ({
    routeName,
    expected,
  }) => {
    const illustration = getIllustration(routeName)

    expect(illustration).toBe(expected)
  })
})