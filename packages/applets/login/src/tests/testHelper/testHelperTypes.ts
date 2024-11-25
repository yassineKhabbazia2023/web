import type { ComponentPublicInstance } from 'vue'
import type { VueWrapper } from '@vue/test-utils'

export type ComponentWrapper<T> = VueWrapper<ComponentPublicInstance & T>
