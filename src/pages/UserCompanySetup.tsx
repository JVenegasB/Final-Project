import { useEffect, useState } from 'react';
import { useThemeContext } from '../context/themeContext.ts';
import { client } from '../supabase/client';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbButton,
} from '@fluentui/react-components';
import { Session } from '@supabase/supabase-js';
import ClinicCreationComponent from '../components/ClinicCreationComponent.tsx';
import ClinicSendJoinRequest from '../components/ClinicSendJoinRequest.tsx';

export default function UserCompanySetup() {
    const navigate = useNavigate();
    const [userSession, setUserSession] = useState<Session | null>(null);
    const { userName } = useParams();
    useEffect(() => {
        // Validate session
        client.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                navigate('/login');
            } else {
                setUserSession(session);
            }
        })
    }, []);

    //Dark mode
    const { isDarkMode } = useThemeContext();
    //State to show option selected
    const [isCreateCompany, setIsCreateCompany] = useState(true);

    //Handle change between create and join company
    const handleCreateCompany = () => setIsCreateCompany(true);
    const handleJoinCompany = () => setIsCreateCompany(false);

    return (
        <div className={`${isDarkMode ? "bg-mainBgDark" : "bg-white"} h-[100vh] max-w-[100hw] max-full flex flex-col items-center justify-center`}>
            <div className={`${isDarkMode ? "bg-secondaryBgDark" : "bg-secondaryBgLight"} flex flex-col  items-center rounded-lg lg:w-3/6 md:w-5/6 sm:w-11/12 overflow-auto`}>
                <div className='flex flex-col items-center'>
                    <h1 className='font-roboto text-4xl font-extrabold my-5 mx-5'>Crea tu consultorio</h1>
                </div>
                <div className='overflow-x-auto'>
                    <Breadcrumb aria-label='Breadcrumb to setup company' className='py-3'>
                        <BreadcrumbItem>
                            <BreadcrumbButton onClick={handleCreateCompany}>
                                Crea tu empresa
                            </BreadcrumbButton>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <BreadcrumbButton onClick={handleJoinCompany}>
                                Unete a una empresa
                            </BreadcrumbButton>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </div>
                <div className='mb-5 w-full px-5'>
                    {isCreateCompany ? (
                        <ClinicCreationComponent userSession={userSession} />
                    ) : (
                        <ClinicSendJoinRequest userSession={userSession} userName={userName} />
                    )}
                </div>
            </div>
        </div>
    );
}