import { useEffect, useState } from 'react';
import { useThemeContext } from '../context/themeContext.ts';
import { client } from '../supabase/client';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Button,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbButton,
    InfoLabel,
} from '@fluentui/react-components';
import InputFieldWithIcon from '../components/InputFieldWithIcon.tsx';
import TextFieldWithIcon from '../components/TextFieldWithIcon.tsx';
import { Session } from '@supabase/supabase-js';

export default function UserCompanySetup() {
    const navigate = useNavigate();
    const [userSession, setUserSession] = useState<Session | null>(null);
    const { userName } = useParams();
    useEffect(() => {
        // Validate session
        client.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                console.log('User not logged in');
                navigate('/login');
            } else {
                console.log('User logged in', session);
                setUserSession(session);
            }
        })
    }, []);
    // Data to create consultory
    const [data, setData] = useState({
        consultoryName: '',
        phoneNumber: '',
        address: '',
        description: ''
    });
    // Data to store join request code
    const [joinRequestCode, setJoinRequestCode] = useState('')
    //Handle change in clinic creation form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    //Dark mode
    const { isDarkMode } = useThemeContext();
    //State to show option selected
    const [isCreateCompany, setIsCreateCompany] = useState(true);
    //Create consultory
    const createConsultory = async () => {
        //Pasar esto a edge function
        console.log("Pasar esto a edgefunctions")
        const { data: clinic, error } = await client.from('clinic').insert([
            {
                name: data.consultoryName,
                phone: data.phoneNumber,
                address: data.address,
                description: data.description
            }
        ]).select('id').single()
        if (clinic) {
            console.log('Consultory created')
            const { error } = await client.from('clinic_users').insert([
                {
                    user_id: userSession?.user.id,
                    clinic_id: clinic.id,
                    role: 'admin'
                }
            ])
            if (error) {
                console.log('Error creating consultory user', error)
            } else {
                console.log('Consultory user created')
                navigate('/mainPage')
            }
        }
        if (error) {
            console.log('Error creating consultory', error)
        }
    }
    //Send join request
    const sendJoinRequest = async () => {
        //Pasar esto a edge function
        console.log("Pasar esto a edgefunctions")
        const { data: clinic, error } = await client.from('clinic').select('*').eq('unique_code', joinRequestCode).single()
        if (clinic) {
            console.log('Clinic found')
            const { data, error } = await client.from('join_requests').insert([
                {
                    user_id: userSession?.user.id,
                    clinic_id: clinic.id,
                    user_name: userName
                }
            ])
            if (error) {
                console.log('Error creating join request', error)
            } else {
                console.log('Join request created')
                console.log('Data from request: ', data)
                navigate('/')
            }
        }
        if (error) {
            console.error('Error finding clinic', error)
        }
    }
    //Handle change between create and join company
    const handleCreateCompany = () => setIsCreateCompany(true);
    const handleJoinCompany = () => setIsCreateCompany(false);

    return (
        <div className={`${isDarkMode ? "bg-mainBgDark" : "bg-white"} h-[100vh] max-w-[100hw] max-full flex flex-col`}>
            <div className='flex flex-col items-center'>
                <h1 className='font-roboto text-4xl font-extrabold my-10'>Crea tu consultorio</h1>
            </div>
            <div className='flex flex-col items-center'>
                <div className={`${isDarkMode ? "bg-secondaryBgDark" : "bg-secondaryBgLight"} flex flex-col  items-center rounded-lg`}>
                    <div className='overflow-x-auto '>
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
                            <div className='grid md:grid-cols-2 grid-cols-1'>
                                <InputFieldWithIcon id='consultoryName' placeholder='Nombre de la compañia' value={data.consultoryName} handleDatachange={handleChange} label='Ingrese el nombre del consultorio:' />
                                <InputFieldWithIcon id='phoneNumber' placeholder='Numero de telefono' value={data.phoneNumber} handleDatachange={handleChange} label='Ingrese el numero de telefono:' />
                                <div className='flex flex-col mp-2 col-span-full '>
                                    <TextFieldWithIcon handleDatachange={handleChange} id='address' placeholder='Ingrese la direccion: ' value={data.address} label='Ingrese la direccion del consultorio:' />
                                    <TextFieldWithIcon handleDatachange={handleChange} id='description' placeholder='Ingrese la breve descripcion: ' value={data.description} label='Ingrese una breve descripcion del consultorio:' />
                                </div>
                                <Button className='col-span-full' onClick={createConsultory}>Crear Empresa</Button>
                            </div>
                        ) : (
                            <div className='flex flex-col'>
                                <div className='flex flex-col mb-5'>
                                    <p>{userName}</p>
                                    <InfoLabel info={
                                        <>
                                            <p>Solicite al administrador de la empresa el codigo de identificacion.</p>
                                            <p>Este se encuentra en la esquina superior derecha de la pantalla de inicio.</p>
                                        </>
                                    }>
                                        <p>Ingrese el codigo identificador de la empresa</p>
                                    </InfoLabel>
                                    <InputFieldWithIcon id='companyCode' placeholder='Codigo de empresa' value={joinRequestCode} handleDatachange={(e) => setJoinRequestCode(e.target.value)} />
                                </div>
                                <Button onClick={sendJoinRequest}>Solicitar unirme</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}