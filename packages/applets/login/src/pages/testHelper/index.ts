import { mount } from '@vue/test-utils'
import type { Component } from 'vue'
import { createRouter, createWebHistory, type RouteLocationNamedRaw } from 'vue-router'

function getTemplate(text: string) {
  return `<p class="page-title">${text}</p>`
}

export function getMockedRoutes(path: string, name: string, text: string) {
  const routes = [
    {
      path: '/expireToken',
      name: 'expireToken',
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
    accountId: 'accountId',
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
  stubs: string[],
) {
  return mount(component, {
    global: {
      plugins: [router],
      stubs,
    },
  })
}
