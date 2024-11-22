import { Accordion, AccordionItem, AccordionHeader, AccordionPanel, Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, Spinner, useId, useToastController, Toast, ToastTitle, ToastBody, Toaster, ToastIntent } from '@fluentui/react-components';
import { PatientSummary } from '../types/types.ts'
import { useState } from 'react';
import AccordionDetailSection from './AccordionDetailSection.tsx';
import DetailRow from './DetailRow.tsx';
import { DetailGridRow } from './DetailedGridRow.tsx'
import DialogViewParaclinics from './DialogViewParaclinics.tsx';
import DialogUploadParaclinic from './DialogUploadParaclinic.tsx';
import DialogAnnotations from './DialogAnnotations.tsx';

interface Props {
    selectedPatient: PatientSummary | null;
    open: boolean;
    setOpen: (open: boolean) => void;
    fetchSelectedPatientDetails: (patient_id: number, forceRefresh?: boolean) => void;
    selectedPatientId: number | null;
}

export default function PatientHistory({ selectedPatient, open, setOpen, fetchSelectedPatientDetails, selectedPatientId }: Props) {
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
    const validateFileType = (file: File): boolean => {
        const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
        return validMimeTypes.includes(file.type);
    };
    const [paraclinicToSend, setParaclinicToSend] = useState<File | null>(null);
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!validateFileType(file)) {
                showToast('Error', 'Solo se aceptan imagenes y pdf', 'error');
                return;
            }
            setParaclinicToSend(file);
        }
    }

    const closeMainDialog = () => {
        setParaclinicToSend(null);
        setOpen(false);
    }
    return (
        <Dialog open={open} >
            <Toaster toasterId={toasterId} />
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
                                            <DetailRow label="Fecha" value={`${selectedPatient?.first_session.split('T')[0]} Hora: ${selectedPatient?.first_session.split('T')[1].slice(0, 5)}`} />
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
                                            <DetailRow label="Cardiaco" value={selectedPatient?.system_review?.cardiac} />
                                            <DetailRow label="Sueño" value={selectedPatient?.system_review?.sleep} />
                                            <DetailRow label="Nervioso" value={selectedPatient?.system_review?.nervous} />
                                            <DetailRow label="Actividad Física" value={selectedPatient?.system_review?.physical_activity} />
                                            <DetailRow label="Respiratorio" value={selectedPatient?.system_review?.respiratory} />
                                            <DetailRow label="Psicosocial" value={selectedPatient?.system_review?.psychosocial} />
                                            <DetailRow label="Digestivo" value={selectedPatient?.system_review?.digestive} />
                                            <DetailRow label="Sentidos" value={selectedPatient?.system_review?.senses} />
                                            <DetailRow label="Sanguineo" value={selectedPatient?.system_review?.blood} />
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
                                                                    {evolution.attended_date.split('T')[0]} - {evolution.attended_date.split('T')[1].slice(0, 5)}
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
                                                                {evolution.evolution_id !== undefined && <DialogAnnotations evolutionId={evolution.evolution_id} showToast={showToast} fetchSelectedPatientDetails={fetchSelectedPatientDetails} selectedPatientId={selectedPatientId} />}
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
                                        <div className='space-y-5'>
                                            {(selectedPatient?.paraclinic && selectedPatient?.paraclinic?.length > 0) ? (
                                                <Accordion>
                                                    {selectedPatient?.paraclinic.map((paraclinic, index) => (
                                                        <AccordionItem className="w-full" key={index} value={index.toString()}>
                                                            <AccordionHeader>
                                                                {paraclinic.title}
                                                            </AccordionHeader>
                                                            <AccordionPanel>
                                                                <div className=''>
                                                                    <h4 className='font-semibold font-roboto'>Subido por:</h4>
                                                                    <p>{paraclinic.uploaded_by.name}</p>
                                                                    <h4 className='font-semibold font-roboto'>Fecha de subida:</h4>
                                                                    <p>{paraclinic.date_uploaded.split('T')[0]}</p>
                                                                </div>
                                                                <DialogViewParaclinics paraclinic={paraclinic} />
                                                            </AccordionPanel>
                                                        </AccordionItem>

                                                    ))}
                                                </Accordion>

                                            ) : (
                                                <div className='text-lg font-roboto'>No se encontraron paraclinicos</div>
                                            )
                                            }
                                            <div className='my-5'>
                                                <h2 className='text-base font-roboto'>Subir un paraclinico</h2>
                                                <div className='flex flex-col my-2 space-y-4'>
                                                    <input
                                                        type="file"
                                                        onChange={handleFileUpload}
                                                        className="w-full h-full"
                                                    />
                                                    <DialogUploadParaclinic content={paraclinicToSend} showToast={showToast} selectedPatientId={selectedPatient.id} fetchSelectedPatientDetails={fetchSelectedPatientDetails} />
                                                </div>
                                            </div>

                                        </div>
                                    </AccordionDetailSection>

                                </Accordion>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button appearance="secondary" onClick={closeMainDialog}>Cerrar</Button>
                        </DialogActions>
                    </DialogBody>
                ) : (
                    <DialogBody>
                        <DialogTitle>
                            Cargando...
                        </DialogTitle>
                        <DialogContent>
                            <Spinner size='extra-large' className='my-12' />
                        </DialogContent>
                        <DialogActions>
                            <Button appearance="secondary" onClick={closeMainDialog}>Cerrar</Button>
                        </DialogActions>
                    </DialogBody>
                )}
            </DialogSurface>
        </Dialog>
    )
}
