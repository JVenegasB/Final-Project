import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Toaster, useId, useToastController, Toast, ToastTitle, ToastBody, ToastIntent } from '@fluentui/react-components';
import { EyeRegular, EyeOffRegular } from '@fluentui/react-icons';
import { client } from '../supabase/client';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../context/themeContext';
import InputWithLabel from '../components/InputWithLabelProps';


export default function SignUpPage() {
     //Toaster
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);
  const showToast = (title:string,description:string,intent:ToastIntent) => {
      dispatchToast(
          <Toast>
              <ToastTitle >{title}</ToastTitle>
              <ToastBody>{description}</ToastBody>

          </Toast>,
          { position:"top-end",intent }
      )
  }

    //Navigation
    const navigate = useNavigate();
    //Data to store values
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassWord, setRepeatPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    //Darkmode
    const { isDarkMode } = useThemeContext();
    //Validate if a field has been interacted with
    const [touched, setTouched] = useState({
        email: false,
        password: false,
        repeatPassword: false
    });
    //Handle password images/content and its view
    const [showPassword, setShowPassword] = useState(false);
    const MicButton: React.FC = () => {
        return (
            <Button
                id='togglePasswordVisibility'
                onClick={() => setShowPassword(!showPassword)}
                icon={showPassword ? <EyeOffRegular /> : <EyeRegular />}
                appearance='transparent'
                size='small'
            />
        )
    }
    //Handle password repeat images/content and its view
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
    //Show error in input fields
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        repeatPassword: ''
    });
    //Validate inputs where filled without errors
    const isFormValid = !errors.email && !errors.password && !errors.repeatPassword && email && password && repeatPassWord && name;
    const [dissableButton, setDissableButton] = useState(false);
    //Data to signup to auth. If signed, the user is inserted in database
    const sigUpUser = async () => {
        const { error, data } = await client.auth.signUp({
            email,
            password
        })
        if (error) {
            console.error('Error creando cuenta:', error);
            showToast("Error creando cuenta",error.message,'error')
            setDissableButton(false);
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
            showToast("Error al crear usuario en la base de datos",error.message,'error')
            setDissableButton(false);
            return false;
        }
        return true;
    }
    //Process to submut user
    const handleSubmit = async (e: React.FormEvent) => {
        setDissableButton(true);
        //Move this to edge function too
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
            navigate('/companySetup/' + name);
        }
        setDissableButton(false);
    };

    //Show errors 
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
    //Function to handle change in values
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
    //Validate if a element has been interacted with and validate errors
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
            <Toaster toasterId={toasterId} />
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
                                <InputWithLabel placeholder='Correo Eletronico' name="email" type='email' value={email} required={true} onChange={handleChange} onInvalid={handleInvalidValue} id='email-address' autocomplete="email" />

                                {touched.email && errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>
                            <div>
                                <InputWithLabel placeholder='Ingrese el nombre' name="name" type='text' value={name} required={true} onChange={handleChange} id='name' autocomplete="name" />
                            </div>
                            <div>
                                <InputWithLabel placeholder='Numero telefonico' name="phone" type='text' value={phone} required={true} onChange={handleChange} onInvalid={handleInvalidValue} id='phone' autocomplete="tel" />
                            </div>
                            <div>
                                <InputWithLabel placeholder='Ingrese la contraseña' name="password" type={showPassword ? 'text' : 'password'} value={password} required={true} onChange={handleChange} onInvalid={handleInvalidValue} id='password' contentAfter={<MicButton />} autocomplete="new-password" />
                                {touched.password && errors.password && <p className="text-red-500 text-sm" id='errorMessage'>{errors.password}</p>}
                            </div>

                            <div>
                                <InputWithLabel placeholder='Repetir la contraseña' name="repeatPassword" type={showRepeatPassword ? 'text' : 'password'} value={repeatPassWord} required={true} onChange={handleChange} onInvalid={handleInvalidValue} id='repeatPassword' contentAfter={<RepeatMicButton />} autocomplete="new-password" />
                                {touched.repeatPassword && errors.repeatPassword && <p className="text-red-500 text-sm" id='repeatErrorMessage'>{errors.repeatPassword}</p>}
                            </div>
                        </div>
                        <div className='flex flex-col justify-center items-end font-lato '>
                            <Button type="submit" className="w-full" disabled={!isFormValid || dissableButton}>
                                Ingresar
                            </Button>
                        </div>
                        <div className='flex justify-between items-center my-0'>
                            <p className='mt-3'>¿Ya tienes cuenta? <Link to="/" className='font-medium hover:text-blue-500 ml-1'>Inicia sesión</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
