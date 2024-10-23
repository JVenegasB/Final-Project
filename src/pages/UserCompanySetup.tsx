import { useEffect, useState } from 'react';
import { useThemeContext } from '../context/themeContext.ts';
import { client } from '../supabase/client';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbButton,
    Input,
    Label,
    Textarea,
    InfoLabel,
} from '@fluentui/react-components';


export default function UserCompanySetup() {
    const navigate = useNavigate();
    // useEffect(() => {
    //     client.auth.onAuthStateChange((_event, session) => {
    //         if(!session) {
    //             console.log('User not logged in');
    //             navigate('/login');
    //         }else{
    //             console.log('User logged in', session);
    //         }
    //     })
    // }, []);

    const [data, setData] = useState({
        consultoryName: '',
        phoneNumber: '',
        address: '',
        description: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            [e.target.id]: e.target.value
        });

    }
    const { isDarkMode } = useThemeContext();
    const [isCreateCompany, setIsCreateCompany] = useState(true);
    const showOptionSelected = () => {
        if (isCreateCompany) {
            return (
                <div className='grid grid-cols-2 space-y-5'>
                    <div className='flex flex-col mt-5 w-full lg:col-span-1 col-span-2'>
                        <Label htmlFor='companyName'>Ingrese el nombre del consultorio:</Label>
                        <Input id='companyName' value={data.consultoryName} onChange={(e) => handleChange(e)}/>
                    </div>
                    <div className='flex flex-col mt-5 lg:col-span-1 col-span-2'>
                        <Label htmlFor='companyName'>Ingrese el numero de telefono:</Label>
                        <Input id='companyName' value={data.phoneNumber} onChange={(e) => handleChange(e)}/>
                    </div>
                    <div className='flex flex-col mt-5 col-span-2 '>
                        <Label htmlFor='companyName'>Ingrese la direccion del consultorio:</Label>
                        <Textarea id='companyName' value={data.address} onChange={(e) => handleChange(e)}/>
                    </div>
                    <div className='flex flex-col mt-5 col-span-2'>
                        <Label htmlFor='companyName'>Ingrese una breve descripcion del consultorio:</Label>
                        <Textarea id='companyName'  value={data.description} onChange={(e) => handleChange(e)}/>
                    </div>
                    <Button className='col-span-2'>Crear Empresa</Button>
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
                        <Input className='w-full' />
                    </div>
                    <Button>Solicitar unirme</Button>
                </div>
            );
        }
    }
    return (
        <div className={`${isDarkMode ? "bg-mainBgDark" : "bg-white"} h-screen flex flex-col overflow-auto`}>
            <div className='flex flex-col items-center'>
                <h1 className='font-roboto text-4xl font-extrabold my-10'>Crea tu consultorio</h1>
            </div>
            <div className='flex flex-col items-center'>
                <div className={`${isDarkMode ? "bg-secondaryBgDark" : "bg-secondaryBgLight"} flex flex-col w-3/5 items-center rounded-lg`}>
                    <Breadcrumb aria-label='Breadcrumb to setup company' className='my-3'>
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
                    <div className='mb-5 w-full px-5'>
                        {showOptionSelected()}
                    </div>
                </div>


            </div>


        </div>
    );
}