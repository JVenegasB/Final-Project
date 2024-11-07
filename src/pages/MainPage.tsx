import { useEffect, useState } from 'react';
import PatientsPage from './PatientsPage.tsx'
import { useThemeContext } from '../context/themeContext.ts';
import { PersonCircle28Regular, Home28Filled, Person28Filled, Settings28Filled, Navigation20Filled } from '@fluentui/react-icons';
import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger,Spinner } from '@fluentui/react-components';
import { client } from '../supabase/client';
import { useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import SettingsComponent from './SettingsComponent.tsx';
import MainElementPage from './MainElementPage.tsx';

interface LoggedUserType {
    user_id: string;
    email: string;
    name: string;
    phone: string;
    role: string;
}
interface ClinicType {
    id: number;
    name: string;
    unique_code: string;
    address: string;
    description: string;
    phone: string;
}
interface JoinRequestType {
    id: number;
    user_id: string;
    clinic_id: number;
    status: string;
    requested_date: string;
    clinic: clinic
}
interface clinic {
    name: string
}
export default function Header() {
    const navigate = useNavigate();
    const [loggedUser, setLoggedUser] = useState<LoggedUserType>();
    const [clinic, setClinic] = useState<ClinicType>();
    const [isClinicMember, setIsClinicMember] = useState<boolean | null>(null);
    const [userJoinRequests, setUserJoinRequests] = useState<JoinRequestType[]>([]);

    const fetchClinicUserData = async (session: Session) => {
        const { data: clinic_user, error } = await client.from('clinic_users').select('*').eq('user_id', session?.user.id).single();
        if (error) {
            console.error('Error', error);
            console.log('User does not belong to any company yet');
            const { data: user, error: userError } = await client.from('users').select('*').eq('user_id', session.user.id).single();
            if (userError) {
                console.error('Error fetching user data', userError);
            } else {
                setLoggedUser({
                    user_id: user.user_id,
                    email: user.email,
                    name: user.name,
                    phone: user.phone,
                    role: ''
                });
            }

            setIsClinicMember(false);
            setActiveTab('mainElement');

        } else {
            fetchClinicUserCredentials(clinic_user.clinic_id, session?.user.id, clinic_user.role);
        }
    }


    const fetchClinicUserCredentials = async (clinic_id: number, user_id: string, role: string) => {
        const { data: clinic, error: clinicError } = await client.from('clinic').select('*').eq('id', clinic_id).single();
        const { data: user, error: userError } = await client.from('users').select('*').eq('user_id', user_id).single();
        if (clinicError || userError) {
            console.error('error here', userError, clinicError);
        } else {
            setIsClinicMember(true);
            setClinic(clinic);
            setLoggedUser({
                user_id: user.user_id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                role: role
            });
            setActiveTab('mainElement');

        }
    }

    const fetchUserJoinRequests = async () => {
        const { data, error } = await client.from('join_requests').select(`
            id, 
            user_id,
            clinic_id, 
            status,
            requested_date,
            clinic!inner ( name )
          `).eq('user_id', loggedUser?.user_id) as { data: JoinRequestType[] | null, error: unknown };;
        if (error) {
            console.error('Error fetching join requests', error)
        } else {
            if (data) {
                const formattedData = data.map((request) => ({
                    ...request,
                    requested_date: request.requested_date.toString().split('T')[0]
                }));
                setUserJoinRequests(formattedData);
            }
        }
    }
    const [userSession, setUserSession] = useState<Session>();
    useEffect(() => {
        client.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                navigate('/login');
            } else {
                setUserSession(session);
                fetchClinicUserData(session);
            }
        })
    }, []);

    useEffect(() => {
        if (!isClinicMember) {
            console.log('Going to detch join request with this data: ', loggedUser?.user_id)
            fetchUserJoinRequests();
        }
    }, [isClinicMember])
    const { isDarkMode, } = useThemeContext();

    const [activeTab, setActiveTab] = useState('');

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const renderTabContent = () => {
        switch (activeTab) {

            case 'pacientesElement':
                return (
                    <PatientsPage />
                );
            case 'settingsElement':
                return (
                    <SettingsComponent company_id={clinic?.id} isClinicMember={isClinicMember} userRole={loggedUser?.role} userSession={userSession}/>
                );
            case 'mainElement':
                return (
                    <MainElementPage isClinicMember={isClinicMember} clinicName={clinic?.name} userJoinRequests={userJoinRequests} userSession={userSession ?? null} userName={loggedUser?.name} />
                )
            default:
                return (
                    <div className={`h-full m-3 ${isDarkMode ? "bg-thirdBgDark" : "bg-white"} `}>
                        <div className='flex flex-col justify-center items-center'>
                            <h1 className='text-3xl font-bold my-10'>Cargando datos</h1>
                            <Spinner size='extra-large'/>
                        </div>
                    </div>
                );
        }
    };
    return (
        <div className="flex flex-col max-h-screen">
            <div className={`${isDarkMode ? "bg-mainBgDark" : "bg-white"} lg:flex flex-row justify-between px-5 hidden`}>
                <div className='flex flex-row justify-center items-center w-44 h-20 m-2'>
                    {isClinicMember ?
                        <h1 className='text-3xl font-bold'>
                            CompanyName
                        </h1> : <h1 className='text-3xl font-bold'>
                            Bienvenido
                        </h1>
                    }
                </div>
                <div className='flex flex-row items-center m-2'>
                    {loggedUser?.role === 'admin' && <div className='font-roboto italic text-gray-400'>Codigo: {clinic?.unique_code}</div>}
                    <div className='border-2 mx-2 p-2 font-roboto'>
                        <Menu>
                            <MenuTrigger disableButtonEnhancement>
                                <Button appearance='transparent'>
                                    <PersonCircle28Regular className='mr-2' />
                                    {loggedUser?.name}

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
                        {isClinicMember && <button onClick={() => setActiveTab('pacientesElement')} className="flex flex-grow items-center px-3 py-5 hover:bg-blue-600 w-full border-b-2 border-white/50">
                            <Person28Filled className="mr-2 text-white" />
                            <p className=' text-white text-lg'>Pacientes</p>
                        </button>}

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
