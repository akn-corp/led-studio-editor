export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },
  editor: {
    path: '/editor/:projectId',
    getHref: (projectId: string) => `/editor/${projectId}`,
  },
} as const
