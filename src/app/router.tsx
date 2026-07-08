import { useMemo } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { paths } from '@/config/paths'

const createAppRouter = () =>
  createBrowserRouter([
    {
      path: paths.home.path,
      children: [
        {
          index: true,
          lazy: () =>
            import('@/app/routes/home').then((module) => ({
              Component: module.default,
            })),
        },
      ],
    },
    {
      path: paths.editor.path,
      children: [
        {
          index: true,
          lazy: () =>
            import('@/app/routes/editor').then((module) => ({
              Component: module.default,
            })),
        },
      ],
    },

    {
      path: '*',
      lazy: () =>
        import('@/app/routes/not-found').then((module) => ({
          Component: module.default,
        })),
    },
  ])

function AppRouter() {
  const router = useMemo(() => createAppRouter(), [])

  return <RouterProvider router={router} />
}

export { AppRouter }
