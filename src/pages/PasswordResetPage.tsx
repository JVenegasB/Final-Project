import { useEffect,useState } from 'react'
import { useThemeContext } from '../context/themeContext';
import InputFieldWithIcon from '../components/InputFieldWithIcon';
import { MailRegular } from '@fluentui/react-icons';
import { Label, Button } from '@fluentui/react-components';
import { Link } from 'react-router-dom';
import { client } from '../supabase/client';

export default function PasswordResetPage() {
    const { isDarkMode, } = useThemeContext();
    const [email, setEmail] = useState('')
    const [isEmailValid, setIsEmailValid] = useState(false)

    const handleSubmit = async () => {
        const { error } = await client.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://example.com/update-password',
          })
        if (error) {
            console.error('Error sending password reset email', error)
        } 
    }
    const validateEmail = (email:string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    useEffect(() => {
        if (!validateEmail(email)) {
            setIsEmailValid(false)
        }else{
            setIsEmailValid(true)
        }
    }, [email])
    return (
        <div className='flex h-screen'>
            <div className={`w-full flex items-center justify-center bg-gradient-to-br ${isDarkMode ? 'from-black to-gray-500' : 'from-blue-700 to-blue-100"'}`}>
                <div className={`w-full max-w-xl space-y-8 p-10 ${isDarkMode ? 'bg-[#242424]/80' : 'bg-white/80'} rounded-lg`}>
                    <h2 className="mt-6 text-center text-3xl font-extrabold font-roboto">
                        Recupera tu contraseña
                    </h2>
                    <div >
                        <Label htmlFor='passwordRecovery' className="sr-only font-openSans">Ingrese el correo electronico</Label>
                        <InputFieldWithIcon id={'passwordRecovery'} placeholder='Ingresa tu correo electronico' handleDatachange={(e) => setEmail(e.target.value)} value={email} icon={<MailRegular />} type='email'/>
                        {(!isEmailValid && email.length > 0) && <div className='text-red-500 font-openSans'>Correo electronico invalido</div>}
                        <div className='flex flex-row mt-3 justify-between'>
                            <Link to="/" className='font-medium hover:text-blue-500 ml-1'>Iniciar sesion</Link>
                            <Link to="/signup" className='font-medium hover:text-blue-500 ml-1'>Crear cuenta</Link>

                        </div>
                    </div>

                    <div className='flex flex-col justify-center items-end'>
                        <Button
                            className="w-full font-openSans flex justify-center"
                            onClick={handleSubmit}
                            disabled={!isEmailValid}
                        >
                            Ingresar
                        </Button>

                    </div>
                </div>
            </div>
        </div>
    )
}
