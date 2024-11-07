import { useState, useEffect } from 'react'
import { client } from '../supabase/client'
import { Button, Input, Label, Divider } from '@fluentui/react-components'
import { EyeOffRegular, EyeRegular } from '@fluentui/react-icons';
import { useUserContext }   from '../context/userContext.ts';


export default function UserDataChangeComponent() {
    const [user,setUser] = useUserContext();
    
    const [dataToChange, setDataToChange] = useState({
        newEmail: '',
        name: '',
        phoneNumber: '',
    })

    const fetchUserData = async () => {
        const { data, error } = await client.from('users').select('*').eq('user_id', user?.user_id).single()
        if (error) {
            console.error('Error fetching data: ', error)
        } else {
            console.log('Data fetched: ', data)
            setUser({
                user_id: data.user_id,
                email: data.email,
                name: data.name,
                phone: data.phone,
                role: data.role
            })
        }
    }
    useEffect(() => {
        setDataToChange({
            newEmail: user?.email || '',
            name: user?.name || '',
            phoneNumber: user?.phone || ''
        })
    }, [user])


    const handleUserDataChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDataToChange((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(dataToChange.newEmail)
    };

    const sendUserData = async (filteredData: { [k: string]: string; }) => {
        const { data, error } = await client
            .from('users')
            .update(filteredData)
            .eq('user_id', user?.user_id);
        if (error) {
            console.error('Error updating data: ', error)
        } else {
            console.log('Data updated: ', data)
            fetchUserData()
        }
    }
    const handleDataSubmit = async () => {
        const filteredData = Object.fromEntries(
            Object.entries({
                email: dataToChange.newEmail,
                name: dataToChange.name,
                phone: dataToChange.phoneNumber,
            }).filter(([value]) => value !== '')
        );

        if (filteredData.email === '') {
            sendUserData(filteredData)
        } else {
            const { data, error } = await client.auth.updateUser({
                email: filteredData.email
            })
            if (error) {
                console.error('Error updating email: ', error)
            } else {
                console.log('Email updated: ', data)
                sendUserData(filteredData)
            }
        }


    }
    const [validEmail, setValidEmail] = useState(false)
    useEffect(() => {
        if (validateEmail()) {
            setValidEmail(true)
        } else {
            setValidEmail(false)
        }
    }, [dataToChange])

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
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
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'password') {
            setPassword(value)
        } else {
            setRepeatPassword(value)
        }
    }
    const [passwordCorrect, setPasswordCorrect] = useState(false)
    useEffect(() => {
        if (password === repeatPassword && password.length >= 8) {
            setPasswordCorrect(true)
        } else {
            setPasswordCorrect(false)
        }
    }, [password, repeatPassword])

    const sendPassword = async () => {
        console.log('Sending password', password)
        const { data, error } = await client.auth.updateUser({
            password: password
          })
        if (error) {
            console.error('Error updating password: ', error)
        }else{
            console.log('Password updated: ', data)
        }

    }
    return (
        <div className="grid grid-cols-[auto,1fr] gap-y-2 items-center overflow-y-auto max-h-[calc(100vh-650px)]">
            <Label>Correo</Label>
            <div>
                <Input className="w-full" id='newEmail' name='newEmail' placeholder='Ingrese el nuevo correo' value={dataToChange.newEmail} onChange={handleUserDataChange} />
                {!validEmail && <div className='text-red-500 font-openSans'>Correo electronico invalido</div>}
            </div>
            <Label>Nombre</Label>
            <Input className="w-full" id='name' name='name' placeholder='Ingrese el nombre' value={dataToChange.name} onChange={handleUserDataChange} />

            <Label>Numero de telefono</Label>
            <Input className="w-full" id='phoneNumber' name='phoneNumber' placeholder='Ingrese el numero de telefono' value={dataToChange.phoneNumber} onChange={handleUserDataChange} />

            <Button onClick={handleDataSubmit} disabled={!validEmail}>Enviar</Button>

            <Divider className='col-span-full my-5'>Cambiar contraseña</Divider>
            <Label>Contraseña</Label>
            <Input id="password" name="password" type={showPassword ? 'text' : 'password'} contentAfter={<MicButton />} placeholder="Ingrese la contraseña" value={password} onChange={handlePasswordChange} />

            <Label>Repetir contraseña</Label>
            <Input id="repeatPassword" name="repeatPassword" type={showRepeatPassword ? 'text' : 'password'} contentAfter={<RepeatMicButton />} placeholder="Repita la contraseña" value={repeatPassword} onChange={handlePasswordChange} />

            <Button disabled={!passwordCorrect} onClick={() => sendPassword()}>Cambiar contraseñas</Button>
        </div>

    )
}
