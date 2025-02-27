import { ref } from 'vue'

const unauthorizedCallback = ref<Function>()

export function setUnauthorizedCallback(callback: Function) {
  unauthorizedCallback.value = callback
}
export function getUnauthorizedCallback() {
  return unauthorizedCallback.value
}
