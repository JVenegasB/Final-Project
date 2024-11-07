import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import LogInPage from './pages/LogInPage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import SignUpPage from './pages/SignUpPage.tsx'
import MainPage from './pages/MainPage.tsx'
import UserCompanySetup from './pages/UserCompanySetup.tsx'
import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components'
import './index.css'
import { ThemeContext } from './context/themeContext.ts'
import { client } from './supabase/client.ts'
import PasswordResetPage from './pages/PasswordResetPage.tsx'
import { ClinicContext } from './context/clinicContext.ts'
import { UserContext } from './context/userContext.ts'

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
      <MainPage />
  }, {
    path: '/recoverpassword',
    element:
      <PasswordResetPage />
  }, {
    path: '/companySetup/:userName',
    element:
      <UserCompanySetup />
  }
]);
interface ClinicType {
  id: number;
  name: string;
  unique_code: string;
  address: string;
  description: string;
  phone: string;
}
type LoggedUserType = {
  user_id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
}

const Root = () => {

  const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [clinic, setClinicData] = useState<ClinicType | null>(null);
  const [loggedUser, setLoggedUserData] = useState<LoggedUserType | null>(null);
  useEffect(() => {
    client.auth.onAuthStateChange((_event, session) => {
      if (session) {
        console.log('User is logged in');
      } else {
        console.log('User is not logged in');
      }
    });

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
    <ClinicContext.Provider value={[clinic, setClinicData]} >
      <UserContext.Provider value={[loggedUser, setLoggedUserData]}>
        <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
          <FluentProvider theme={isDarkMode ? webDarkTheme : webLightTheme}>
            <RouterProvider router={router} />
          </FluentProvider>
        </ThemeContext.Provider>
      </UserContext.Provider>
    </ClinicContext.Provider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
