import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Textarea } from "@fluentui/react-components";
import { useState } from "react";
import { client } from "../supabase/client";

interface DialogAnnotationsProps {
    evolutionId: number | undefined;
    showToast: (title: string, description: string, intent: 'success' | 'error' | 'warning') => void;
    fetchSelectedPatientDetails: (patient_id: number, forceRefresh?: boolean) => void;
    selectedPatientId: number;
}

export default function DialogAnnotations({evolutionId,showToast,fetchSelectedPatientDetails,selectedPatientId}: DialogAnnotationsProps) {
    const [newAnnotation, setNewAnnotation] = useState('');
    const [isSendingData, setIsSendingData] = useState(false);
    const sendData = async () => {
        setIsSendingData(true);
        if(!evolutionId){
            showToast('Error', 'No se ha seleccionado ninguna evolución', 'error')
            setIsSendingData(false);
            return
        }
        const currentDate = new Date();
        const localISOTime = new Date(
            currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
        ).toISOString().slice(0, 16);
        const { error } = await client.from('annotations').insert({
            evolution_id: evolutionId,
            description: newAnnotation,
            created_at: localISOTime
        })
        if (error) {
            console.error('Error sending annotation:', error)
            showToast('Error', 'Error al enviar la anotación', 'error')
            setIsSendingData(false);
            return
        } else {
            showToast('Anotación enviada', 'Se ha enviado la anotación correctamente', 'success')
            fetchSelectedPatientDetails(selectedPatientId || 0, true);
        }
        setIsSendingData(false);
        setOpen(false);
    }
    const [open,setOpen] = useState(false);
    return (

        <Dialog modalType="non-modal" open={open} onOpenChange={(_event, data) => {
            setOpen(data.open)
        }}>
            <DialogTrigger disableButtonEnhancement>
                <Button>Agregar anotacion</Button>
            </DialogTrigger>
            <DialogSurface style={{ maxWidth: '90%'}}>
                <DialogBody>
                    <DialogTitle>Agregar anotacion</DialogTitle>
                    <DialogContent>
                        <div className="w-full mt-4">
                            <Textarea placeholder="Escribe tu anotación aquí..." className="w-full h-32 border rounded-md p-2" onChange={(e) => setNewAnnotation(e.target.value)} value={newAnnotation} />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">Cerrar</Button>
                        </DialogTrigger>
                        <Button appearance="primary" disabled={isSendingData || newAnnotation === ''} onClick={sendData}>Guardar</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    )
}
