import { useEffect, useState } from 'react';
import PatientsPage from './PatientsPage.tsx'
import { useUserContext } from '../context/userContext';
import { useThemeContext } from '../context/themeContext.ts';
import { PersonCircle28Regular, Home28Filled, Person28Filled, Settings28Filled, Navigation20Filled } from '@fluentui/react-icons';
import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components';
import { client } from '../supabase/client';
import { useNavigate } from 'react-router-dom';
export default function Header() {
    const navigate = useNavigate();
    useEffect(() => {
        client.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                navigate('/login');
            } else {
                console.log('User logged in', session);
            }
        })
    }, []);
    const [loggedUser,] = useUserContext();
    const { isDarkMode, setIsDarkMode } = useThemeContext();

    const [activeTab, setActiveTab] = useState('mainButton');

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const renderTabContent = () => {
        switch (activeTab) {
            case 'default':
                return (
                    <div className='w-full p-5'>
                        <p>Bienvenido {loggedUser?.name}</p>
                        <p>Correo: {loggedUser?.email}</p>
                        <h1>Coo</h1>
                    </div>
                );
            case 'pacientesElement':
                return (
                    <PatientsPage/>
                );
            case 'settingsElement':
                return (
                    <div className='w-full p-5'>
                        <p>Configuraciones</p>
                        <h2 className='my-3 font-roboto text-2xl'>Tema</h2>
                        <Button onClick={() => setIsDarkMode(!isDarkMode)}>Cambiar a {isDarkMode ? " claro" : "oscuro"}</Button>
                    </div>
                );
            case 'mainElement':
            default:
                return (
                    <div className='p-5'>
                        <p>Bienvenido {loggedUser?.name}</p>
                        <p>Correo: {loggedUser?.email}</p>
                        <h1>Coo</h1>
                    </div>
                );
        }
    };
    return (
        <div className="flex flex-col max-h-screen">
            <div className={`${isDarkMode ? "bg-mainBgDark" : "bg-white"} lg:flex flex-row justify-between px-5 hidden`}>
                <div className='flex flex-row justify-center items-center w-44 h-20 m-2 bg-red-400'>
                    Company Name
                </div>
                <div className='flex flex-row items-center m-2'>
                    <div className='font-roboto italic text-gray-400'>Codigo: {loggedUser?.code}</div>
                    <div className='border-2 mx-2 p-2 font-roboto'>
                        <Menu>
                            <MenuTrigger disableButtonEnhancement>
                                <Button appearance='transparent'>
                                    <PersonCircle28Regular className='mr-2' />
                                    {loggedUser?.nickName}

                                </Button>
                            </MenuTrigger>
                            <MenuPopover>
                                <MenuList>
                                    <MenuItem><Button onClick={() => client.auth.signOut()} appearance='transparent'>Cerrar sesion</Button></MenuItem>
                                </MenuList>
                            </MenuPopover>
                        </Menu>
                    </div>
                </div>
            </div>
            <div className="flex lg:flex-row flex-grow flex-col">
                <div className={`flex flex-col items-center px-3 ${isDarkMode ? "bg-mainBgDark" : "bg-blue-900"}`}>
                    <div className='flex flex-col justify-between items-center px-3 w-full lg:w-auto lg:hidden my-2'>
                        <button onClick={toggleMenu}>
                            <Navigation20Filled className='text-white' />
                        </button>
                    </div>
                    <div className={`flex flex-col font-lato mb-auto w-full ${isMenuOpen ? 'block' : 'hidden lg:block'} lg:mt-5 py-3`}>
                        <button onClick={() => setActiveTab('mainElement')} className="flex flex-grow items-center px-3 py-5 hover:bg-blue-600 w-full border-b-2 border-white/50">
                            <Home28Filled className="mr-2 text-white" />
                            <p className=' text-white text-lg'>Inicio</p>
                        </button>
                        <button onClick={() => setActiveTab('pacientesElement')} className="flex flex-grow items-center px-3 py-5 hover:bg-blue-600 w-full border-b-2 border-white/50">
                            <Person28Filled className="mr-2 text-white" />
                            <p className=' text-white text-lg'>Pacientes</p>
                        </button>
                        <button onClick={() => setActiveTab('settingsElement')} className="flex flex-grow items-center px-3 py-5 hover:bg-blue-600 w-full ">
                            <Settings28Filled className="mr-2 text-white" />
                            <p className=' text-white text-lg'>Configuraciones</p>
                        </button>
                    </div>
                </div>
                <div className={`flex flex-grow flex-col w-full ${isDarkMode ? "bg-secondaryBgDark" : "bg-secondaryBgLight"} lg:h-[calc(100vh-96px)] h-[calc(100vh-38px)] overflow-y-auto`}>
                    {renderTabContent()}
                </div>
            </div>
        </div>

    );
}
