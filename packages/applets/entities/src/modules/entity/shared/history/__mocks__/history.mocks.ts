import type { Activity, ActivitiesResponse, ThemeWithCategories } from '../types/history.types'

export function getMockedActivity(id: number): Activity {
  return {
    activityId: id,
    label: `Activity ${id}`,
    creationDate: '2024-01-15T10:30:00Z',
    details: `Details for activity ${id}`,
    actionId: 1,
    userId: 100,
    targetUserId: null,
    accountId: 123,
    account: {
      accountId: 123,
      legalName: 'Test Company',
      accountNumber: 'ACC123',
    },
    action: {
      actionId: 1,
      code: 'ACTION_CODE',
      label: 'Action Label',
      type: 'update',
      visibility: 'All',
      categoryId: 1,
      category: {
        categoryId: 1,
        name: 'Category',
        themeId: 1,
        theme: {
          themeId: 1,
          name: 'success',
        },
      },
    },
    targetUser: null,
    user: {
      userId: 100,
      userType: 'Collaborator',
      name: 'Test User',
      email: 'test@example.com',
    },
  }
}

export function getMockedActivitiesResponse(items: Activity[], totalItems: number): ActivitiesResponse {
  return {
    items,
    totalItems,
    currentPage: 1,
    totalPages: Math.ceil(totalItems / 10),
  }
}

export function getMockedThemes(): ThemeWithCategories[] {
  return [
    {
      themeId: 1,
      name: 'Theme 1',
      categories: [
        { categoryId: 1, name: 'Category 1', themeId: 1 },
        { categoryId: 2, name: 'Category 2', themeId: 1 },
      ],
    },
    {
      themeId: 2,
      name: 'Theme 2',
      categories: [
        { categoryId: 3, name: 'Category 3', themeId: 2 },
      ],
    },
  ]
}
