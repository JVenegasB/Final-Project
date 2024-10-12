// import { DocumentPdfRegular } from '@fluentui/react-icons';
import { Accordion, AccordionItem, AccordionHeader, AccordionPanel, Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle } from '@fluentui/react-components';
import { PatientSummary } from '../types/types.ts'
// import { useState } from 'react';

interface Props {
    selectedPatient: PatientSummary | null;
    open: boolean;
    setOpen: (open: boolean) => void;
}



export default function PatientHistory({ selectedPatient, open, setOpen }: Props) {
    return (
        <Dialog open={open} >
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>
                        <div className='flex flex-col font-roboto'>
                            <div>
                                <span>Paciente: </span>
                                <span className='font-lato'>{selectedPatient?.personalData.name}</span>
                            </div>
                            <div className='text-sm'>
                                <span>Cedula: </span>
                                <span className='font-lato'>{selectedPatient?.personalData.identification}</span>
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
                                                <span>{selectedPatient?.personalData.firstSession}</span>
                                            </div>
                                            <div className="flex flex-row items-center justify-start">
                                                <div className="font-semibold font-roboto mr-2">Doctor: </div>
                                                <span>{selectedPatient?.doctor}</span>
                                            </div>

                                            <div className="flex flex-row items-center justify-start">
                                                <div className="font-semibold font-roboto mr-2">Nombre: </div>
                                                <span>{selectedPatient?.personalData.name}</span>
                                            </div>
                                            <div className="flex flex-row items-center justify-start">
                                                <div className="font-semibold font-roboto mr-2">Edad: </div>
                                                <span>{selectedPatient?.personalData.age}</span>
                                            </div>

                                            <div className="flex flex-row items-center justify-start">
                                                <div className="font-semibold font-roboto mr-2">Fecha de nacimiento: </div>
                                                <span>{selectedPatient?.personalData.dateOfBirth}</span>
                                            </div>
                                            <div className="flex flex-row items-center justify-start">
                                                <div className="font-semibold font-roboto mr-2">Ocupación: </div>
                                                <span>{selectedPatient?.personalData.occupation}</span>
                                            </div>

                                            <div className="flex flex-row items-center justify-start">
                                                <div className="font-semibold font-roboto mr-2">Estado civil: </div>
                                                <span>{selectedPatient?.personalData.maritalStatus}</span>
                                            </div>
                                            <div className="flex flex-row items-center justify-start">
                                                <div className="font-semibold font-roboto mr-2">Identificación: </div>
                                                <span>{selectedPatient?.personalData.identification}</span>
                                            </div>

                                            <div className="flex flex-row items-center justify-start">
                                                <div className="font-semibold font-roboto mr-2">Teléfono: </div>
                                                <span>{selectedPatient?.personalData.phone}</span>
                                            </div>
                                            <div className="flex flex-row items-center justify-start">
                                                <div className="font-semibold font-roboto mr-2">Correo: </div>
                                                <span>{selectedPatient?.personalData.mail}</span>
                                            </div>

                                            <div className="flex flex-row items-center justify-start lg:col-span-2">
                                                <div className="font-semibold font-roboto mr-2">Dirección: </div>
                                                <span>{selectedPatient?.personalData.address}</span>
                                            </div>
                                            <div className="flex flex-row items-center justify-start lg:col-span-2">
                                                <div className="font-semibold font-roboto mr-2">Creencia religiosa: </div>
                                                <span>{selectedPatient?.personalData.religiousBelief}</span>
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
                                        {selectedPatient?.currentIllness}
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
                                                <div className='font-semibold font-roboto'>Patologicos:</div>
                                                <div className='ml-2'> {selectedPatient?.personalBackground.pathological}</div>
                                            </div>
                                            <div className='flex flex-row py-2 items-center border-b-2'>
                                                <div className='font-semibold font-roboto'>Farmacologicos:</div>
                                                <div className=''> {selectedPatient?.personalBackground.farmacological}</div>
                                            </div>

                                            <div className='flex flex-row py-2 items-center border-b-2'>
                                                <div className='font-semibold font-roboto'>Hospitalarios:</div>
                                                <div className=''> {selectedPatient?.personalBackground.hospitalary}</div>
                                            </div>

                                            <div className='flex flex-row py-2 items-center border-b-2'>
                                                <div className='font-semibold font-roboto'>Quirurgico:</div>
                                                <div className=''> {selectedPatient?.personalBackground.quirurgical}</div>
                                            </div>

                                            <div className='flex flex-row py-2 items-center border-b-2'>
                                                <div className='font-semibold font-roboto'>Traumatico:</div>
                                                <div className=''> {selectedPatient?.personalBackground.trauma}</div>
                                            </div>

                                            <div className='flex flex-row py-2 items-center border-b-2'>
                                                <div className='font-semibold font-roboto'>Alergico:</div>
                                                <div className=''> {selectedPatient?.personalBackground.alergic}</div>
                                            </div>

                                            <div className='flex flex-row my-2 py-2 items-center border-b-2'>
                                                <div className='font-semibold font-roboto'>Toxico:</div>
                                                <div className=''> {selectedPatient?.personalBackground.toxic}</div>
                                            </div>

                                        </div>
                                        <div className='font-semibold font-roboto my-2 flex justify-center'>
                                            Gineco-obstetrico:
                                        </div>


                                        <div className='grid lg:grid-cols-5 grid-cols-1 gap-2 mb-5'>
                                            <div className='font-semibold font-roboto'>
                                                FO:
                                            </div>
                                            <div className='grid grid-cols-2 lg:border-l-2 border-b-2 lg:border-b-0'>
                                                <div className='font-semibold font-roboto pl-2'>G:</div>
                                                <div >{selectedPatient?.personalBackground.ginecoObstetric?.OS.gestations}</div>
                                            </div>
                                            <div className='grid grid-cols-2 lg:border-l-2 border-b-2 lg:border-b-0'>
                                                <div className='font-semibold font-roboto pl-2'>P:</div>
                                                <div>{selectedPatient?.personalBackground.ginecoObstetric?.OS.births}</div>
                                            </div>
                                            <div className='grid grid-cols-2 lg:border-l-2 border-b-2 lg:border-b-0'>
                                                <div className='font-semibold font-roboto pl-2'>C:</div>
                                                <div>{selectedPatient?.personalBackground.ginecoObstetric?.OS.Caesarean}</div>
                                            </div>
                                            <div className='grid grid-cols-2 lg:border-l-2 border-b-2 lg:border-b-0'>
                                                <div className='font-semibold font-roboto pl-2'>A:</div>
                                                <div>{selectedPatient?.personalBackground.ginecoObstetric?.OS.abortions}</div>
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-2 border-b-2 py-2'>
                                            <div className='font-semibold font-roboto'>Menarquia:</div>
                                            <div>{selectedPatient?.personalBackground.ginecoObstetric?.menarche}</div>
                                        </div>
                                        <div className='grid grid-cols-2 border-b-2 py-2'>
                                            <div className='font-semibold font-roboto'>Ciclos:</div>
                                            <div>{selectedPatient?.personalBackground.ginecoObstetric?.cycles}</div>
                                        </div>
                                        <div className='grid grid-cols-2 border-b-2 py-2'>
                                            <div className='font-semibold font-roboto'>FUM:</div>
                                            <div>{selectedPatient?.personalBackground.ginecoObstetric?.lastMenstruation}</div>
                                        </div>
                                        <div className='grid grid-cols-2 border-b-2 py-2'>
                                            <div className='font-semibold font-roboto'>Planificacion:</div>
                                            <div className='pl-2'>{selectedPatient?.personalBackground.ginecoObstetric?.planification}</div>
                                        </div>
                                        <div className='grid grid-cols-2 border-b-2'>
                                            <div className='font-semibold font-roboto py-2'>FUPAP:</div>
                                            <div>{selectedPatient?.personalBackground.ginecoObstetric?.papSmear}</div>
                                        </div>
                                        <div className='grid grid-cols-3'>
                                            <div className='font-semibold font-roboto py-2'>Observaciones:</div>
                                            <div className='col-span-2'>{selectedPatient?.personalBackground.ginecoObstetric?.observations}</div>
                                        </div>

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
                                            {selectedPatient?.familyBackground}
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
                                                    {selectedPatient?.systemReview.skin}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Genitourinario:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.systemReview.genitourinary}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Colágeno:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.systemReview.collagen}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Musculoesquelético:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.systemReview.musculoskeletal}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Linfático:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.systemReview.lymphatic}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Alimentación:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.systemReview.feeding}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Auditivo:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.systemReview.auditive}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Sueño:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.systemReview.sleep}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Visual:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.systemReview.visual}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Actividad Física:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.systemReview.physicalActivity}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Respiratorio:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.systemReview.respiratory}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Psicosocial:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.systemReview.psychosocial}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center h-full">
                                                <div className="font-semibold font-roboto">
                                                    Digestivo:
                                                </div>
                                                <div className="col-span-2">
                                                    {selectedPatient?.systemReview.digestive}
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
                                            {selectedPatient?.familyogram}
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
                                                <div>{selectedPatient?.physicalExam.heartRate}</div>
                                            </div>
                                            <div className='grid grid-cols-2 border-2 lg:border-l-0 border-t-0 lg:border-t-2'>
                                                <div className='font-semibold font-roboto'>F.R</div>
                                                <div>{selectedPatient?.physicalExam.respiratoryRate}</div>
                                            </div>
                                            <div className='grid grid-cols-2 border-2 lg:border-l-0 border-t-0 border-l-2 lg:border-t-2'>
                                                <div className='font-semibold font-roboto'>T.A</div>
                                                <div>{selectedPatient?.physicalExam.bloodPressure}</div>
                                            </div>
                                            <div className='grid grid-cols-2 border-2 border-t-0'>
                                                <div className='font-semibold font-roboto'>SAT</div>
                                                <div>{selectedPatient?.physicalExam.saturation}</div>
                                            </div>
                                            <div className='grid grid-cols-2 border-2  lg:border-l-0 border-t-0 border-l-2'>
                                                <div className='font-semibold font-roboto'>T</div>
                                                <div>{selectedPatient?.physicalExam.heartRate}</div>
                                            </div>
                                            <div className='grid grid-cols-2 border-2  lg:border-l-0 border-t-0 border-l-2'>
                                                <div className='font-semibold font-roboto'>Peso</div>
                                                <div>{selectedPatient?.physicalExam.weight}</div>
                                            </div>
                                            <div className='grid grid-cols-2 border-2 border-t-0'>
                                                <div className='font-semibold font-roboto'>Talla</div>
                                                <div>{selectedPatient?.physicalExam.size}</div>
                                            </div>
                                            <div className='grid grid-cols-2 border-2  lg:border-l-0 border-t-0 border-l-2'>
                                                <div className='font-semibold font-roboto'>IMC</div>
                                                <div>{selectedPatient?.physicalExam.IMC}</div>
                                            </div>
                                        </div>
                                        <div className='flex flex-row mt-2 border-2'>
                                            <div className='font-semibold font-roboto'>Examen fisico</div>
                                            <div className='pl-3'>{selectedPatient?.physicalExam.physicalExam}</div>
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
                                        {selectedPatient?.diagnostic.length ? (
                                            <ul className="list-disc  space-y-2">
                                                {selectedPatient.diagnostic.map((diag, index) => (
                                                    <li key={index}>
                                                        {diag.description}
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
                                        {selectedPatient?.treatment.length ? (
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
                                                {selectedPatient?.evolution.map((evolution, index) => (
                                                    <AccordionItem key={index} value={index.toString()}>
                                                        <AccordionHeader>
                                                            <div className='font-semibold text-lg font-roboto'>
                                                                {evolution.attendedDate}
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
                                                                    <p>{evolution.currentIllness}</p>
                                                                </div>
                                                                <div className='py-3'>
                                                                    <h4 className='font-semibold font-roboto'>Examen Físico:</h4>
                                                                    <p>{evolution.physicalExam}</p>
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
                                                                    <p>{evolution.alternative.isAlternative ? evolution.alternative.therapy : 'No hay terapia alternativa.'}</p>
                                                                </div>
                                                            </div>
                                                        </AccordionPanel>
                                                    </AccordionItem>
                                                ))}
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
                                            Tabla de evolucion del paciente
                                        </div>
                                    </AccordionPanel>
                                </AccordionItem>
                                {/* <AccordionItem value='12'>
                                    <AccordionHeader>
                                        <div className='font-semibold text-lg font-roboto'>
                                            12. Anotaciones
                                        </div>
                                    </AccordionHeader>
                                    <AccordionPanel>
                                        <div className='px-10 py-4 font-openSans'>
                                            {selectedPatient?.annotations}
                                        </div>
                                    </AccordionPanel>
                                </AccordionItem> */}
                            </Accordion>
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
