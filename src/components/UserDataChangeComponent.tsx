import { useState, useEffect } from 'react'
import { client } from '../supabase/client'
import { Button, Input, Label, Divider, useId, useToastController, Toast, ToastTitle, ToastBody, Toaster, ToastIntent } from '@fluentui/react-components'
import { EyeOffRegular, EyeRegular } from '@fluentui/react-icons';
import { useUserContext } from '../context/userContext.ts';


export default function UserDataChangeComponent() {
    //Toaster
    const toasterId = useId("toaster");
    const { dispatchToast } = useToastController(toasterId);
    const showToast = (title: string, description: string, intent: ToastIntent) => {
        dispatchToast(
            <Toast>
                <ToastTitle >{title}</ToastTitle>
                <ToastBody>{description}</ToastBody>

            </Toast>,
            { position: "top-end", intent }
        )
    }
    const [user, setUser] = useUserContext();

    const [dataToChange, setDataToChange] = useState({
        newEmail: '',
        userName: '',
        phoneNumber: '',
    })

    const fetchUserData = async () => {
        const { data, error } = await client.from('users').select('*').eq('user_id', user?.user_id).single()
        if (error) {
            console.error('Error fetching data: ', error)
            showToast('Error', 'Error al obtener los datos', 'error')
        } else {
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
            userName: user?.name || '',
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
        const { error } = await client.from('users').update(filteredData).eq('user_id', user?.user_id);
        if (error) {
            console.error('Error updating data: ', error)
            showToast('Error', 'Error al actualizar los datos', 'error')
        } else {
            showToast('Exito', 'Datos actualizados correctamente', 'success')
            fetchUserData()
        }
        setIsSendingData(false)
    }
    const [isSendingData, setIsSendingData] = useState(false)
    const handleDataSubmit = async () => {
        setIsSendingData(true)
        const filteredData = Object.fromEntries(
            Object.entries({
                email: dataToChange.newEmail,
                name: dataToChange.userName,
                phone: dataToChange.phoneNumber,
            }).filter(([value]) => value !== '')
        );
        if (filteredData.email === '') {
            sendUserData(filteredData)
        } else {
            const { error } = await client.auth.updateUser({
                email: filteredData.email
            })
            if (error) {
                console.error('Error updating email: ', error)
                showToast('Error', 'Error al actualizar el correo', 'error')
                setIsSendingData(false)
            } else {
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
    const [isSendingPassword, setIsSendingPassword] = useState(false)
    const sendPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSendingPassword(true)
        const { error } = await client.auth.updateUser({
            password: password
        })
        if (error) {
            console.error('Error updating password: ', error)
            showToast('Error', `Error al actualizar la contraseña: ${error}`, 'error')
        } else {
            showToast('Exito', 'Contraseña actualizada correctamente', 'success')
        }
        setIsSendingPassword(false)
    }

    return (
        <div className="grid grid-cols-[auto,1fr] gap-y-2 items-center overflow-y-auto max-h-[calc(100vh-650px)]">
            <Toaster toasterId={toasterId} />
            {/* <Label>Correo</Label>
            <div>
                <Input className="w-full" id='newEmail' name='newEmail' placeholder='Ingrese el nuevo correo' value={dataToChange.newEmail} onChange={handleUserDataChange}/>
                {!validEmail && <div className='text-red-500 font-openSans'>Correo electronico invalido</div>}
            </div> */}
            <Label>Nombre</Label>
            <Input className="w-full" id='userName' name='userName' placeholder='Ingrese el nombre' value={dataToChange.userName} onChange={handleUserDataChange} />

            <Label>Numero de telefono</Label>
            <Input className="w-full" id='phoneNumber' name='phoneNumber' placeholder='Ingrese el numero de telefono' value={dataToChange.phoneNumber} onChange={handleUserDataChange} />

            <Button onClick={handleDataSubmit} disabled={!validEmail || isSendingData} >{isSendingData ? "Enviando datos..." : "Enviar"}</Button>

            <Divider className='col-span-full my-5'>Cambiar contraseña</Divider>
            <Label>Contraseña</Label>
            <Input id="password" name="password" type={showPassword ? 'text' : 'password'} contentAfter={<MicButton />} placeholder="Ingrese la contraseña" value={password} onChange={handlePasswordChange} />

            <Label>Repetir contraseña</Label>
            <Input id="repeatPassword" name="repeatPassword" type={showRepeatPassword ? 'text' : 'password'} contentAfter={<RepeatMicButton />} placeholder="Repita la contraseña" value={repeatPassword} onChange={handlePasswordChange} />

            <Button disabled={!passwordCorrect || isSendingPassword} onClick={sendPassword} type='button'>{isSendingPassword ? "Enviando..." : "Cambiar contraseñas"}</Button>
        </div>

    )
}
