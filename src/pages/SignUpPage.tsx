import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Label } from '@fluentui/react-components';
import { EyeRegular, EyeOffRegular } from '@fluentui/react-icons';
import { client } from '../supabase/client';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../context/themeContext';

export default function SignUpPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassWord, setRepeatPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const { isDarkMode, } = useThemeContext();

    const [touched, setTouched] = useState({
        email: false,
        password: false,
        repeatPassword: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const MicButton: React.FC = () => {
        return (
            <Button
                onClick={() => setShowPassword(!showPassword)}
                icon={showPassword ? <EyeOffRegular /> : <EyeRegular />}
                appearance='transparent'
                size='small'
            />
        )
    }
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const RepeatMicButton: React.FC = () => {
        return (
            <Button
                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                icon={showRepeatPassword ? <EyeOffRegular /> : <EyeRegular />}
                appearance='transparent'
                size='small'
            />
        )
    }

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        repeatPassword: ''
    });

    const isFormValid = !errors.email && !errors.password && !errors.repeatPassword && email && password && repeatPassWord && name;

    const sigUpUser = async () => {
        const { error, data } = await client.auth.signUp({
            email,
            password
        })
        if (error) {
            //Aqui error que se mostrara en consola
            console.error('Error creando cuenta:', error);
            return null;
        }
        return data?.session ? data : null;
    }
    const insertUser = async (id: string) => {
        const { error } = await client.from('users').insert({
            user_id: id,
            email,
            name,
            phone
        })
        if (error) {
            //error que se mostrara en consola
            console.error('Error al crear usuario en la base de datos:', error);
            return false;
        }
        return true;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const authData = await sigUpUser();
        if (!authData || !authData.user) {
            //Aqui error que se mostrara al usuario
            console.error('Error en proceso de creacion de cuenta');
            return
        }
        const userIntert = await insertUser(authData.user.id);
        if (!userIntert) {
            //error que se mostrara al usuario
            console.error('Error en el proceso de insercion de usuario');
            return
        } else {
            console.log('Usuario creado correctamente');
            navigate('/companySetup/' + name);
        }
    };


    const handleInvalidValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        let errorMessage = '';
        if (e.target.name === 'email') {
            errorMessage = 'El correo electrónico es inválido';
        } else if (e.target.name === 'password') {
            errorMessage = 'La contraseña debe tener al menos 8 caracteres';
        } else if (e.target.name === 'repeatPassword') {
            errorMessage = 'Las contraseñas no coinciden';
        }
        setErrors(prevErrors => ({
            ...prevErrors,
            [e.target.name]: errorMessage
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTouched(prevTouched => ({ ...prevTouched, [name]: true }));
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }));

        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
        if (name === 'repeatPassword') setRepeatPassword(value);
        if (name === 'name') setName(value);
        if (name === 'phone') setPhone(value);
    };

    useEffect(() => {
        if (touched.password && touched.repeatPassword) {
            if (password !== repeatPassWord) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    repeatPassword: 'Las contraseñas no coinciden'
                }));
            } else {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    repeatPassword: ''
                }));
            }
        }

        if (touched.password && password.length < 8) {
            setErrors(prevErrors => ({
                ...prevErrors,
                password: 'La contraseña debe tener al menos 8 caracteres'
            }));
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                password: ''
            }));
        }

    }, [password, repeatPassWord, touched]);

    return (
        <div className="flex h-screen">
            <div className={`w-full flex items-center justify-center bg-gradient-to-br ${isDarkMode ? 'from-black to-gray-500' : 'from-blue-700 to-blue-100"'}`}>
                <div className={`w-full max-w-xl space-y-8 p-10 ${isDarkMode ? 'bg-[#242424]/80' : 'bg-white/80'} rounded-lg`}>
                    <div>
                        <h2 className="mt-6 text-center font-roboto text-3xl font-extrabold">
                            Crea una cuenta
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4 rounded-md shadow-sm">
                            <div>
                                <Label htmlFor="email-address" className="sr-only">
                                    Correo electrónico
                                </Label>
                                <Input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Correo electrónico"
                                    value={email}
                                    onChange={handleChange}
                                    onInvalid={handleInvalidValue}
                                />
                                {touched.email && errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>
                            <div>
                                <label htmlFor="name" className="sr-only">
                                    Nombre
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Ingrese el nombre"
                                    value={name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="sr-only">
                                    Numero de telefono
                                </label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Ingrese el numero de telefono"
                                    value={phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Contraseña
                                </label>
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    contentAfter={<MicButton />}
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Ingrese la contraseña"
                                    value={password}
                                    onChange={handleChange}
                                    onInvalid={handleInvalidValue}
                                />
                                {touched.password && errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                            </div>

                            <div>
                                <label htmlFor="repeatPassword" className="sr-only">
                                    Repetir contraseña
                                </label>
                                <Input
                                    id="repeatPassword"
                                    name="repeatPassword"
                                    type={showRepeatPassword ? 'text' : 'password'}
                                    contentAfter={<RepeatMicButton />}
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Repetir la contraseña"
                                    value={repeatPassWord}
                                    onChange={handleChange}
                                    onInvalid={handleInvalidValue}
                                />
                                {touched.repeatPassword && errors.repeatPassword && <p className="text-red-500 text-sm">{errors.repeatPassword}</p>}
                            </div>
                        </div>
                        <div className='flex flex-col justify-center items-end font-lato '>
                            <Button
                                type="submit"
                                className="group relative font-openSans w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={!isFormValid}
                            >
                                Ingresar
                            </Button>
                        </div>
                        <div className='flex justify-between items-center my-0'>
                            <Link to="/" className='font-medium hover:text-blue-500 ml-1'>Volver</Link>
                            <p className='mt-3'>¿Ya tienes cuenta? <Link to="/login" className='font-medium hover:text-blue-500 ml-1'>Inicia sesión</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
