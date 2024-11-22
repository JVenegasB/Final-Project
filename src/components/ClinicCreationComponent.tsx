import { Button, useId, useToastController, Toast, ToastTitle, ToastBody, Toaster, ToastIntent } from "@fluentui/react-components";
import { client } from "../supabase/client";
import InputFieldWithIcon from "./InputFieldWithIcon";
import TextFieldWithIcon from "./TextFieldWithIcon";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Session } from '@supabase/supabase-js';

interface ClinicCreationComponentProps {
    userSession: Session | null;
    fetchClinicUserData?: (session: Session) => void;
}

export default function ClinicCreationComponent({ userSession, fetchClinicUserData }: ClinicCreationComponentProps) {
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
    // Data to create consultory
    const [data, setData] = useState({
        consultoryName: '',
        phoneNumber: '',
        address: '',
        description: ''
    });
    const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                showToast('Error','Solo se aceptan imagenes','warning');
                return;
            }

            const maxSizeInBytes = 2 * 1024 * 1024; // 5 MB
            if (file.size > maxSizeInBytes) {
                showToast('Error','El archivo no puede superar los 2 mb','warning');
                return;
            }
            setSelectedLogoFile(file);
        }
    };

    const navigate = useNavigate();
    const createConsultory = async () => {
        if (userSession?.user.id === null || userSession === null) {
            console.error('Error setting user. Unable to create consultory');
            return
        }
        if (selectedLogoFile === undefined || selectedLogoFile === null) {
            console.error('No file selected');
            showToast('Error', 'No se selecciono ninguna imagen', 'error')
            return
        }
        const logoPath = await uploadClinicLogo(selectedLogoFile)
        if (!logoPath) {
            showToast('Error', 'error creando consultorio / logo', 'error')
            return
        }
        const { error } = await client.rpc("create_consultory", {
            address: data.address,
            consultory_name: data.consultoryName,
            description: data.description,
            phone_number: data.phoneNumber,
            logo_url: logoPath,
            user_id: userSession?.user.id
        });
        if (error) {
            console.error('Error creating consultory', error);
            showToast('Error', `Error al crear la empresa ${error.message}`, 'error');
        } else {
            showToast('Empresa creada', 'Se ha creado la empresa', 'success');
            navigate('/mainPage');
            if (fetchClinicUserData) {
                fetchClinicUserData(userSession);
            }
        }
    }
    const uploadClinicLogo = async (file: File) => {
        const filePath = `Clinic Logos/${userSession?.user.id}/${file.name}`;
        const { data, error } = await client.storage.from('Clinic Logos').upload(filePath, file, { upsert: true });
        if (error) {
            console.error('Error uploading image',error.message)
            showToast('Error', error.message, 'error')
            return null
        }
        return data.path;
    }
    //Handle change in clinic creation form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    const [disableSendButton, setDisableSendButton] = useState(true);
    useEffect(() => {
        if (data.consultoryName !== '' && data.phoneNumber !== '' && data.address !== '' && data.description !== '' && selectedLogoFile !== null) {
            setDisableSendButton(false);
        } else {
            setDisableSendButton(true);
        }
        console.log(data)
    }, [data,selectedLogoFile])
    return (
        <div className='grid md:grid-cols-2 grid-cols-1'>
            <Toaster toasterId={toasterId} />
            <InputFieldWithIcon id='consultoryName' placeholder='Nombre de la compañia' value={data.consultoryName} handleDatachange={handleChange} label='Ingrese el nombre del consultorio:' />
            <InputFieldWithIcon id='phoneNumber' placeholder='Numero de telefono' value={data.phoneNumber} handleDatachange={handleChange} label='Ingrese el numero de telefono:' />
            <div className='flex flex-col mp-2 col-span-full '>
                <TextFieldWithIcon handleDatachange={handleChange} id='address' placeholder='Ingrese la direccion: ' value={data.address} label='Ingrese la direccion del consultorio:' />
                <TextFieldWithIcon handleDatachange={handleChange} id='description' placeholder='Ingrese la breve descripcion: ' value={data.description} label='Ingrese una breve descripcion del consultorio:' />
                <input type='file' className="my-3" id='logo-upload' accept="image/" onChange={handleFileChange} />
            </div>
            <Button className='col-span-full' onClick={createConsultory} disabled={disableSendButton}>Crear Empresa</Button>
        </div>
    )
}
