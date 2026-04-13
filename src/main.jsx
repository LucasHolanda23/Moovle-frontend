import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './page-moves/App.jsx'
import Series from './page-series/App.jsx'
import Anime from './page-animes/App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/moves",
    element: <App />,
  },
  {
    path: "/serie",
    element: <Series />,
  },
  {
    path: "/anime",
    element: <Anime />,
  },
],
  { basename: "/Moovle-frontend", }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
