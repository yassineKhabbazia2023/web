import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PDocumentDisplay from './'
import type { PDocumentDisplayProps } from './PDocumentDisplayTypes'
import { ElImage } from 'element-plus'
import PImage from '../../atoms/PImage'

const defaultProps: PDocumentDisplayProps = {
  pDocumentExtension: 'jpg',
  pIsLoading: false,
  pSrc: 'your-image-url.jpg',
  errorMsgText: '',
  errorMsgTitle: '',
}

const createWrapper = (props: Partial<PDocumentDisplayProps> = {}) =>
  mount(PDocumentDisplay, {
    props: {
      ...defaultProps,
      ...props,
    },
  })

describe('pDocumentDisplay', () => {
  it('renders an image preview if the document is an image and not loading', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('.preview-section_image').exists()).toBeTruthy()
  })

  it('renders a "not allowed" preview if the document is not allowed for preview and not loading', () => {
    const wrapper = createWrapper({
      pDocumentExtension: 'txt',
      pSrc: 'your-document-url.txt',
    })

    expect(wrapper.find('.preview-section_notAllowed').exists()).toBeTruthy()
    const image = wrapper.findComponent(PImage)
    expect(image.exists()).toBeTruthy()
  })

  it('renders a loader if the document is in loading state', () => {
    const wrapper = createWrapper({
      pDocumentExtension: 'pdf',
      pIsLoading: true,
      pSrc: 'your-pdf-url.pdf',
    })

    expect(wrapper.find('.preview-section__loader-container').exists()).toBeTruthy()
  })

  it('renders a PDF preview using an iframe if the document is a PDF and not in loading state', () => {
    const wrapper = createWrapper({
      pDocumentExtension: 'pdf',
      pSrc: { data: new ArrayBuffer(10), headers: { 'content-type': 'application/pdf' } },
    })

    expect(wrapper.find('iframe.preview').exists()).toBeTruthy()
  })

  it('renders an image preview using el-image if the document is an image and not in loading state', () => {
    const wrapper = createWrapper({
      pDocumentExtension: 'png',
      pIsLoading: false,
      pSrc: 'your-image-url.png',
    })
    const image = wrapper.findComponent(ElImage)
    expect(image.exists()).toBeTruthy()
  })
})
