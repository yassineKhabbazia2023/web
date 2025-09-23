import { shallowMount } from '@vue/test-utils'
import PEntityHeader from '.'
import { setAssetsBaseUrl } from '@styleguide/utils/imageResolverInit'

const legalName = 'legalName'
const accountNumber = 'accountNumber'
const defaultProps = {
  pLegalName: legalName,
  pAccountNumber: accountNumber,
}

const createWrapper = (props: any = defaultProps) =>
  shallowMount(PEntityHeader, {
    props,
  })

describe('pEntityHeader', () => {
  beforeEach(() => {
    setAssetsBaseUrl('https://www.example.test')
  })
  describe('props', () => {
    it.each([
      {
        field: legalName,
        dataTestId: 'entity-header-name',
      },
      {
        field: accountNumber,
        dataTestId: 'entity-header-account-number',
      },
    ])('should render the $field of entity', ({ field, dataTestId }) => {
      const wrapper = createWrapper()
      expect(wrapper.find(`[data-testid=${dataTestId}]`).text())
        .toContain(field)
    })
  })
  it.each([
    {
      size: 'small',
      className: 'p-entity-header-small',
    },
    {
      size: 'default',
      className: 'p-entity-header-default',
    },
  ])('should render variant $size', ({ size, className }) => {
    const wrapper = createWrapper({
      pSize: size,
      ...defaultProps,
    })

    expect(wrapper.find(className)).not.toBeNull()
  })
})
