import { useEffect, useState } from 'react';
import { useThemeContext } from '../context/themeContext.ts';
import { client } from '../supabase/client';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbButton,
    InfoLabel,
} from '@fluentui/react-components';
import InputFieldWithIcon from '../components/InputFieldWithIcon.tsx';
import TextFieldWithIcon from '../components/TextFieldWithIcon.tsx';

export default function UserCompanySetup() {
    const navigate = useNavigate();
    useEffect(() => {
        client.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                console.log('User not logged in');
                navigate('/login');
            } else {
                console.log('User logged in', session);
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [data, setData] = useState({
        consultoryName: '',
        phoneNumber: '',
        address: '',
        description: ''
    });
    const [joinRequestCode,setJoinRequestCode] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    
    const { isDarkMode } = useThemeContext();
    const [isCreateCompany, setIsCreateCompany] = useState(true);

    const createConsultory = () => {
        console.log('creating consultory')
    }
    const sendJoinRequest = () => {
        console.log('Attempting to join with code ',joinRequestCode)
    }
    const showOptionSelected = () => {
        if (isCreateCompany) {
            return (
                <div className='grid md:grid-cols-2 grid-cols-1'>
                    <InputFieldWithIcon id='consultoryName' placeholder='Nombre de la compañia' value={data.consultoryName} handleDatachange={(e) => handleChange(e)} label='Ingrese el nombre del consultorio:' />
                    <InputFieldWithIcon id='phoneNumber' placeholder='Numero de telefono' value={data.phoneNumber} handleDatachange={(e) => handleChange(e)} label='Ingrese el numero de telefono:' />
                    <div className='flex flex-col mp-2 col-span-full '>
                        <TextFieldWithIcon handleDatachange={(e) => handleChange(e)} id='address' placeholder='Ingrese la direccion: ' value={data.address} label='Ingrese la direccion del consultorio:' />
                        <TextFieldWithIcon handleDatachange={(e) => handleChange(e)} id='description' placeholder='Ingrese la breve descripcion: ' value={data.description} label='Ingrese una breve descripcion del consultorio:' />
                    </div>
                    <Button className='col-span-full' onClick={createConsultory}>Crear Empresa</Button>
                </div>
            );
        } else {
            return (
                <div className='flex flex-col'>
                    <div className='flex flex-col mb-5'>
                        <InfoLabel info={
                            <>
                                <p>Solicite al administrador de la empresa el codigo de identificacion.</p>
                                <p>Este se encuentra en la esquina superior derecha de la pantalla de inicio.</p>
                            </>
                        }>
                            Ingrese el codigo identificador de la empresa
                        </InfoLabel>
                        <InputFieldWithIcon id='companyCode' placeholder='Codigo de empresa' value={joinRequestCode} handleDatachange={(e) => setJoinRequestCode(e.target.value)}/>
                    </div>
                    <Button onClick={sendJoinRequest}>Solicitar unirme</Button>
                </div>
            );
        }
    }
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
                                <BreadcrumbButton onClick={() => setIsCreateCompany(true)}>
                                    Crea tu empresa
                                </BreadcrumbButton>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <BreadcrumbButton onClick={() => setIsCreateCompany(false)}>
                                    Unete a una empresa
                                </BreadcrumbButton>
                            </BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                    <div className='mb-5 w-full px-5'>
                        {showOptionSelected()}
                    </div>
                </div>
            </div>
        </div>
    );
}