import { useEffect, useState } from "react";
import { client } from "../supabase/client";
import { Button, Input, Label, Textarea, useId, useToastController, Toast, ToastTitle, ToastBody, Toaster, ToastIntent } from "@fluentui/react-components";
import { useClinicContext } from '../context/clinicContext.ts';
import { useUserContext } from '../context/userContext.ts';

interface CompanyDataChangeComponentProps {
    fetchLogoUrl: (clinicLogo:string)=> void;
}

export default function CompanyDataChangeComponent({fetchLogoUrl}:CompanyDataChangeComponentProps) {
    //User data
    const [userSession, ] = useUserContext();
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
    const [clinicInformation, setClinicInformation] = useClinicContext();
    //get clinic data
    const fecthClinicData = async () => {
        const { data, error } = await client.from('clinic').select('*').eq('id', clinicInformation?.id).single()
        if (error) {
            console.error('Error fetching data: ', error)
            showToast('Error', 'Error al obtener los datos', 'error')
        } else {
            setClinicInformation(data)
            fetchLogoUrl(data.logo_url)
        }
    }
    const [clinicData, setClinicData] = useState({
        address: clinicInformation?.address,
        description: clinicInformation?.description,
        name: clinicInformation?.name,
        phone: clinicInformation?.phone
    })

    const handleClinicDataChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setClinicData((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]){
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')){
                showToast('Error','Solo se aceptan imagenes','error');
                return;
            }
            const maxSizeInBytes = 2*1024*1024;
            if(file.size > maxSizeInBytes){
                showToast('Error','El archivo no puede superar los 2 mb','error')
                return
            }
            setSelectedLogoFile(file);
        }
    }
    
    const uploadClinicLogo = async (file: File)  => {
        const filePath = `Clinic Logos/${userSession?.user_id}/${file.name}`;
        const { data, error } = await client.storage.from('Clinic Logos').upload(filePath, file, { upsert: true });
        if (error) {
            console.error('Error uploading image: ', error.message);
            showToast('Error', 'Error al subir el logo', 'error');
            return undefined;
        }
        return data.path; 
    };

    //Submit updated clinic data
    const handleDataSubmit = async () => {
        setSendingData(true)
        if (clinicData.name === '' || clinicData.address === '' || clinicData.phone === '' || clinicData.description === '') {
            showToast('Error', 'Por favor completa todos los campos', 'warning');
            setSendingData(false);
            return;
        }
        let logoPath = clinicInformation?.logo_url;
        if (selectedLogoFile) {
            logoPath = await uploadClinicLogo(selectedLogoFile);
            if (!logoPath) {
                showToast('Error', 'Error al subir el logo', 'error');
                setSendingData(false);
                return;
            }
        }
        const updateData = {
            ...clinicData,
            logo_url: logoPath
        }
        const { error } = await client.from('clinic').update(updateData).eq('id', clinicInformation?.id);
        if (error) {
            console.error('Error updating data: ', error)
            showToast('Error', 'Error al actualizar los datos', 'error')
        } else {
            showToast('Exito', 'Datos actualizados exitosamente', 'success')
            fecthClinicData()
        }
        setSendingData(false)
    }
    //Disable button if any field is empty
    const [disableButton, setDisableButton] = useState(true)
    const [sendingData, setSendingData] = useState(false)
    useEffect(() => {
        if (clinicData.name === '' || clinicData.address === '' || clinicData.phone === '' || clinicData.description === '') {
            setDisableButton(true)
        } else {
            setDisableButton(false)
        }
    }, [clinicData])
    return (
        <div className="grid grid-cols-[auto,1fr] gap-y-2 items-center overflow-y-auto max-h-[calc(100vh-650px)]">
            <Toaster toasterId={toasterId} />
            <Label>Nombre del consultorio</Label>
            <Input className="w-full" id='name' name='name' placeholder='Ingrese el nombre del consultorio' value={clinicData.name} onChange={handleClinicDataChange} />
            <Label>Direccion</Label>
            <Input className="w-full" id='address' name='address' placeholder='Ingrese la direccion' value={clinicData.address} onChange={handleClinicDataChange} />
            <Label>Numero de telefono</Label>
            <Input className="w-full" id='phone' name='phone' placeholder='Ingrese el numero de telefono' value={clinicData.phone} onChange={handleClinicDataChange} />
            <Label>Descripcion</Label>
            <Textarea className="w-full" id='description' name='description' placeholder='Ingrese la Descripcion' value={clinicData.description} onChange={handleClinicDataChange} resize="vertical" />
            <input type="file" className="my-3 w-full col-span-full" id='logo-upload' accept="image/" onChange={handleFileChange}/>
            <Button onClick={handleDataSubmit} disabled={disableButton || sendingData}>{sendingData ? "Enviando" : "Enviar datos"}</Button>
        </div>
    )
}
