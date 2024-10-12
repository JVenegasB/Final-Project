import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import LogInPage from './pages/LogInPage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import SignUpPage from './pages/SignUpPage.tsx'
import MainPage from './pages/MainPage.tsx'
// import ProtectedRoute from './components/ProtectedRoute.tsx'
import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components'
import './index.css'
import { UserContext } from './context/userContext.ts'
import { ThemeContext } from './context/themeContext.ts'
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
    element:
      // <ProtectedRoute>
      <MainPage />
    // </ProtectedRoute>
  }
]);


const Root = () => {
  const [userData, setUserData] = useState<user | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    // Detectar cambios en el esquema de colores del navegador
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleColorSchemeChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    darkModeMediaQuery.addEventListener('change', handleColorSchemeChange);

    return () => {
      darkModeMediaQuery.removeEventListener('change', handleColorSchemeChange);
    };
  }, []);

  return (
    <UserContext.Provider value={[userData, setUserData]}>
      <ThemeContext.Provider value={{isDarkMode, setIsDarkMode}}>
        <FluentProvider theme={isDarkMode ? webDarkTheme : webLightTheme}>
          <RouterProvider router={router} />
        </FluentProvider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
