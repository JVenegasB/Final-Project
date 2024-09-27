import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import LogInPage from './pages/LogInPage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import SignUpPage from './pages/SignUpPage.tsx'
import MainPage from './pages/MainPage.tsx'

import './index.css'
import { UserContext } from './context/userContext.ts'
import { user } from './types/types.ts'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFoundPage />
  }, {
    path: '/login',
    element: <LogInPage />
  }, {
    path: '/signup',
    element: <SignUpPage />
  }, {
    path: '/mainPage',
    element: <MainPage />
  }
]);

const Root = () => {
  const [userData, setUserData] = useState<user | null>(null);

  return (
    <UserContext.Provider value={[userData, setUserData]}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
