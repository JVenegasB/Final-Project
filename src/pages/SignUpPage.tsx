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

        console.log('Signup attempted with:', { email, repeatPassWord, password })

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
        <div className="flex h-screen">
            <div className="w-full flex items-center justify-center">
                <div className="w-full max-w-xl space-y-8 p-10 bg-blue-900">
                    <div>
                        <h2 className="mt-6 text-center font-roboto text-3xl font-extrabold text-white">
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
                            <p className='mt-3'>Ya tienes cuenta? <Link to="/login" className='font-medium text-blue-200 hover:text-blue-500 ml-1'>Inicia sesion</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}