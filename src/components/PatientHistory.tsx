import { DocumentPdfRegular } from '@fluentui/react-icons';
import { Menu, MenuTrigger, Button, MenuPopover, MenuList, MenuItem, Divider, Accordion, AccordionItem, AccordionHeader, AccordionPanel } from '@fluentui/react-components';
import { PatientSummary } from '../types/types.ts'
import { useState } from 'react';

interface Props {
    selectedPatient: PatientSummary | null;
    viewDetails: boolean;
    setViewDetails: (viewDetails: boolean) => void;
}



export default function PatientHistory({ selectedPatient, viewDetails, setViewDetails }: Props) {
    const viewMore = () => {
        setViewDetails(true)
    }
    const viewLess = () => {
        setViewDetails(false)
    }
    const [selectedEdit, setSelectedEdit] = useState(false)
    const [selectedExport, setSelectedExport] = useState(false)

    const handleEditPressed = (isOpen: boolean) => {
        setSelectedEdit(isOpen)
    }
    const handleEditExport = (isOpen: boolean) => {
        setSelectedExport(isOpen)
    }

    return (
        <div className="border-black border-2 rounded-xl h-full">
            <div className="flex flex-row items-center w-full border-b-2 border-black h-12">
                {!viewDetails ? (
                    <button onClick={() => viewMore()} className='w-2/12 px-2 py-1 border-black flex justify-center items-center h-full hover:bg-customHover rounded-tl-xl font-roboto'>Ver mas</button>
                ) : (
                    <button className='w-2/12 px-2 py-1 border-black flex justify-center items-center h-full hover:bg-customHover rounded-tl-2 font-roboto' onClick={() => viewLess()}>
                        Volver
                    </button>
                )}

                <div className="w-6/12 px-2 py-1 border-x-2 border-black flex justify-center items-center h-full font-roboto font-bold text-xl">
                    {selectedPatient !== null && selectedPatient.personalData.name}
                </div>
                <div className={`w-2/12 px-2 py-1 border-r-2 border-black flex justify-center items-center h-full font-roboto font-bold text-xl ${selectedEdit ? "bg-blue-600 text-white" : "hover:bg-customHover"}`}>
                    <Menu onOpenChange={((_e, data) => handleEditPressed(data.open))}>
                        <MenuTrigger disableButtonEnhancement>
                            <Button className="w-2/12 flex justify-center">
                                Editar
                            </Button>
                        </MenuTrigger>
                        <MenuPopover>
                            <MenuList className="bg-customBg border-2 border-black p-2 font-openSans font-semibold ">
                                <MenuItem>
                                    <div className="hover:bg-blue-600 hover:text-white  font-openSans">
                                        Historia
                                    </div>
                                </MenuItem>
                                <Divider />
                                <MenuItem className='hover:bg-red-500'>
                                    <div className="hover:bg-blue-600 hover:text-white  font-openSans">
                                        Evolucion
                                    </div>

                                </MenuItem>
                            </MenuList>
                        </MenuPopover>
                    </Menu>
                </div>
                <div className={`w-2/12 px-2 py-1 rounded-tr-xl border-black flex justify-center items-center h-full font-roboto font-bold text-xl ${selectedExport ? "bg-blue-600 text-white" : "hover:bg-customHover"}`}>
                    <Menu onOpenChange={(_e, data) => handleEditExport(data.open)}>
                        <MenuTrigger disableButtonEnhancement>
                            <Button className={`w-2/12 flex justify-center`}>
                                <DocumentPdfRegular />
                            </Button>
                        </MenuTrigger>
                        <MenuPopover>
                            <MenuList className="bg-customBg border-2 border-black p-2 font-openSans font-semibold">
                                <MenuItem className='hover:bg-red-500'>
                                    <div className="hover:bg-blue-600 hover:text-white font-openSans">
                                        Resumen
                                    </div>

                                </MenuItem>
                                <Divider />
                                <MenuItem className='hover:bg-red-500'>
                                    <div className="hover:bg-blue-600 hover:text-white font-openSans">
                                        Completo
                                    </div>

                                </MenuItem>
                            </MenuList>
                        </MenuPopover>
                    </Menu>
                </div>

            </div>

            <div className="max-h-[80vh] overflow-y-auto">
                <Accordion className="h-full" multiple>
                    <AccordionItem value='0'>
                        <AccordionHeader>
                            <div className='font-roboto font-semibold text-lg'>
                                0. Datos de paciente
                            </div>
                        </AccordionHeader>
                        <AccordionPanel className='px-10'>
                            <div className='grid grid-cols-3'>
                                <div className='grid grid-cols-2  font-openSans'>
                                    <div className='font-semibold font-roboto'>Fecha:</div>
                                    {selectedPatient?.personalData.firstSession}
                                </div>
                                <div className='col-span-2 grid grid-cols-4  font-openSans'>
                                    <div className='font-semibold font-roboto'>Doctor:</div>
                                    <div className='col-span-3'>{selectedPatient?.doctor}</div>
                                </div>

                            </div>
                            <div className='grid grid-cols-3 mt-1'>
                                <div className='grid grid-cols-2  font-openSans'>
                                    <span className='font-semibold font-roboto'>Nombre:</span>
                                    <div>{selectedPatient?.personalData.name}</div>
                                </div>
                                <div className='grid grid-cols-2  font-openSans'>
                                    <span className='font-semibold font-roboto'>Edad:</span>
                                    <div>{selectedPatient?.personalData.age}</div>
                                </div>
                                <div className='grid grid-cols-2  font-openSans'>
                                    <span className='font-semibold font-roboto'>Fecha de nacimiento:</span>
                                    <div>
                                        {selectedPatient?.personalData.dateOfBirth}
                                    </div>
                                </div>
                            </div>
                            <div className='grid grid-cols-3 mt-1'>
                                <div className='grid grid-cols-2  font-openSans'>
                                    <span className='font-semibold font-roboto'>Ocupacion:</span>
                                    <div>{selectedPatient?.personalData.occupation}</div>
                                </div>
                                <div className='grid grid-cols-2  font-openSans'>
                                    <span className='font-semibold font-roboto'>Estado civil:</span>
                                    {selectedPatient?.personalData.maritalStatus}
                                </div>
                                <div className='grid grid-cols-2  font-openSans'>
                                    <span className='font-semibold font-roboto'>Identificacion:</span>
                                    <div>{selectedPatient?.personalData.identification}</div>
                                </div>
                            </div>
                            <div className='grid grid-cols-2 mt-1 font-openSans'>
                                <div>
                                    <span className='font-semibold font-roboto'>
                                        Direccion:
                                    </span>
                                    {selectedPatient?.personalData.address}
                                </div>
                                <div>
                                    <span className='font-semibold font-roboto'>
                                        Telefono:
                                    </span>
                                    {selectedPatient?.personalData.phone}
                                </div>
                            </div>
                            <div className='grid grid-cols-2 mt-1 font-openSans'>
                                <div>
                                    <span className='font-semibold font-roboto'>
                                        Correo:
                                    </span>
                                    {selectedPatient?.personalData.mail}
                                </div>
                                <div>
                                    <span className='font-semibold font-roboto'>
                                        Creencia religiosa:
                                    </span>
                                    {selectedPatient?.personalData.religiousBelief}
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
                            <div className='grid grid-cols-5 mt-1'>
                                <div className='font-semibold font-roboto'>Patologicos:</div>
                                <div className='col-span-4'> {selectedPatient?.personalBackground.pathological}</div>

                                <div className='font-semibold font-roboto'>Farmacologicos:</div>
                                <div className='col-span-4'> {selectedPatient?.personalBackground.farmacological}</div>

                                <div className='font-semibold font-roboto'>Hospitalarios:</div>
                                <div className='col-span-4'> {selectedPatient?.personalBackground.hospitalary}</div>

                                <div className='font-semibold font-roboto'>Quirurgico:</div>
                                <div className='col-span-4'> {selectedPatient?.personalBackground.quirurgical}</div>

                                <div className='font-semibold font-roboto'>Traumatico:</div>
                                <div className='col-span-4'> {selectedPatient?.personalBackground.trauma}</div>

                                <div className='font-semibold font-roboto'>Alergico:</div>
                                <div className='col-span-4'> {selectedPatient?.personalBackground.alergic}</div>

                                <div className='font-semibold font-roboto'>Toxico:</div>
                                <div className='col-span-4'> {selectedPatient?.personalBackground.toxic}</div>
                            </div>
                            <div className='grid grid-cols-5'>
                                <div className='font-semibold font-roboto'>
                                    Gineco-obstetrico
                                </div>
                                <div className='col-span-2 grid grid-cols-5'>
                                    <div className='font-semibold font-roboto'>
                                        FO:
                                    </div>
                                    <div className='grid grid-cols-2'>
                                        <div className='font-semibold font-roboto'>G:</div>
                                        <div>{selectedPatient?.personalBackground.ginecoObstetric?.OS.gestations}</div>
                                    </div>
                                    <div className='grid grid-cols-2'>
                                        <div className='font-semibold font-roboto'>P:</div>
                                        <div>{selectedPatient?.personalBackground.ginecoObstetric?.OS.births}</div>
                                    </div>
                                    <div className='grid grid-cols-2'>
                                        <div className='font-semibold font-roboto'>C:</div>
                                        <div>{selectedPatient?.personalBackground.ginecoObstetric?.OS.Caesarean}</div>
                                    </div>
                                    <div className='grid grid-cols-2'>
                                        <div className='font-semibold font-roboto'>A:</div>
                                        <div>{selectedPatient?.personalBackground.ginecoObstetric?.OS.abortions}</div>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <div className='font-semibold font-roboto'>Menarquia:</div>
                                    <div>{selectedPatient?.personalBackground.ginecoObstetric?.menarche}</div>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <div className='font-semibold font-roboto'>Ciclos:</div>
                                    <div>{selectedPatient?.personalBackground.ginecoObstetric?.cycles}</div>
                                </div>
                                <div></div>
                                <div className='col-span-2 grid grid-cols-5'>
                                    <div className='font-semibold font-roboto'>
                                        FUM:
                                    </div>
                                    <div className='col-span-4'>
                                        {selectedPatient?.personalBackground.ginecoObstetric?.lastMenstruation}
                                    </div>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <div className='font-semibold font-roboto'>Planificacion:</div>
                                    <div className='pl-2'>{selectedPatient?.personalBackground.ginecoObstetric?.planification}</div>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <div className='font-semibold font-roboto'>FUPAP:</div>
                                    <div>{selectedPatient?.personalBackground.ginecoObstetric?.papSmear}</div>
                                </div>
                                <div></div>
                                <div className='font-semibold font-roboto'>Observaciones:</div>
                                <div className='col-span-3'>{selectedPatient?.personalBackground.ginecoObstetric?.observations}</div>

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
                            <div className='grid grid-cols-2'>
                                <div className='grid grid-cols-3'>
                                    <div className='font-semibold font-roboto'>
                                        Piel y fanera:
                                    </div>
                                    <div className='col-span-2'>
                                        {selectedPatient?.systemReview.skin}
                                    </div>
                                </div>
                                <div className='grid grid-cols-3'>
                                    <div className='font-semibold font-roboto'>
                                        Genitourinario:
                                    </div>
                                    <div className='col-span-2'>
                                        {selectedPatient?.systemReview.genitourinary}
                                    </div>
                                </div>
                                <div className='grid grid-cols-3'>
                                    <div className='font-semibold font-roboto'>
                                        Colageno:
                                    </div>
                                    <div className='col-span-2'>
                                        {selectedPatient?.systemReview.collagen}
                                    </div>
                                </div>
                                <div className='grid grid-cols-3'>
                                    <div className='font-semibold font-roboto'>
                                        Musculoesqueletico
                                    </div>
                                    <div className='col-span-2'>
                                        {selectedPatient?.systemReview.musculoskeletal}
                                    </div>
                                </div>
                                <div className='grid grid-cols-3'>
                                    <div className='font-semibold font-roboto'>
                                        Linfatico
                                    </div>
                                    <div className='col-span-2'>
                                        {selectedPatient?.systemReview.lymphatic}
                                    </div>
                                </div>
                                <div className='grid grid-cols-3'>
                                    <div className='font-semibold font-roboto'>
                                        Alimentacion
                                    </div>
                                    <div className='col-span-2'>
                                        {selectedPatient?.systemReview.feeding}
                                    </div>
                                </div>
                                <div className='grid grid-cols-3'>
                                    <div className='font-semibold font-roboto'>
                                        Auditivo
                                    </div>
                                    <div className='col-span-2'>
                                        {selectedPatient?.systemReview.auditive}
                                    </div>
                                </div>
                                <div className='grid grid-cols-3'>
                                    <div className='font-semibold font-roboto'>
                                        Sueño
                                    </div>
                                    <div className='col-span-2'>
                                        {selectedPatient?.systemReview.sleep}
                                    </div>
                                </div>
                                <div className='grid grid-cols-3'>
                                    <div className='font-semibold font-roboto'>
                                        Visual
                                    </div>
                                    <div className='col-span-2'>
                                        {selectedPatient?.systemReview.visual}
                                    </div>
                                </div>
                                <div className='grid grid-cols-3'>
                                    <div className='font-semibold font-roboto'>
                                        Actividad Fisica
                                    </div>
                                    <div className='col-span-2'>
                                        {selectedPatient?.systemReview.physicalActivity}
                                    </div>
                                </div>
                                <div className='grid grid-cols-3'>
                                    <div className='font-semibold font-roboto'>
                                        Respiratorio
                                    </div>
                                    <div className='col-span-2'>
                                        {selectedPatient?.systemReview.respiratory}
                                    </div>
                                </div>
                                <div className='grid grid-cols-3'>
                                    <div className='font-semibold font-roboto'>
                                        Psicosocial
                                    </div>
                                    <div className='col-span-2'>
                                        {selectedPatient?.systemReview.psychosocial}
                                    </div>
                                </div>
                                <div className='grid grid-cols-3'>
                                    <div className='font-semibold font-roboto'>
                                        Digestivo
                                    </div>
                                    <div className='col-span-2'>
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
                            <div className='grid grid-cols-8 '>
                                <div className='grid grid-cols-2'>
                                    <div className='font-semibold font-roboto'>F.C</div>
                                    <div>{selectedPatient?.physicalExam.heartRate}</div>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <div className='font-semibold font-roboto'>F.R</div>
                                    <div>{selectedPatient?.physicalExam.respiratoryRate}</div>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <div className='font-semibold font-roboto'>T.A</div>
                                    <div>{selectedPatient?.physicalExam.bloodPressure}</div>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <div className='font-semibold font-roboto'>SAT</div>
                                    <div>{selectedPatient?.physicalExam.saturation}</div>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <div className='font-semibold font-roboto'>T</div>
                                    <div>{selectedPatient?.physicalExam.heartRate}</div>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <div className='font-semibold font-roboto'>Peso</div>
                                    <div>{selectedPatient?.physicalExam.weight}</div>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <div className='font-semibold font-roboto'>Talla</div>
                                    <div>{selectedPatient?.physicalExam.size}</div>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <div className='font-semibold font-roboto'>IMC</div>
                                    <div>{selectedPatient?.physicalExam.IMC}</div>
                                </div>
                            </div>
                            <div className='flex flex-row'>
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
                                        <li key={index} className="text-gray-800">
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
                                        <li key={index} className="text-gray-800">
                                            {diag.description}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 italic">No se ingreso un tratamiento</p>
                            )}
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem value='50'>
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
                                                <div className='grid grid-cols-3'>
                                                    <div>
                                                        <h4 className='font-semibold font-roboto'>Motivo:</h4>
                                                        <p>{evolution.motive}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className='font-semibold font-roboto'>Enfermedad Actual:</h4>
                                                        <p>{evolution.currentIllness}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className='font-semibold font-roboto'>Examen Físico:</h4>
                                                        <p>{evolution.physicalExam}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className='font-semibold font-roboto'>Diagnóstico:</h4>
                                                        <p>{evolution.diagnosis}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className='font-semibold font-roboto'>Plan:</h4>
                                                        <p>{evolution.plan}</p>
                                                    </div>

                                                    {evolution.annotation && (
                                                        <div >
                                                            <h4 className='font-semibold font-roboto'>Anotación:</h4>
                                                            <p>{evolution.annotation}</p>
                                                        </div>
                                                    )}
                                                    <div>
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
                    <AccordionItem value='10'>
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
                    <AccordionItem value='11'>
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
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    )
}
