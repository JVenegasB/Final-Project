import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import { Label, Input, Button, Checkbox } from '@fluentui/react-components';
import { client } from '../supabase/client';
import {EyeOffRegular, EyeRegular} from '@fluentui/react-icons';

export default function LogInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("LogInPage must be used within a UserContext.Provider");
  }

  const [, setUserData] = userContext;




  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUserData({ name: 'Admin', email: email, id: 1, role: 'admin', nickName: 'Juan Venegas', code: 'ABC123' })
    client.auth.signInWithPassword({
      email,
      password
    }).then((response) => {
      if (response.error) {
        console.error('Error logging in', response.error.message);
      } else {
        console.log('User logged in', response);
        navigate('/mainPage')
      }
    }).catch((error) => {
      console.error('Error in authentication process', error);
    });

  }
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await client.auth.getUser();
      if (data?.user) {
        navigate('/mainPage');
      }
    };

    checkUser();
  }, [navigate]);

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
  return (
    <div className="flex h-screen">
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-xl space-y-8 p-10 bg-blue-900/50 rounded-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold font-roboto text-white">
              Inicia sesion con tu cuenta
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <Label htmlFor="email-address" className="sr-only font-openSans">
                  Correo electronico
                </Label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full py-3"
                  placeholder="Correo electronico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password" className="sr-only">
                  contraseña
                </Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  contentAfter={<MicButton />}                  
                  autoComplete="current-password"
                  required
                  className="w-full py-3"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                
                <Checkbox
                  id="remember-me"
                  label={'Recuerdame'}
                />

              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-200 hover:text-blue-500 font-lato ">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <div className='flex flex-col justify-center items-end'>
              <Button
                type="submit"
                className="group relative w-full font-openSans flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Ingresar
              </Button>
              <p className='mt-3 font-lato'>No tienes cuenta? <Link to="/signup" className='font-medium text-blue-200 hover:text-blue-500 ml-1'>Create una</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>


  )
}