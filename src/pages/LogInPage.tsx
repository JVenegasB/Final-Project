import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

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
    console.log('Login attempted with:', { email, password })
    setUserData({ name: 'Admin', email: email, id: 1, role: 'admin', nickName: 'Juan Venegas', code: 'ABC123' })
    navigate('/mainPage')
  }

  return (
    <div className="flex h-screen">
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-xl space-y-8 p-10 bg-blue-900">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold font-roboto text-white">
              Inicia sesion con tu cuenta
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only font-openSans">
                  Correo electronico
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none font-openSans rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Correo electronico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-white font-lato">
                  Recuerdame
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-200 hover:text-blue-500 font-lato ">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <div className='flex flex-col justify-center items-end'>
              <button
                type="submit"
                className="group relative w-full font-openSans flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Ingresar
              </button>
              <p className='mt-3 font-lato'>No tienes cuenta? <Link to="/signup" className='font-medium text-blue-200 hover:text-blue-500 ml-1'>Create una</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>


  )
}