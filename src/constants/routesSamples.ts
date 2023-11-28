export const menu = [
  {
    name: 'Dashboard',
    path: '/bottom-menu-dashboard',
    component: {
      render: () => 'Your are in the route named Dashboard'
    },
    meta: {
      icon: 'PIColumnsGap'
    }
  },
  {
    icon: '',
    name: 'Document',
    path: '/bottom-menu-document',
    component: {
      render: () => 'Your are in the route named Document'
    },
    meta: {
      icon: 'PIFiles'
    }
  }
]
