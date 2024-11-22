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
import PasswordResetPage from './pages/PasswordResetPage.tsx'
import { ClinicContext } from './context/clinicContext.ts'
import { UserContext } from './context/userContext.ts'
import { loadingHistContext } from './context/loadingIncHistContext.ts'
import { loadingIncEvHistContext } from './context/loadingIncEvHistContext.ts'

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
  logo_url: string;
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
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [isLoadingEv, setIsLoadingHist] = useState<boolean | null>(null);
  useEffect(() => {
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
        <loadingHistContext.Provider value={[isLoading, setIsLoading]}>
          <loadingIncEvHistContext.Provider value={[isLoadingEv, setIsLoadingHist]}>
            <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
              <FluentProvider theme={isDarkMode ? webDarkTheme : webLightTheme}>
                <RouterProvider router={router} />
              </FluentProvider>
            </ThemeContext.Provider>
          </loadingIncEvHistContext.Provider>
        </loadingHistContext.Provider>
      </UserContext.Provider>
    </ClinicContext.Provider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
