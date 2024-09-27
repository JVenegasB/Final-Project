import { useState } from 'react';
import { Divider } from "@fluentui/react-components";
import { Link } from 'react-router-dom';
import { AiOutlineHome, AiOutlineUser, AiOutlineSetting, AiOutlineMenu } from 'react-icons/ai';
import PatientsPage from './PatientsPage.tsx'
import { useUserContext } from '../context/userContext';


export default function Header() {
    const [loggedUser,] = useUserContext();

    const [activeTab, setActiveTab] = useState('mainButton');

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    console.log(loggedUser);
    const renderTabContent = () => {
        switch (activeTab) {
            case 'default':
                return (
                    <div>
                        <p>Bienvenido {loggedUser?.name}</p>
                        <p>Correo: {loggedUser?.email}</p>
                        <h1>Coo</h1>
                    </div>
                );
            case 'pacientesElement':
                return (
                    <div>
                        <PatientsPage></PatientsPage>
                    </div>
                );
            case 'settingsElement':
                return (
                    <div>
                        <p>C</p>
                        <h1>Coo</h1>
                    </div>
                );
            case 'mainElement':
            // No return here, fall through to default case
            default:
                return (
                    <div>
                        <p>Bienvenido {loggedUser?.name}</p>
                        <p>Correo: {loggedUser?.email}</p>
                        <h1>Coo</h1>
                    </div>
                );
        }
    };
    if (!loggedUser) {
        return (
            <div>
                <p>Usuario no logeado</p>
                <Link to="/login">Iniciar sesion</Link>
            </div>
        );
    }
    return (
        <div className="flex flex-col min-h-screen lg:flex-row bg-customBg">
            <div className='flex flex-col justify-between items-center px-3 bg-blue-600'>
                <div className='flex flex-col justify-between items-center px-3 bg-blue-600 w-full lg:w-auto'>
                    <div className="bg-red-100 p-10 my-3">
                        <p>Logo</p>
                    </div>
                    <button onClick={toggleMenu} className="lg:hidden">
                        <AiOutlineMenu className="text-white" size={30} />
                    </button>
                </div>

                <div className={`flex flex-col font-openSans mb-auto w-full ${isMenuOpen ? 'block' : 'hidden lg:block'}`}>
                    <div className='my-2'>
                        <Divider />
                    </div>
                    <div className='mx-5 mt-2 mb-1'>
                        <button onClick={() => setActiveTab('mainElement')} className="flex items-center">
                            <AiOutlineHome className="mr-2 " size={20} />
                            <p className=' text-white text-lg'>Inicio</p>
                        </button>
                    </div>
                    <div className="mx-5 my-1">
                        <button onClick={() => setActiveTab('pacientesElement')} className="flex items-center">
                            <AiOutlineUser className="mr-2" size={20} />
                            <p className=' text-white text-lg'>Pacientes</p>
                        </button>
                    </div>
                    {isMenuOpen && (
                        <div className="mx-5 mb-3 lg:hidden">
                            <button onClick={() => setActiveTab('settingsElement')} className="flex items-center">
                                <AiOutlineSetting className="mr-2" size={20} />
                                <p className=' text-white text-lg'>Configuraciones</p>
                            </button>
                        </div>
                    )}
                </div>

                <div className={`mx-5 mb-3 hidden lg:block`}>
                    <button onClick={() => setActiveTab('settingsElement')} className="flex items-center ">
                        <AiOutlineSetting className="mr-2" size={20} />
                        <p className='text-lg text-white'>Configuraciones</p>
                    </button>
                </div>
            </div>
            <div className='w-full pt-5 max-h-screen overflow-y-auto'>
                {renderTabContent()}
            </div>

        </div>
    );
}
