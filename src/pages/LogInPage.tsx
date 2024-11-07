import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import { Label, Input, Button, Checkbox } from '@fluentui/react-components';
import { client } from '../supabase/client';
import { EyeOffRegular, EyeRegular } from '@fluentui/react-icons';
import { useThemeContext } from '../context/themeContext';

export default function LogInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("LogInPage must be used within a UserContext.Provider");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
  const { isDarkMode, } = useThemeContext();
  return (
    <div className="flex h-screen">
      <div className={`w-full flex items-center justify-center bg-gradient-to-br ${isDarkMode ? 'from-black to-gray-500' : 'from-blue-700 to-blue-100"'}`}>
        <div className={`w-full max-w-xl space-y-8 p-10 ${isDarkMode ? 'bg-[#242424]/80' : 'bg-white/80'} rounded-lg`}>
            <h2 className="mt-6 text-center text-3xl font-extrabold font-roboto">
              Inicia sesion con tu cuenta
            </h2>
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
                <Link to="/recoverpassword" className='font-medium hover:text-blue-500 ml-1'>¿Olvidaste tu contraseña?</Link>
              </div>
            </div>

            <div className='flex flex-col justify-center items-end'>
              <Button
                type="submit"
                className="w-full font-openSans flex justify-center"
              >
                Ingresar
              </Button>

            </div>
            <div className='flex justify-between items-center'>
              <Link to="/" className='font-medium hover:text-blue-500 ml-1'>Volver</Link>
              <p className='mt-3 font-lato'>No tienes cuenta? <Link to="/signup" className='font-medium hover:text-blue-500 ml-1'>Create una</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>


  )
}