import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Input, Textarea } from '@fluentui/react-components'
import { useEffect, useState } from 'react'
import { client } from '../supabase/client'
import { useUserContext } from '../context/userContext'

interface paraclinicsType {
    content: File | null,
    showToast: (title: string, description: string, intent: 'success' | 'error') => void
    selectedPatientId: number;
    fetchSelectedPatientDetails: (patient_id: number, forceRefresh?: boolean) => void;
}

export default function DialogUploadParaclinic({ content, showToast, selectedPatientId, fetchSelectedPatientDetails }: paraclinicsType) {
    const [paraclinitTitle, setParaclinicTitle] = useState('')
    const [paraclinicDescription, setParaclinicDescription] = useState('')
    const [userSession] = useUserContext();
    const uploadParaclinic = async () => {
        setIsSending(true);
        if (!content) {
            showToast('Error', 'No se ha seleccionado ningun archivo', 'error');
            setIsSending(false);
            return;
        }
        const file = content;
        const filePath = 'Paraclinics/' + selectedPatientId + '/' + file.name;
        const { data, error } = await client.storage.from('Paraclinics').upload(filePath, file, { upsert: true });
        if (error) {
            console.error('Error uploading paraclinic:', error.message)
            showToast('Error', `Error al subir el paraclinico: ${error.message}`, 'error')
            setIsSending(false);
            return undefined;
        }
        const dataToSend = {
            patient_id: selectedPatientId,
            content_url: data.path,
            date_uploaded: setCurrentDate(),
            file_type: file.type,
            uploaded_by: userSession?.user_id,
            description: paraclinicDescription,
            title: paraclinitTitle
        }
        const { error: paraclinicsError } = await client.from('paraclinics').insert(dataToSend);
        if (paraclinicsError) {
            console.error('Error uploading paraclinic:', paraclinicsError.message)
            showToast('Error', `Error al subir el paraclinico: ${paraclinicsError.message}`, 'error')
            setIsSending(false);
            return undefined;
        }
        showToast('Paraclinico enviado', 'Se ha enviado el documento correctamente', 'success')
        setIsSending(false);
        fetchSelectedPatientDetails(selectedPatientId, true);
        setOpen(false);
    }
    const setCurrentDate = () => {
        const currentDate = new Date();
        const localISOTime = new Date(
            currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
        ).toISOString().slice(0, 16);
        return localISOTime;
    }
    const [enableButton, setEnableButton] = useState(true);
    useEffect(() => {
        if (content) {
            setEnableButton(false);
        }
    }, [content])
    const [enableToSend, setEnableToSend] = useState(true);
    useEffect(() => {
        if (paraclinitTitle.length > 0 && paraclinicDescription.length > 0) {
            setEnableToSend(false);
        } else {
            setEnableToSend(true);
        }
    }, [paraclinitTitle, paraclinicDescription])
    const [open, setOpen] = useState(false);
    const [isSenging, setIsSending] = useState(false);
    return (
        <Dialog modalType="non-modal" open={open} onOpenChange={(_event, data) => {
            setOpen(data.open)
        }}>
            <DialogTrigger disableButtonEnhancement>
                <Button disabled={enableButton} className='max-w-44' size='medium'>Enviar paraclinico</Button>
            </DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Enviar documento</DialogTitle>
                    <DialogContent>
                        <div className='space-y-5'>
                            <div>
                                <p className='font-roboto text-base'>Ingrese el titulo del documento</p>
                                <Input value={paraclinitTitle} onChange={(e) => setParaclinicTitle(e.target.value)} />
                            </div>
                            <div>
                                <p className='font-roboto text-base'>Descripcion</p>
                                <Textarea value={paraclinicDescription} onChange={(e) => setParaclinicDescription(e.target.value)} className='w-full' />
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">Cerrar</Button>
                        </DialogTrigger>
                        <Button onClick={uploadParaclinic} disabled={enableToSend || isSenging}>Enviar</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    )
}
