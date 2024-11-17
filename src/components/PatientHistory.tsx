import { Accordion, AccordionItem, AccordionHeader, AccordionPanel, Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, Textarea, Spinner } from '@fluentui/react-components';
import { PatientSummary } from '../types/types.ts'
import { AddCircle24Regular } from '@fluentui/react-icons';
import { useEffect, useState } from 'react';
import AccordionDetailSection from './AccordionDetailSection.tsx';
import DetailRow from './DetailRow.tsx';
import { DetailGridRow } from './DetailedGridRow.tsx'
import { client } from '../supabase/client';

interface Props {
    selectedPatient: PatientSummary | null;
    open: boolean;
    setOpen: (open: boolean) => void;
    fetchSelectedPatientDetails: (patient_id: number, forceRefresh?: boolean) => void;
    selectedPatientId: number | null;
}

export default function PatientHistory({ selectedPatient, open, setOpen, fetchSelectedPatientDetails, selectedPatientId }: Props) {
    //Show annotations dialog
    const [annotationsDialog, setAnnotationsDialog] = useState<boolean>(false);
    //Store annotations values
    const [newAnnotation, setNewAnnotation] = useState<string>('');
    //Store id of the evolution
    const [evolutionId, setEvolutionId] = useState<number>(0);
    //Handle dialog appearance
    const showDialog = (evolution_id: number) => {
        setEvolutionId(evolution_id);
        setAnnotationsDialog(true)
    }
    //Handle close dialog
    const closeDialog = () => {
        setAnnotationsDialog(false);
        setEvolutionId(0);
        setNewAnnotation('');
    }
    //Send annotation related to a evolution
    const sendData = async () => {
        const currentDate = new Date();
        const localISOTime = new Date(
            currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
        ).toISOString();
        const { error } = await client.from('annotations').insert({
            evolution_id: evolutionId,
            description: newAnnotation,
            created_at: localISOTime
        })
        if (error) {
            console.error('Error sending annotation:', error)
        } else {
            closeDialog();
            setAnnotationsDialog(false);
            setNewAnnotation('');
            setEvolutionId(0);
            fetchSelectedPatientDetails(selectedPatientId || 0, true);
        }
    }
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    useEffect(() => {
        if (selectedPatient?.first_session) {
            const date = new Date(selectedPatient.first_session);
            setDate(date.toLocaleDateString());
            setTime(date.toLocaleTimeString());
        }
    }, [selectedPatient])

    return (
        <Dialog open={open} >
            <DialogSurface style={{ width: '65%', maxWidth: '90%' }}>
                {(selectedPatient?.id === selectedPatientId) ? (
                    <DialogBody>
                        <DialogTitle>
                            <div className='flex flex-col font-roboto'>
                                <div>
                                    <span>Paciente: </span>
                                    <span className='font-lato'>{selectedPatient?.name}</span>
                                </div>
                                <div className='text-sm'>
                                    <span>Cedula: </span>
                                    <span className='font-lato'>{selectedPatient?.identification}</span>
                                </div>
                            </div>
                        </DialogTitle>
                        <DialogContent>
                            <div>
                                <Accordion className="h-full" multiple>
                                    <AccordionDetailSection title='0. Datos del paciente'>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            <DetailRow label="Fecha" value={`${date} Hora: ${time}`} />
                                            <DetailRow label="Doctor" value={selectedPatient?.doctor} />
                                            <DetailRow label="Nombre" value={selectedPatient?.name} />
                                            <DetailRow label="Edad" value={selectedPatient?.age} />
                                            <DetailRow label="Fecha de nacimiento" value={selectedPatient?.date_of_birth} />
                                            <DetailRow label="Ocupación" value={selectedPatient?.occupation} />
                                            <DetailRow label="Estado civil" value={selectedPatient?.marital_status} />
                                            <DetailRow label="Identificación" value={selectedPatient?.identification} />
                                            <DetailRow label="Teléfono" value={selectedPatient?.phone} />
                                            <DetailRow label="Correo" value={selectedPatient?.email} />
                                            <DetailRow label="Dirección" value={selectedPatient?.address} spanFull />
                                            <DetailRow label="Creencia religiosa" value={selectedPatient?.religious_belief} spanFull />
                                        </div>
                                    </AccordionDetailSection>
                                    <AccordionDetailSection title='1. Motivo de consulta'>
                                        <AccordionPanel className='px-10 font-openSans'>
                                            <div>
                                                {selectedPatient?.motive}
                                            </div>
                                        </AccordionPanel>
                                    </AccordionDetailSection>
                                    <AccordionDetailSection title='2. Enfermedad actual'>
                                        <AccordionPanel className='px-10 font-openSans'>
                                            {selectedPatient?.current_illness}
                                        </AccordionPanel>
                                    </AccordionDetailSection>

                                    <AccordionDetailSection title="3. Antecedentes personales">
                                        <DetailRow label="Patológicos" value={selectedPatient?.personal_background?.pathological} />
                                        <DetailRow label="Farmacológicos" value={selectedPatient?.personal_background?.pharmacological} />
                                        <DetailRow label="Hospitalarios" value={selectedPatient?.personal_background?.hospitalary} />
                                        <DetailRow label="Quirúrgico" value={selectedPatient?.personal_background?.surgical} />
                                        <DetailRow label="Traumático" value={selectedPatient?.personal_background?.trauma} />
                                        <DetailRow label="Alérgico" value={selectedPatient?.personal_background?.allergic} />
                                        <DetailRow label="Tóxico" value={selectedPatient?.personal_background?.toxic} />
                                        {selectedPatient?.personal_background?.isGinecoObstetric ? (
                                            <div>
                                                <div className="font-semibold font-roboto my-2 flex justify-center">
                                                    Gineco-obstétrico:
                                                </div>
                                                <div className="grid lg:grid-cols-5 grid-cols-1 gap-2 mb-5">
                                                    <DetailRow label="FO:" value="" />
                                                    <DetailRow label="G" value={selectedPatient?.personal_background?.gestations} />
                                                    <DetailRow label="P" value={selectedPatient?.personal_background?.births} />
                                                    <DetailRow label="C" value={selectedPatient?.personal_background?.caesarean} />
                                                    <DetailRow label="A" value={selectedPatient?.personal_background?.abortions} />
                                                </div>
                                                <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
                                                    <DetailRow label="Menarquía" value={selectedPatient?.personal_background?.menarche} />
                                                    <DetailRow label="Ciclos" value={selectedPatient?.personal_background?.cycles} />
                                                    <DetailRow label="FUM" value={selectedPatient?.personal_background?.last_menstruation} />
                                                    <DetailRow label="Planificación" value={selectedPatient?.personal_background?.planification} />
                                                    <DetailRow label="FUPAP" value={selectedPatient?.personal_background?.pap_smear} />
                                                </div>
                                                <DetailRow
                                                    label="Observaciones"
                                                    value={selectedPatient?.personal_background?.observations}
                                                    spanFull
                                                />
                                            </div>
                                        ) : (
                                            <DetailRow label="Ginecobstétrico" value="N/A" spanFull />
                                        )}

                                    </AccordionDetailSection>
                                    <AccordionDetailSection title='4. Antecedentes familiares'>
                                        <div>
                                            {selectedPatient?.family_background}
                                        </div>
                                    </AccordionDetailSection>

                                    <AccordionDetailSection title='5. Revision por sistemas'>
                                        <div>
                                            <DetailRow label="Piel y fanera" value={selectedPatient?.system_review?.skin} />
                                            <DetailRow label="Genitourinario" value={selectedPatient?.system_review?.genitourinary} />
                                            <DetailRow label="Colágeno" value={selectedPatient?.system_review?.collagen} />
                                            <DetailRow label="Musculoesquelético" value={selectedPatient?.system_review?.musculoskeletal} />
                                            <DetailRow label="Linfático" value={selectedPatient?.system_review?.lymphatic} />
                                            <DetailRow label="Alimentación" value={selectedPatient?.system_review?.feeding} />
                                            <DetailRow label="Auditivo" value={selectedPatient?.system_review?.auditory} />
                                            <DetailRow label="Sueño" value={selectedPatient?.system_review?.sleep} />
                                            <DetailRow label="Visual" value={selectedPatient?.system_review?.visual} />
                                            <DetailRow label="Actividad Física" value={selectedPatient?.system_review?.physical_activity} />
                                            <DetailRow label="Respiratorio" value={selectedPatient?.system_review?.respiratory} />
                                            <DetailRow label="Psicosocial" value={selectedPatient?.system_review?.psychosocial} />
                                            <DetailRow label="Digestivo" value={selectedPatient?.system_review?.digestive} />

                                        </div>
                                    </AccordionDetailSection>
                                    <AccordionDetailSection title='6. Familiograma'>
                                        <div>
                                            {selectedPatient?.familiogram}
                                        </div>
                                    </AccordionDetailSection>
                                    <AccordionDetailSection title='7. Examen fisico'>
                                        <div>
                                            <div className="grid grid-cols-2 ">
                                                <DetailGridRow label="F.C" value={selectedPatient?.physical_exam?.heart_rate} />
                                                <DetailGridRow label="F.R" value={selectedPatient?.physical_exam?.respiratory_rate} customClasses="lg:border-l-0 border-t-0 lg:border-t-2" />
                                                <DetailGridRow label="T.A" value={selectedPatient?.physical_exam?.blood_pressure} customClasses="lg:border-l-0 border-t-0 border-l-2 lg:border-t-2" />
                                                <DetailGridRow label="SAT" value={selectedPatient?.physical_exam?.saturation} customClasses="border-t-0" />
                                                <DetailGridRow label="T" value={selectedPatient?.physical_exam?.heart_rate} customClasses="lg:border-l-0 border-t-0 border-l-2" />
                                                <DetailGridRow label="Peso" value={selectedPatient?.physical_exam?.weight} customClasses="lg:border-l-0 border-t-0 border-l-2" />
                                                <DetailGridRow label="Talla" value={selectedPatient?.physical_exam?.size} customClasses="border-t-0" />
                                                <DetailGridRow label="IMC" value={selectedPatient?.physical_exam?.imc} customClasses="lg:border-l-0 border-t-0 border-l-2" />
                                            </div>
                                            <div className='flex flex-row mt-2'>
                                                <DetailRow label="Examen fisico" value={selectedPatient?.physical_exam.physical_exam} />
                                            </div>

                                        </div>
                                    </AccordionDetailSection>
                                    <AccordionDetailSection title='8. Diagnostico'>
                                        {selectedPatient?.diagnosis?.length ? (
                                            <ul className="list-disc  space-y-2">
                                                {selectedPatient.diagnosis.map((diag, index) => (
                                                    <li key={index}>
                                                        Codigo: {diag.code}; Descripcion: {diag.description}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 italic">No hay diagnosticos</p>
                                        )}
                                    </AccordionDetailSection>
                                    <AccordionDetailSection title='9. Tratamiento'>
                                        {selectedPatient?.treatment?.length ? (
                                            <ul className="list-disc  space-y-2">
                                                {selectedPatient.treatment.map((diag, index) => (
                                                    <li key={index}>
                                                        {diag.description}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 italic">No se ingreso un tratamiento</p>
                                        )}
                                    </AccordionDetailSection>
                                    <AccordionDetailSection title='10. Evolucion'>
                                        <div className='px-10 py-4 font-openSans'>

                                            <Accordion className="h-full" multiple>
                                                {selectedPatient?.evolution ? (
                                                    selectedPatient?.evolution?.map((evolution, index) => (
                                                        <AccordionItem key={index} value={index.toString()}>
                                                            <AccordionHeader>
                                                                <div className='font-semibold text-lg font-roboto flex flex-row'>
                                                                    {evolution.attended_date}
                                                                </div>
                                                            </AccordionHeader>
                                                            <AccordionPanel>
                                                                <div className='grid lg:grid-cols-2 grid-cols-1'>
                                                                    <div className='py-3'>
                                                                        <h4 className='font-semibold font-roboto'>Motivo:</h4>
                                                                        <p>{evolution.motive}</p>
                                                                    </div>
                                                                    <div className='py-3'>
                                                                        <h4 className='font-semibold font-roboto'>Enfermedad Actual:</h4>
                                                                        <p>{evolution.current_illness}</p>
                                                                    </div>
                                                                    <div className='py-3'>
                                                                        <h4 className='font-semibold font-roboto'>Examen Físico:</h4>
                                                                        <p>{evolution.physical_exam}</p>
                                                                    </div>
                                                                    <div className='py-3'>
                                                                        <h4 className='font-semibold font-roboto'>Diagnóstico:</h4>
                                                                        <p>{evolution.diagnosis}</p>
                                                                    </div>
                                                                    <div className='py-3'>
                                                                        <h4 className='font-semibold font-roboto'>Plan:</h4>
                                                                        <p>{evolution.plan}</p>
                                                                    </div>
                                                                    <div className='py-3'>
                                                                        <div className='font-semibold font-roboto'>Alternativa:</div>
                                                                        <p>{evolution.is_alternative ? evolution.therapy : 'No hay terapia alternativa.'}</p>
                                                                    </div>
                                                                </div>


                                                                {(evolution?.annotations !== undefined && evolution?.annotations !== null && evolution?.annotations?.length > 0) ? (
                                                                    <Accordion className='pl-2 my-5'>
                                                                        <h4 className='font-semibold font-roboto'>Anotaciones:</h4>
                                                                        {evolution.annotations.map((annotation, index) => (
                                                                            <AccordionItem key={index} value={index.toString()}>
                                                                                <AccordionHeader>
                                                                                    Fecha de anotacion: {annotation.date}
                                                                                </AccordionHeader>
                                                                                <AccordionPanel>
                                                                                    <div className='flex flex-row'>
                                                                                        <p>{annotation.description}</p>
                                                                                    </div>

                                                                                </AccordionPanel>
                                                                            </AccordionItem>
                                                                        ))}
                                                                    </Accordion>
                                                                ) : (
                                                                    <div>
                                                                        <p className="text-gray-500 italic">No hay anotaciones</p>
                                                                    </div>
                                                                )}
                                                                {evolution.evolution_id !== undefined && (<Button icon={<AddCircle24Regular />} onClick={() => showDialog(evolution.evolution_id ?? 0)}>Agregar anotacion</Button>)}
                                                            </AccordionPanel>
                                                        </AccordionItem>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500 italic">No hay evolucion</p>
                                                )}
                                            </Accordion>


                                        </div>
                                    </AccordionDetailSection>
                                    <AccordionDetailSection title='11. Paraclinicos'>
                                        <div>
                                            Elementos paraclinicos
                                        </div>
                                    </AccordionDetailSection>

                                </Accordion>
                                <Dialog open={annotationsDialog} onOpenChange={() => closeDialog()}>
                                    <DialogSurface style={{ width: '50%' }}>
                                        <DialogBody>
                                            <DialogTitle>
                                                <div className="font-roboto font-semibold text-lg">
                                                    Agregar anotación
                                                </div>
                                            </DialogTitle>
                                            <DialogContent>
                                                <div className="w-full mt-4">
                                                    <Textarea placeholder="Escribe tu anotación aquí..." className="w-full h-32 border rounded-md p-2" onChange={(e) => setNewAnnotation(e.target.value)} value={newAnnotation} />
                                                </div>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button disabled={newAnnotation === ''} appearance="primary" onClick={() => sendData()}>
                                                    Enviar
                                                </Button>
                                                <Button appearance="secondary" onClick={() => closeDialog()}>
                                                    Cerrar
                                                </Button>
                                            </DialogActions>
                                        </DialogBody>
                                    </DialogSurface>
                                </Dialog>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button appearance="secondary" onClick={() => setOpen(false)}>Cerrar</Button>
                        </DialogActions>
                    </DialogBody>
                ) : (
                    <DialogBody>
                        <DialogContent>
                            <Spinner size='extra-large' className='my-12' />
                        </DialogContent>
                        <DialogActions>
                            <Button appearance="secondary" onClick={() => setOpen(false)}>Cerrar</Button>
                        </DialogActions>
                    </DialogBody>
                )}
            </DialogSurface>
        </Dialog>
    )
}
