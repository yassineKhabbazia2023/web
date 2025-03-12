import * as VueUseCore from '@vueuse/core'
import { ref } from 'vue'
import type { MockInstance } from 'vitest'
import * as ElementPlus from 'element-plus'

import { stringToClassList, numbersToClassList, onClickCssClass } from '../utils/histoireHelpers'

vi.mock('@vueuse/core')
vi.mock('element-plus', () => ({
  ElMessage: {
    success: vi.fn(),
  },
}))

describe('histoireHelpers', () => {
  describe('stringToClassList', () => {
    it('should return proper classList', () => {
      const prefix = 'prefix-'
      const suffixes = 'a, b, c'
      const expected = [
        'prefix-a',
        'prefix-b',
        'prefix-c',
      ]

      const classList = stringToClassList(prefix, suffixes)
      expect(classList).toStrictEqual(expected)
    })
  })

  describe('numbersToClassList', () => {
    it('should return proper classList', () => {
      const prefix = 'prefix-'
      const lastIndex = 2
      const expected = [
        'prefix-0',
        'prefix-1',
        'prefix-2',
      ]
      const classList = numbersToClassList(prefix, lastIndex)
      expect(classList).toStrictEqual(expected)
    })
  })

  describe('onClickCssClass', () => {
    describe('when isSupported is true', () => {
      let copySpy: MockInstance
      beforeEach(() => {
        copySpy = vi.fn()
        vi
          .spyOn(VueUseCore, 'useClipboard')
          .mockReturnValue({
            copy: copySpy,
            isSupported: ref(true),
          } as any)
      })

      it('should call ElMessage.success properly when source2 is given', () => {
        const successSpy = vi.fn()
        ElementPlus.ElMessage.success = successSpy

        const source1 = 'source-1'
        const source2 = 'source-2'
        const expected = `Copied ${source1} ${source2}`

        onClickCssClass(source1, source2)

        expect(copySpy).toHaveBeenCalledOnce()
        expect(successSpy).toHaveBeenCalledOnce()
        expect(successSpy).toHaveBeenNthCalledWith(1, expected)
      })

      it('should call ElMessage.success properly when source2 is NOT given', () => {
        const successSpy = vi.fn()
        ElementPlus.ElMessage.success = successSpy

        const source1 = 'source-1'
        const expected = `Copied ${source1}`

        onClickCssClass(source1)

        expect(copySpy).toHaveBeenCalledOnce()
        expect(successSpy).toHaveBeenCalledOnce()
        expect(successSpy).toHaveBeenNthCalledWith(1, expected)
      })
    })

    describe('when isSupported is false', () => {
      let copySpy: MockInstance
      beforeEach(() => {
        copySpy = vi.fn()
        vi
          .spyOn(VueUseCore, 'useClipboard')
          .mockReturnValue({
            copy: copySpy,
            isSupported: ref(false),
          } as any)
      })

      it('should not call ElMessage.success', () => {
        const successSpy = vi.fn()
        ElementPlus.ElMessage.success = successSpy

        onClickCssClass('source')

        expect(copySpy).toHaveBeenCalledOnce()
        expect(successSpy).not.toHaveBeenCalled()
      })
    })
  })
})
