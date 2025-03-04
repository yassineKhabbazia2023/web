import { mount } from '@vue/test-utils'
import type { Component , ComponentPublicInstance } from 'vue'
import type { VueWrapper } from '@vue/test-utils'

import { createRouter, createWebHistory, type RouteLocationNamedRaw } from 'vue-router'
import { LoginRouteName } from '@pulse/common/constants'

function getTemplate(text: string) {
  return `<p class="page-title">${text}</p>`
}

export function getMockedRoutes(path: string, name: string, text: string) {
  const routes = [
    {
      path: '/expireToken',
      name: LoginRouteName.EXPIRE_TOKEN,
      component: {
        template: getTemplate('ExpireToken'),
      },
    },
    {
      path,
      name,
      component: {
        template: getTemplate(text),
      },
    },
  ]

  return routes
}

export function getMockedRouter(
  name: string,
  text: string,
  email: string | undefined,
  contactEmail?: string | undefined,
) {
  const path = `/${name}`
  const routes = getMockedRoutes(path, name, text)
  const router = createRouter({
    history: createWebHistory(),
    routes,
  })
  const query = {
    contactId: 'contactId',
    accountNumber: 'accountNumber',
    token: 'token',
    contactEmail,
    email,
  }
  const route: RouteLocationNamedRaw = {
    name,
    query,
  }
  router.push(route)

  return router
}

export function getWrapper(
  component: Component,
  router: ReturnType<typeof getMockedRouter>,
  stubs?: string[] | Record<string, boolean>,
) {
  return mount(component, {
    global: {
      plugins: [router],
      stubs,
    },
  })
}

export type ComponentWrapper<T> = VueWrapper<ComponentPublicInstance & T>