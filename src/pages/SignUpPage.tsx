import React, { useState } from 'react'
import { Link } from 'react-router-dom';

export default function SignUpPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassWord, setRepeatPassword] = useState('')

    
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        repeatPassword: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        console.log('Signup attempted with:', { email,repeatPassWord, password })

    }
    const handleInvalidValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        let errorMessage = ''
        if (e.target.name === 'email') {
            errorMessage = 'El correo electronico es invalido'
        } else if (e.target.name === 'password') {
            errorMessage = 'La contraseña es invalida'
        } else if (e.target.name === 'repeatPassword') {
            errorMessage = 'Las contraseñas no coinciden'
        }
        setErrors(prevErrors => ({
            ...prevErrors,
            [e.target.name]: errorMessage
        }))
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
    
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: '' 
        }))
        if (name === 'email') setEmail(value)
        if (name === 'password') setPassword(value)
        if (name === 'password-repeat') setRepeatPassword(value)
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
                        <h2 className="mt-6 text-center font-roboto text-3xl font-extrabold text-gray-900">
                            Create una cuenta
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4 rounded-md shadow-sm">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Correo electronico
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Correo electronico"
                                    value={email}
                                    onChange={handleChange}
                                    onInvalid={handleInvalidValue}
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    minLength={8}
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Ingrese la contraseña"
                                    value={password}
                                    onChange={handleChange}
                                    onInvalid={handleInvalidValue}
                                />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                            </div>
                            <div>
                                <label htmlFor="password-repeat" className="sr-only">
                                    Repetir contraseña
                                </label>
                                <input
                                    id="passwor-repeatd"
                                    name="password-repeat"
                                    type="password"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Repetir la contraseña"
                                    value={repeatPassWord}
                                    onChange={handleChange}
                                    onInvalid={handleInvalidValue}
                                />
                                {errors.repeatPassword && <p className="text-red-500 text-sm">{errors.repeatPassword}</p>}

                            </div>
                        </div>
                        <div className='flex flex-col justify-center items-end font-lato '>
                            <button
                                type="submit"
                                className="group relative font-openSans w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Ingresar
                            </button>
                            <p className='mt-3'>Ya tienes cuenta? <Link to="/login" className='font-medium text-blue-600 hover:text-blue-500'>Inicia sesion</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}