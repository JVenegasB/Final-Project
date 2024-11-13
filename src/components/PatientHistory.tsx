// import { DocumentPdfRegular } from '@fluentui/react-icons';
import { Accordion, AccordionItem, AccordionHeader, AccordionPanel, Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, Textarea } from '@fluentui/react-components';
import { PatientSummary } from '../types/types.ts'
import { AddCircle24Regular } from '@fluentui/react-icons';
import { useEffect, useState } from 'react';

interface Props {
    selectedPatient: PatientSummary | null;
    open: boolean;
    setOpen: (open: boolean) => void;
    fetchSelectedPatientDetails: (patient_id: number, forceRefresh?: boolean) => void;
    selectedPatientId: number | null;
}



export default function PatientHistory({ selectedPatient, open, setOpen, fetchSelectedPatientDetails, selectedPatientId }: Props) {
    const [annotationsDialog, setAnnotationsDialog] = useState<boolean>(false);
    const [newAnnotation, setNewAnnotation] = useState<string>('');
    const [evolutionId, setEvolutionId] = useState<number>(0);
    const showDialog = (evolution_id: number) => {
        setEvolutionId(evolution_id);
        setAnnotationsDialog(true)
    }


    const closeDialog = () => {
        setAnnotationsDialog(false);
        setEvolutionId(0);
        setNewAnnotation('');
    }
    const sendData = async () => {
        const currentDate = new Date().toISOString();
        console.log('data ', newAnnotation, ' to id ', evolutionId, ' at date ', currentDate);
        const url = 'http://127.0.0.1:54321/functions/v1/add-annotation'
        const data = {
            description: newAnnotation,
            evolution_id: evolutionId,
            created_at: currentDate
        }
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            console.log('response', res);
            closeDialog();
        } catch (err) {
            console.error('Error sending annotation:', err);
        }


        setAnnotationsDialog(false);
        setNewAnnotation('');
        setEvolutionId(0);
        console.log('Selected stuff', selectedPatientId)
        fetchSelectedPatientDetails(selectedPatientId || 0, true);
    }

    useEffect(() => {
        console.log(selectedPatient)
    }, [selectedPatient])

    return (
        <Dialog open={open} >
            <DialogSurface style={{ width: '65%', maxWidth: '90%' }}>
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
                                <AccordionItem value='0'>
                                    <AccordionHeader>
                                        <span className='font-roboto font-semibold text-lg'>0. Datos de paciente</span>
                                    </AccordionHeader>
                                    <AccordionPanel className='px-10'>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            <div className="flex flex-row items-center justify-start">
                                                <div className="font-semibold font-roboto mr-2">Fecha: </div>
                                                <span>{selectedPatient?.first_session}</span>
                                            </div>
                                            <div className="flex flex-row items-center justify-start">
                                                <div className="font-semibold font-roboto mr-2">Doctor: </div>
                                                <span>{selectedPatient?.doctor}</span>
                                            </div>

                                            <div className="flex flex-row items-center justify-start">
                                                <div className="font-semibold font-roboto mr-2">Nombre: </div>
                                                <span>{selectedPatient?.name}</span>
                                            </div>
                                            <div className="flex flex-row items-center justify-start">
                                                <div className="font-semibold font-roboto mr-2">Edad: </div>
                                                <span>{selectedPatient?.age}</span>
                                            </div>

                                            <div className="flex flex-row items-center justify-start">
                                                <div className="font-semibold font-roboto mr-2">Fecha de nacimiento: </div>
                                                <span>{selectedPatient?.date_of_birth}</span>
                                            </div>
                                            <div className="flex flex-row items-center justify-start">
                                                <div className="font-semibold font-roboto mr-2">Ocupación: </div>
                                                <span>{selectedPatient?.occupation}</span>
                                            </div>

                                            <div className="flex flex-row items-center justify-start">
                                                <div className="font-semibold font-roboto mr-2">Estado civil: </div>
                                                <span>{selectedPatient?.marital_status}</span>
                                            </div>
                                            <div className="flex flex-row items-center justify-start">
                                                <div className="font-semibold font-roboto mr-2">Identificación: </div>
                                                <span>{selectedPatient?.identification}</span>
                                            </div>

                                            <div className="flex flex-row items-center justify-start">
                                                <div className="font-semibold font-roboto mr-2">Teléfono: </div>
                                                <span>{selectedPatient?.phone}</span>
                                            </div>
                                            <div className="flex flex-row items-center justify-start">
                                                <div className="font-semibold font-roboto mr-2">Correo: </div>
                                                <span>{selectedPatient?.email}</span>
                                            </div>

                                            <div className="flex flex-row items-center justify-start lg:col-span-2">
                                                <div className="font-semibold font-roboto mr-2">Dirección: </div>
                                                <span>{selectedPatient?.address}</span>
                                            </div>
                                            <div className="flex flex-row items-center justify-start lg:col-span-2">
                                                <div className="font-semibold font-roboto mr-2">Creencia religiosa: </div>
                                                <span>{selectedPatient?.religious_belief}</span>
                                            </div>
                                        </div>


                                    </AccordionPanel>
                                </AccordionItem>
                                <AccordionItem value='1' className=''>
                                    <AccordionHeader>
                                        <div className='font-roboto font-semibold text-lg'>
                                            1. Motivo de consulta
                                        </div>
                                    </AccordionHeader>
                                    <AccordionPanel className='px-10 font-openSans'>
                                        <div>
                                            {selectedPatient?.motive}
                                        </div>
                                    </AccordionPanel>
                                </AccordionItem>
                                <AccordionItem value='2'>
                                    <AccordionHeader>
                                        <div className='font-roboto font-semibold text-lg'>
                                            2. Enfermedad actual
                                        </div>
                                    </AccordionHeader>
                                    <AccordionPanel className='px-10 font-openSans'>
                                        {selectedPatient?.current_illness}
                                    </AccordionPanel>
                                </AccordionItem>
                                <AccordionItem value='3'>
                                    <AccordionHeader>
                                        <div className='font-roboto font-semibold text-lg'>
                                            3. Antecedentes personales
                                        </div>
                                    </AccordionHeader>
                                    <AccordionPanel className='px-10  font-openSans'>
                                        <div className='flex flex-col'>
                                            <div className='flex flex-row py-2 items-center border-b-2'>
                                                <div className='font-semibold font-roboto'>Patologicos: </div>
                                                <div className='ml-2'> {selectedPatient?.personal_background?.pathological}</div>
                                            </div>
                                            <div className='flex flex-row py-2 items-center border-b-2'>
                                                <div className='font-semibold font-roboto'>Farmacologicos: </div>
                                                <div className='ml-2'> {selectedPatient?.personal_background?.pharmacological}</div>
                                            </div>

                                            <div className='flex flex-row py-2 items-center border-b-2'>
                                                <div className='font-semibold font-roboto'>Hospitalarios: </div>
                                                <div className='ml-2'> {selectedPatient?.personal_background?.hospitalary}</div>
                                            </div>

                                            <div className='flex flex-row py-2 items-center border-b-2'>
                                                <div className='font-semibold font-roboto'>Quirurgico: </div>
                                                <div className='ml-2'> {selectedPatient?.personal_background?.surgical}</div>
                                            </div>

                                            <div className='flex flex-row py-2 items-center border-b-2'>
                                                <div className='font-semibold font-roboto'>Traumatico:</div>
                                                <div className='ml-2'> {selectedPatient?.personal_background?.trauma}</div>
                                            </div>

                                            <div className='flex flex-row py-2 items-center border-b-2'>
                                                <div className='font-semibold font-roboto'>Alergico:</div>
                                                <div className='ml-2'> {selectedPatient?.personal_background?.allergic}</div>
                                            </div>

                                            <div className='flex flex-row my-2 py-2 items-center border-b-2'>
                                                <div className='font-semibold font-roboto'>Toxico:</div>
                                                <div className='ml-2'> {selectedPatient?.personal_background?.toxic}</div>
                                            </div>

                                        </div>
                                        {selectedPatient?.personal_background?.isGinecoObstetric ? (
                                            <div>

                                                <div className='font-semibold font-roboto my-2 flex justify-center'>
                                                    Gineco-obstetrico:
                                                </div>
                                                <div className='grid lg:grid-cols-5 grid-cols-1 gap-2 mb-5'>
                                                    <div className='font-semibold font-roboto'>
                                                        FO:
                                                    </div>
                                                    <div className='grid grid-cols-2 lg:border-l-2 border-b-2 lg:border-b-0'>
                                                        <div className='font-semibold font-roboto pl-2'>G:</div>
                                                        <div >{selectedPatient?.personal_background?.gestations}</div>
                                                    </div>
                                                    <div className='grid grid-cols-2 lg:border-l-2 border-b-2 lg:border-b-0'>
                                                        <div className='font-semibold font-roboto pl-2'>P:</div>
                                                        <div>{selectedPatient?.personal_background?.births}</div>
                                                    </div>
                                                    <div className='grid grid-cols-2 lg:border-l-2 border-b-2 lg:border-b-0'>
                                                        <div className='font-semibold font-roboto pl-2'>C:</div>
                                                        <div>{selectedPatient?.personal_background?.caesarean}</div>
                                                    </div>
                                                    <div className='grid grid-cols-2 lg:border-l-2 border-b-2 lg:border-b-0'>
                                                        <div className='font-semibold font-roboto pl-2'>A:</div>
                                                        <div>{selectedPatient?.personal_background?.abortions}</div>
                                                    </div>
                                                </div>
                                                <div className='grid grid-cols-2 border-b-2 py-2'>
                                                    <div className='font-semibold font-roboto'>Menarquia:</div>
                                                    <div>{selectedPatient?.personal_background?.menarche}</div>
                                                </div>
                                                <div className='grid grid-cols-2 border-b-2 py-2'>
                                                    <div className='font-semibold font-roboto'>Ciclos:</div>
                                                    <div>{selectedPatient?.personal_background?.cycles}</div>
                                                </div>
                                                <div className='grid grid-cols-2 border-b-2 py-2'>
                                                    <div className='font-semibold font-roboto'>FUM:</div>
                                                    <div>{selectedPatient?.personal_background?.last_menstruation}</div>
                                                </div>
                                                <div className='grid grid-cols-2 border-b-2 py-2'>
                                                    <div className='font-semibold font-roboto'>Planificacion:</div>
                                                    <div className='pl-2'>{selectedPatient?.personal_background?.planification}</div>
                                                </div>
                                                <div className='grid grid-cols-2 border-b-2'>
                                                    <div className='font-semibold font-roboto py-2'>FUPAP:</div>
                                                    <div>{selectedPatient?.personal_background?.pap_smear}</div>
                                                </div>
                                                <div className='grid grid-cols-3'>
                                                    <div className='font-semibold font-roboto py-2'>Observaciones:</div>
                                                    <div className='col-span-2'>{selectedPatient?.personal_background?.observations}</div>
                                                </div>

                                            </div>
                                        ) : (
                                            <div className='flex flex-row my-2 py-2 items-center border-b-2'>
                                                <div className='font-semibold font-roboto'>Ginecobstetrico:</div>
                                                <div className='ml-2'> N/A</div>
                                            </div>
                                        )}


                                    </AccordionPanel>
                                </AccordionItem>
                                <AccordionItem value='4'>
                                    <AccordionHeader>
                                        <div className='font-roboto font-semibold text-lg'>
                                            4. Antecedentes familiares
                                        </div>
                                    </AccordionHeader>
                                    <AccordionPanel className='px-10 font-openSans'>
                                        <div>
                                            {selectedPatient?.family_background}
                                        </div>
                                    </AccordionPanel>
                                </AccordionItem>
                                <AccordionItem value='5'>
                                    <AccordionHeader>
                                        <div className='font-roboto font-semibold text-lg'>
                                            5. Revision por sistemas
                                        </div>
                                    </AccordionHeader>
                                    <AccordionPanel className='px-10 font-openSans'>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Piel y fanera:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.system_review.skin}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Genitourinario:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.system_review?.genitourinary}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Colágeno:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.system_review.collagen}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Musculoesquelético:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.system_review.musculoskeletal}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Linfático:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.system_review.lymphatic}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Alimentación:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.system_review.feeding}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Auditivo:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.system_review.auditory}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Sueño:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.system_review.sleep}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Visual:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.system_review.visual}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Actividad Física:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.system_review.physical_activity}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Respiratorio:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.system_review.respiratory}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Psicosocial:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.system_review.psychosocial}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Digestivo:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.system_review.digestive}
                                                </div>
                                            </div>
                                        </div>

                                    </AccordionPanel>
                                </AccordionItem>
                                <AccordionItem value='6'>
                                    <AccordionHeader>
                                        <div className='font-roboto font-semibold text-lg'>
                                            6. Familiograma
                                        </div>
                                    </AccordionHeader>
                                    <AccordionPanel className='px-10 font-openSans'>
                                        <div>
                                            {selectedPatient?.familiogram}
                                        </div>
                                    </AccordionPanel>
                                </AccordionItem>
                                <AccordionItem value='7'>
                                    <AccordionHeader>
                                        <div className='font-roboto font-semibold text-lg'>
                                            7. Examen fisico
                                        </div>
                                    </AccordionHeader>
                                    <AccordionPanel className='px-10 font-openSans'>
                                        <div className='grid lg:grid-cols-3 grid-cols-1'>
                                            <div className='grid grid-cols-2 border-2'>
                                                <div className='font-semibold font-roboto'>F.C</div>
                                                <div>{selectedPatient?.physical_exam.heart_rate}</div>
                                            </div>
                                            <div className='grid grid-cols-2 border-2 lg:border-l-0 border-t-0 lg:border-t-2'>
                                                <div className='font-semibold font-roboto'>F.R</div>
                                                <div>{selectedPatient?.physical_exam.respiratory_rate}</div>
                                            </div>
                                            <div className='grid grid-cols-2 border-2 lg:border-l-0 border-t-0 border-l-2 lg:border-t-2'>
                                                <div className='font-semibold font-roboto'>T.A</div>
                                                <div>{selectedPatient?.physical_exam.blood_pressure}</div>
                                            </div>
                                            <div className='grid grid-cols-2 border-2 border-t-0'>
                                                <div className='font-semibold font-roboto'>SAT</div>
                                                <div>{selectedPatient?.physical_exam.saturation}</div>
                                            </div>
                                            <div className='grid grid-cols-2 border-2  lg:border-l-0 border-t-0 border-l-2'>
                                                <div className='font-semibold font-roboto'>T</div>
                                                <div>{selectedPatient?.physical_exam.heart_rate}</div>
                                            </div>
                                            <div className='grid grid-cols-2 border-2  lg:border-l-0 border-t-0 border-l-2'>
                                                <div className='font-semibold font-roboto'>Peso</div>
                                                <div>{selectedPatient?.physical_exam.weight}</div>
                                            </div>
                                            <div className='grid grid-cols-2 border-2 border-t-0'>
                                                <div className='font-semibold font-roboto'>Talla</div>
                                                <div>{selectedPatient?.physical_exam.size}</div>
                                            </div>
                                            <div className='grid grid-cols-2 border-2  lg:border-l-0 border-t-0 border-l-2'>
                                                <div className='font-semibold font-roboto'>IMC</div>
                                                <div>{selectedPatient?.physical_exam.imc}</div>
                                            </div>
                                        </div>
                                        <div className='flex flex-row mt-2 border-2'>
                                            <div className='font-semibold font-roboto'>Examen fisico</div>
                                            <div className='pl-3'>{selectedPatient?.physical_exam.physical_exam}</div>
                                        </div>
                                    </AccordionPanel>
                                </AccordionItem>
                                <AccordionItem value='8'>
                                    <AccordionHeader>
                                        <div className='font-roboto font-semibold text-lg'>
                                            8. Diagnostico
                                        </div>
                                    </AccordionHeader>
                                    <AccordionPanel className='px-10 py-4 font-openSans'>
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
                                    </AccordionPanel>
                                </AccordionItem>
                                <AccordionItem value='9'>
                                    <AccordionHeader>
                                        <div className='font-roboto font-semibold text-lg'>
                                            9. Tratamiento
                                        </div>
                                    </AccordionHeader>
                                    <AccordionPanel className='px-10 py-4 font-openSans'>
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
                                    </AccordionPanel>
                                </AccordionItem>
                                <AccordionItem value='10'>
                                    <AccordionHeader>
                                        <div className='font-semibold text-lg font-roboto'>
                                            10. Evolucion
                                        </div>
                                    </AccordionHeader>
                                    <AccordionPanel>
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
                                                                                    Fecha de anotacion: {annotation.created_at}
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
                                                                {evolution.evolution_id !== undefined && (<Button icon={<AddCircle24Regular />} onClick={() => showDialog(evolution.evolution_id ?? 0)}>Agregar observacion</Button>)}
                                                            </AccordionPanel>
                                                        </AccordionItem>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500 italic">No hay evolucion</p>
                                                )}
                                            </Accordion>


                                        </div>
                                    </AccordionPanel>
                                </AccordionItem>
                                <AccordionItem value='11'>
                                    <AccordionHeader>
                                        <div className='font-semibold text-lg font-roboto'>
                                            11. Paraclinicos
                                        </div>
                                    </AccordionHeader>
                                    <AccordionPanel>
                                        <div>
                                            Elementos paraclinicos
                                        </div>
                                    </AccordionPanel>
                                </AccordionItem>

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
            </DialogSurface>
        </Dialog>
    )
}
