import { useEffect, useState } from 'react';
import PatientsPage from './PatientsPage.tsx'
import { useThemeContext } from '../context/themeContext.ts';
import { PersonCircle28Regular, Home28Filled, Person28Filled, Settings28Filled, Navigation20Filled } from '@fluentui/react-icons';
import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, Spinner, useToastController, Toast, ToastTitle, ToastBody, Toaster, ToastIntent } from '@fluentui/react-components';
import { client } from '../supabase/client';
import { useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import SettingsComponent from './SettingsComponent.tsx';
import MainElementPage from './MainElementPage.tsx';
import { useClinicContext } from '../context/clinicContext.ts';
import { useUserContext } from '../context/userContext.ts';
import { EvolutionToComplete, PatientMainData } from '../types/types.ts';
import { useLoadingHistContext } from '../context/loadingIncHistContext.ts';
import { useLoadingIncEvHistContext } from '../context/loadingIncEvHistContext.ts';

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
    //Toaster
    const { dispatchToast } = useToastController("global-toaster");
    const showToast = (title: string, description: string, intent: ToastIntent) => {
        dispatchToast(
            <Toast>
                <ToastTitle >{title}</ToastTitle>
                <ToastBody>{description}</ToastBody>

            </Toast>,
            { position: "top-end", intent }
        )
    }
    //Navigation and context
    const navigate = useNavigate();
    const [loggedUser, setLoggedUser] = useUserContext();
    const [clinic, setClinic] = useClinicContext();
    const [isClinicMember, setIsClinicMember] = useState<boolean | null>(null);
    const [userJoinRequests, setUserJoinRequests] = useState<JoinRequestType[]>([]);
    const [allowFetch, setAllowFetch] = useState(true);
    useEffect(() => {
        if (clinic && allowFetch) {
            fetchPatientList();
            fetchFinishLaterEvolutions();
            setAllowFetch(false);
        }
    }, [clinic])
    const fetchClinicUserData = async (session: Session) => {
        try {
            const { data: clinic_user, error } = await client.from('clinic_users').select('*').eq('user_id', session?.user.id).single();
            if (error) {
                const { data: user, error: userError } = await client.from('users').select('*').eq('user_id', session.user.id).single();
                if (userError) {
                    console.error('Error fetching user data', userError);
                    showToast('Error al obtener los datos', userError.message, 'error')
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
        } catch (error) {
            showToast('Error al obtener los datos', (error as Error).message, 'error')
        }

    }


    const [clinic_logo, setClinicLogo] = useState('');
    const fetchClinicUserCredentials = async (clinic_id: number, user_id: string, role: string) => {
        const { data: clinic, error: clinicError } = await client.from('clinic').select('*').eq('id', clinic_id).single();
        const { data: user, error: userError } = await client.from('users').select('*').eq('user_id', user_id).single();
        if (clinicError && clinicError.message) {
            console.error('error here', userError, clinicError);
            showToast('Error al obtener los datos', clinicError.message, 'error')
        } else if (userError && userError.message) {
            console.error('error here', userError, clinicError);
            showToast('Error al obtener los datos', userError.message, 'error')
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
            if(clinic.logo_url !== null && clinic.logo_url !== '' ) {
                fetchLogoUrl(clinic?.logo_url)
            } else{
                showToast('Error al obtener logo del consultorio', 'No se encontro un logo asociado al consultorio. Te recomentamos cargar uno desde la seccion de configuraciones', 'warning')
            }

        }
    }
    const fetchLogoUrl = async (clinicUrlLogo: string) => {
        const { data: signedUrlData, error: signedUrlError } = await client.storage.from('Clinic Logos').createSignedUrl(clinicUrlLogo, 60)
        if (signedUrlError) {
            console.error('Error getting signed url', signedUrlError)
            showToast('Error al obtener los datos', signedUrlError.message, 'error')
            return
        }
        setClinicLogo(signedUrlData?.signedUrl)
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
            showToast('Error al obtener las solicitudes', error.toString(), 'error')
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
        const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                navigate('/');
            } else if (!userSession) {
                setUserSession(session);
            }
        });
            return () => {
            subscription.unsubscribe();
        };
    }, [userSession, navigate]);
    
    useEffect(() => {
        if (userSession) {
            fetchClinicUserData(userSession);
        }
    },[userSession])
    useEffect(() => {
        if (!isClinicMember) {
            fetchUserJoinRequests();
        }
    }, [isClinicMember])
    const { isDarkMode, } = useThemeContext();

    const [activeTab, setActiveTab] = useState('');

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const signOut = async () => {
        setLoggedUser(null);
        setClinic(null);
        await client.auth.signOut();
    }
    const [, setIsLoading] = useLoadingHistContext()
    const [patientData, setPatientData] = useState<PatientMainData[]>([]);
    const fetchPatientList = async () => {
        setIsLoading(true)
        if (clinic === null) {
            console.error('No clinic data found');
            setIsLoading(false)
            return;
        }
        try {
            const queryParams = new URLSearchParams({ clinicid: clinic.id.toString() }).toString();

            const { data, error } = await client.functions.invoke(`fetchMainUserData?${queryParams}`, {
                method: 'GET',
            });


            if (error) {
                console.error('Error fetching patient list:', error.message);
                showToast('Error al obtener los datos', error.message, 'error')
                setIsLoading(false)
                return;
            }
            const modifiedData = data.map((prevData: PatientMainData) => ({
                ...prevData,
                first_session: prevData.first_session.split('T')[0],
                last_session: prevData.last_session.split('T')[0]
            }))
            setPatientData(modifiedData);
        } catch (err) {
            console.error('Error fetching patient list:', err);
            showToast('Error al obtener los datos', (err as Error).message, 'error')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        setIsFinishLaterHistory([]);
        if (patientData.length > 0) {
            filterIsFinishLater(patientData);
        }
    }, [patientData])
    const [isFinishLaterHistory, setIsFinishLaterHistory] = useState<PatientMainData[]>([]);
    const [isFinishLaterEvolution, setIsFinishLaterEvolution] = useState<EvolutionToComplete[]>([]);


    //filter isFinishLater patients
    const filterIsFinishLater = async (data: PatientMainData[]) => {
        const filteredPatients = data.filter((patient) => patient.is_finish_later === true);
        setIsFinishLaterHistory((prevHistory) => [...prevHistory, ...filteredPatients]);
    };
    const [, setIsLoadingHist] = useLoadingIncEvHistContext();
    //filter isFinishLater evolutions
    const fetchFinishLaterEvolutions = async () => {
        setIsLoadingHist(true)
        if (clinic === null) {
            console.error('No clinic d90ata found');
            setIsLoadingHist(false)
            return;
        }
        try {
            const { data, error } = await client.functions.invoke(`fetch_unfinished_evolutions?clinic_id=${clinic.id}`, {
                method: 'GET',
            })

            if (error) {
                console.error('Error fetching unfinished evolutions:', error.message);
                showToast('Error al obtener los datos', error.statusText, 'error')
                return;
            }
            const modifiedData = data.map((prevData: EvolutionToComplete) => ({
                ...prevData,
                attended_date: prevData.attended_date.split('T')[0]
            }))
            setIsFinishLaterEvolution(modifiedData);
        } catch (err) {
            console.error('Error fetching unfinished evolutions:', err);
            showToast('Error al obtener los datos', (err as Error).message, 'error')
        } finally {
            setIsLoadingHist(false)
        }
    }


    return (
        <div className="flex flex-col max-h-screen">
            <Toaster toasterId="global-toaster" />
            <div className={`${isDarkMode ? "bg-mainBgDark" : "bg-mainBgLight"} lg:flex flex-row justify-between px-5 hidden`}>
                <div className="flex flex-row justify-center items-center w-44 h-20 m-2">
                    {isClinicMember ?
                        ((clinic_logo !== '' && clinic_logo!==null) ? (<h1 className='text-3xl font-bold'>
                            <img src={clinic_logo} alt="" className="w-36 h-20 object-contain" />
                        </h1>) : (<h1 className='text-3xl font-bold'>
                            Bienvenido
                        </h1>)) : (<h1 className='text-3xl font-bold'>
                            Bienvenido
                        </h1>)
                    }
                </div>
                <div className='flex flex-row items-center m-2'>
                    {loggedUser?.role === 'admin' && (
                        <div className="font-roboto italic text-gray-400" id='clinic-code'>Codigo: {clinic?.unique_code}</div>
                    )}
                    <div className='border-2 mx-2 p-2 font-roboto'>
                        <Menu>
                            <MenuTrigger disableButtonEnhancement>
                                <Button appearance='transparent' id='user-logout-menu'>
                                    <PersonCircle28Regular className='mr-2' />
                                    {loggedUser?.name}
                                </Button>
                            </MenuTrigger>
                            <MenuPopover>
                                <MenuList>
                                    <MenuItem>
                                        <Button onClick={() => signOut()} appearance='transparent' id='logoutButton'>Cerrar sesion</Button>
                                    </MenuItem>
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
                        <div>
                            <div className='px-3 py-5 font-roboto lg:hidden flex flex-row justify-between'>
                                <button onClick={() => signOut()} className={`text-white`}>Cerrar sesion</button>
                                {loggedUser?.role === 'admin' && (
                                    <div className="font-roboto italic text-gray-400">Codigo: {clinic?.unique_code}</div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>


                <div className={`flex flex-grow flex-col w-full ${isDarkMode ? "bg-secondaryBgDark" : "bg-secondaryBgLight"} lg:h-[calc(100vh-96px)] h-[calc(100vh-38px)] overflow-y-auto`}>
                    {(() => {
                        switch (activeTab) {
                            case 'pacientesElement':
                                return (
                                    <PatientsPage
                                        fetchPatientList={fetchPatientList}
                                        patientData={patientData}
                                        setPatientData={setPatientData}
                                        isFinishLaterEvolution={isFinishLaterEvolution}
                                        isFinishLaterHistory={isFinishLaterHistory}
                                        fetchFinishLaterEvolutions={fetchFinishLaterEvolutions}
                                    />
                                );
                            case 'settingsElement':
                                return <SettingsComponent isClinicMember={isClinicMember} fetchLogoUrl={fetchLogoUrl} />;
                            case 'mainElement':
                                return (
                                    <MainElementPage
                                        isClinicMember={isClinicMember}
                                        userJoinRequests={userJoinRequests}
                                        userSession={userSession ?? null}
                                        userName={loggedUser?.name}
                                        fetchPatientList={fetchPatientList}
                                        setPatientData={setPatientData}
                                        isFinishLaterEvolution={isFinishLaterEvolution}
                                        isFinishLaterHistory={isFinishLaterHistory}
                                        fetchFinishLaterEvolutions={fetchFinishLaterEvolutions}
                                        fetchClinicUserData={fetchClinicUserData}
                                        fetchUserJoinRequests={fetchUserJoinRequests}
                                    />
                                );
                            default:
                                return (
                                    <div className={`h-full m-3 ${isDarkMode ? 'bg-thirdBgDark' : 'bg-white'} `}>
                                        <div className="flex flex-col justify-center items-center">
                                            <h1 className="text-3xl font-bold my-10">Cargando datos</h1>
                                            <Spinner size="extra-large" />
                                        </div>
                                    </div>
                                );
                        }
                    })()}
                </div>
            </div>

        </div>

    );
}
