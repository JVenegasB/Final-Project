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
    setUserData({ name: 'Admin', email: email, id: 1, role: 'admin' })
    navigate('/mainPage')
  }

  return (
      <div className="flex min-h-screen">
        <div className="hidden lg:flex lg:w-1/2 bg-blue-600 justify-center items-center">
          <div className="text-white">
            <svg
              className="h-20 w-20 mb-4 mx-auto"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 5.74C16.4 2.3 22.72 3.88 22.72 9.22C22.72 14.56 14.77 19.24 12 21C9.23 19.24 1.28 14.56 1.28 9.22C1.28 3.88 7.6 2.3 12 5.74Z" />
            </svg>
            <h1 className="text-4xl font-bold">CompanyName</h1>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold font-roboto text-gray-900">
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
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 font-lato">
                    Recuerdame
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 font-lato">
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
                <p className='mt-3 font-lato'>No tienes cuenta? <Link to="/signup" className='font-medium text-blue-600 hover:text-blue-500'>Create una</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>


  )
}