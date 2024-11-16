import { useEffect, useState } from "react";
import { client } from "../supabase/client";
import { Button, Input, Label, Textarea } from "@fluentui/react-components";
import {useClinicContext} from '../context/clinicContext.ts';


export default function CompanyDataChangeComponent() {
    const [clinicInformation,setClinicInformation] = useClinicContext();
    //get clinic data
    const fecthClinicData = async () => {
        const { data, error } = await client.from('clinic').select('*').eq('id', clinicInformation?.id).single()
        if (error) {
            console.error('Error fetching data: ', error)
        } else {
            setClinicInformation(data)

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
    //Submit updated clinic data
    const handleDataSubmit = async () => {
        if (clinicData.name === '' || clinicData.address === '' || clinicData.phone === '' || clinicData.description === '') {
            console.log('Please fill all fields')
            return
        }

        const { data, error } = await client
            .from('clinic')
            .update(clinicData)
            .eq('id', clinicInformation?.id);
        if (error) {
            console.error('Error updating data: ', error)
        } else {
            console.log('Data updated: ', data)
            fecthClinicData()
        }
    }
    //Disable button if any field is empty
    const [disableButton, setDisableButton] = useState(true)
    useEffect(() => {
        if (clinicData.name === '' || clinicData.address === '' || clinicData.phone === '' || clinicData.description === '') {
            setDisableButton(true)
        } else {
            setDisableButton(false)
        }
    }, [clinicData])
    return (
        <div className="grid grid-cols-[auto,1fr] gap-y-2 items-center overflow-y-auto max-h-[calc(100vh-650px)]">

            <Label>Nombre de la empresa</Label>
            <Input className="w-full" id='name' name='name' placeholder='Ingrese el nombre de la empresa' value={clinicData.name} onChange={handleClinicDataChange} />
            <Label>Direccion</Label>
            <Input className="w-full" id='address' name='address' placeholder='Ingrese la direccion' value={clinicData.address} onChange={handleClinicDataChange} />
            <Label>Numero de telefono</Label>
            <Input className="w-full" id='phone' name='phone' placeholder='Ingrese el numero de telefono' value={clinicData.phone} onChange={handleClinicDataChange} />
            <Label>Descripcion</Label>
            <Textarea className="w-full" id='description' name='description' placeholder='Ingrese la Descripcion' value={clinicData.description} onChange={handleClinicDataChange} resize="vertical" />
            <Button onClick={() => handleDataSubmit()} disabled={disableButton}>Enviar datos</Button>
        </div>
    )
}
