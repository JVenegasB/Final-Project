import React, { useEffect, useState } from 'react';
import { Checkbox, Label, Divider, Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, InfoLabel } from "@fluentui/react-components";
import { PersonRegular, BriefcaseRegular, PersonChatRegular, SlideRecordRegular, ClockRegular, ClipboardCheckmarkRegular } from '@fluentui/react-icons';
import { useUserContext } from '../context/userContext';
import InputFieldWithIcon from './InputFieldWithIcon'
import TextFieldWithIcon from './TextFieldWithIcon'

export default function NewPatient() {
    const [loggedUser,] = useUserContext();
    const [formData, setFormData] = useState({
        personalData: {
            firstSession: '',
            lastSession: '',
            name: '',
            age: 0,
            dateOfBirth: '',
            occupation: '',
            maritalStatus: '',
            identification: '',
            address: '',
            phone: '',
            mail: '',
            religiousBelief: '',
        },
        finishLatter: false,
        motive: '',
        personalBackground: {
            pathological: '',
            farmacological: '',
            quirurgical: '',
            trauma: '',
            alergic: '',
            toxic: '',
            hospitalary: '',
            ginecoObstetric: null as {
                OS: {
                    gestations?: number;
                    births?: number;
                    Caesarean?: number;
                    abortions?: number;
                };
                lastMenstruation?: string;
                planification?: string;
                menarche?: string;
                cycles?: string;
                papSmear?: string;
                observations?: string;
            } | null,
        },
        familyBackground: '',
        currentIllness: '',
        systemReview: {
            skin: '',
            collagen: '',
            lymphatic: '',
            auditive: '',
            visual: '',
            respiratory: '',
            digestive: '',
            genitourinary: '',
            musculoskeletal: '',
            feeding: '',
            sleep: '',
            physicalActivity: '',
            psychosocial: '',
        },
        familyogram: '',
        physicalExam: {
            heartRate: 0,
            respiratoryRate: 0,
            bloodPressure: '',
            saturation: 0,
            temperature: 0,
            weight: 0,
            size: 0,
            IMC: 0,
            physicalExam: '',
        },
        diagnostic: [{ description: '' }],
        treatment: [{ description: '' }],
        doctor: '',
    });


    useEffect(() => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

        setFormData((prevData) => ({
            ...prevData,
            personalData: {
                ...prevData.personalData,
                firstSession: formattedDateTime,
                lastSession: formattedDateTime,
            }
        }));
    }, []);

    const [isChanged, setIsChanged] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [missingFields, setMissingFields] = useState<string[]>([]);
    useEffect(() => {
        const hasChanged = () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { firstSession, lastSession, ...personalData } = formData.personalData;
            const personalDataChanged = Object.entries(personalData).some(([x, value]) => {

                if (x === 'age') {
                    return value !== 0;
                }
                return value !== '';
            });

            const otherChanged = Object.entries(formData).some(([key, value]) => {
                if (key === 'personalData' || key === 'finishLatter' || key === 'doctor') return false;
                if (Array.isArray(value)) {
                    return value.some(item => item.description !== '');
                }
                if (typeof value === 'string') {
                    return value !== '';
                }
                if (typeof value === 'number') {
                    return value !== 0;
                }
                return false;
            });

            return personalDataChanged || otherChanged;
        };
        const isComplete = () => {
            const updatedMissingFields: string[] = [];

            const personalDataComplete = Object.entries(formData.personalData).every(([key, value]) => {
                if (key === 'firstSession' || key === 'lastSession') return true;

                if (key === 'age') {
                    if (!(typeof value === 'number' && value > 0)) {
                        updatedMissingFields.push(key);
                    }
                    return typeof value === 'number' && value > 0;
                }

                if (value === '') {
                    updatedMissingFields.push(key);
                }

                return value !== '';
            });

            const otherComplete = Object.entries(formData).every(([key, value]) => {
                if (key === 'personalData' || key === 'finishLatter' || key === 'doctor') return true;

                if (Array.isArray(value)) {
                    const allFilled = value.every(item => item.description !== '');
                    if (!allFilled) {
                        updatedMissingFields.push(key);
                    }
                    return allFilled;
                }

                // Valida otros tipos de datos
                if (typeof value === 'string') {
                    if (value === '') {
                        updatedMissingFields.push(key);
                    }
                    return value !== '';
                }

                if (typeof value === 'number') {
                    if (value <= 0) {
                        updatedMissingFields.push(key);
                    }
                    return value > 0;
                }

                return true;
            });

            // Actualiza el estado de missingFields solo una vez al final
            setMissingFields(updatedMissingFields);

            return personalDataComplete && otherComplete;
        };

        setIsComplete(isComplete());
        setIsChanged(hasChanged());
    }, [formData]);

    const handlePersonalDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            personalData: {
                ...prevData.personalData,
                [name]: name === 'age' ? Number(value) : value,
            },
        }));
    };
    const handlePersonalBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            personalBackground: {
                ...prevData.personalBackground,
                [name]: value,
            }
        }));
    }
    const [isGinecoObstetric, setIsGinecoObstetric] = useState(false);
    useEffect(() => {
        if (!isGinecoObstetric) {
            setFormData((prevData) => ({
                ...prevData,
                personalBackground: {
                    ...prevData.personalBackground,
                    ginecoObstetric: null,
                }
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                personalBackground: {
                    ...prevData.personalBackground,
                    ginecoObstetric: {
                        OS: {
                            gestations: 0,
                            births: 0,
                            Caesarean: 0,
                            abortions: 0,
                        },
                        lastMenstruation: '',
                        planification: '',
                        menarche: '',
                        cycles: '',
                        papSmear: '',
                        observations: '',
                    }
                }
            }));
        }
    }, [isGinecoObstetric]);
    useEffect(() => {
        if (formData.physicalExam.size && formData.physicalExam.weight && formData.physicalExam.size > 0 && formData.physicalExam.weight > 0) {
            const IMC = formData.physicalExam.weight / (formData.physicalExam.size) ** 2;
            setFormData((prevData) => ({
                ...prevData,
                physicalExam: {
                    ...prevData.physicalExam,
                    IMC,
                }
            }));
        }
    }, [formData.physicalExam.size, formData.physicalExam.weight]);
    useEffect(() => {
        if (loggedUser) {
            setFormData((prevData) => ({
                ...prevData,
                doctor: loggedUser.nickName,
            }));
        }
    }, [loggedUser]);

    // PASAR EDAD A NUMERO AL ENVIAR A BASE DE DATOS


    const [inputValue, setInputValue] = useState<string>('');
    const [inputValue2, setInputValue2] = useState<string>('');
    const [list, setList] = useState<string[]>([""]);
    const [list2, setList2] = useState<string[]>([""]);

    const addDiagnostic = () => {
        if (inputValue.trim() !== '_') {
            setList([...list, inputValue]);
            setFormData((prevData) => ({
                ...prevData,
                diagnostic: [...prevData.diagnostic, { description: inputValue }]
            }));
            setInputValue('');
        }
    };
    const removeDiagnostic = () => {
        setList(list.slice(0, -1));
        setFormData((prevData) => ({
            ...prevData,
            diagnostic: prevData.diagnostic.slice(0, -1)
        }));
    }

    const addTreatment = () => {
        if (inputValue2.trim() !== '_') {
            setList2([...list2, inputValue2]);
            setFormData((prevData) => ({
                ...prevData,
                treatment: [...prevData.treatment, { description: inputValue2 }]
            }));
            setInputValue2('');
        }
    };
    const removeTreatment = () => {
        setList2(list2.slice(0, -1));
        setFormData((prevData) => ({
            ...prevData,
            treatment: prevData.treatment.slice(0, -1)
        }));
    }
    return (
        <div className='flex flex-col h-full w-full overflow-y-auto'>
            <div className='flex md:flex-row flex-col justify-between md:mx-5 mx-2'>
                <div>
                    <Dialog>
                        <DialogTrigger disableButtonEnhancement>
                            <Button disabled={!isChanged}  >Terminar mas tarde</Button>
                        </DialogTrigger>
                        <DialogSurface>
                            <DialogBody>
                                <DialogTitle>Confirmacion para continuar mas tarde </DialogTitle>
                                <DialogContent>
                                    ¿Estás seguro de que deseas guardar la historia y continuar más tarde? Esto solo se puede hacer una vez
                                </DialogContent>
                                <DialogActions>
                                    <DialogTrigger disableButtonEnhancement>
                                        <Button appearance="secondary">Volver</Button>
                                    </DialogTrigger>
                                    <DialogTrigger disableButtonEnhancement>
                                        <Button appearance="primary">Enviar para continuar mas tarde</Button>
                                    </DialogTrigger>
                                </DialogActions>
                            </DialogBody>
                        </DialogSurface>
                    </Dialog>
                    <Dialog>
                        <DialogTrigger disableButtonEnhancement>
                            <Button disabled={!isComplete}>Guardar</Button>
                        </DialogTrigger>
                        <DialogSurface>
                            <DialogBody>
                                <DialogTitle>Confirmacion de envio de Evolucion</DialogTitle>
                                <DialogContent>
                                    Esta seguro que desea enviar la historia? Esto no se puede deshacer ni editar
                                </DialogContent>
                                <DialogActions>
                                    <DialogTrigger disableButtonEnhancement>
                                        <Button appearance="secondary">Volver</Button>
                                    </DialogTrigger>
                                    <DialogTrigger disableButtonEnhancement>
                                        <Button appearance="primary">Enviar</Button>
                                    </DialogTrigger>
                                </DialogActions>
                            </DialogBody>
                        </DialogSurface>
                    </Dialog>
                    <InfoLabel info=
                        {
                            <>
                                Faltan campos por llenar
                                {missingFields.map((field, index) => (
                                    <div key={index}>{field}</div>
                                ))}
                            </>
                        }
                    />
                </div>
                <div className='flex flex-row'>
                    <InputFieldWithIcon label='Doctor: ' id='doctor' placeholder='Nombre del doctor' value={formData.doctor} handleDatachange={(e) => setFormData({ ...formData, doctor: e.target.value })} icon={<ClipboardCheckmarkRegular />} />
                </div>
            </div>


            <div className='flex justify-center space-y-3 mx-2'>
                <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 font-semibold gap-x-4 gap-y-2 mb-6'>
                    <Divider className='col-span-full' appearance='strong' ><span className='text-xl font-roboto'>Datos personales</span></Divider>
                    <InputFieldWithIcon label='Nombre del paciente' id='name' placeholder='Nombre del paciente' value={formData.personalData.name || ''} handleDatachange={handlePersonalDataChange} icon={<PersonRegular />} />
                    <InputFieldWithIcon label='Edad' id='age' placeholder='Edad del paciente' type='number' value={formData.personalData.age + '' || ''} handleDatachange={handlePersonalDataChange} icon={<ClockRegular />} />
                    <InputFieldWithIcon label='Fecha de nac     imiento' id='dateOfBirth' type='date' placeholder='Ingrese fecha de nacimiento del paciente' value={formData.personalData.dateOfBirth} handleDatachange={handlePersonalDataChange} icon={<PersonRegular />} />
                    <InputFieldWithIcon label='Ocupacion' id='occupation' placeholder='Ocupacion del paciente' value={formData.personalData.occupation} handleDatachange={handlePersonalDataChange} icon={<BriefcaseRegular />} />
                    <InputFieldWithIcon label='Estado civil' id='maritalStatus' placeholder='Estado civil del paciente' value={formData.personalData.maritalStatus} handleDatachange={handlePersonalDataChange} icon={<PersonChatRegular />} />
                    <InputFieldWithIcon label='Cedula' id='identification' placeholder='Cedula del paciente' value={formData.personalData.identification} handleDatachange={handlePersonalDataChange} icon={<SlideRecordRegular />} />
                    <div className='col-span-full flex flex-col space-y-1'>
                        <InputFieldWithIcon label='Direccion' id='address' placeholder='Direccion del paciente' value={formData.personalData.address} handleDatachange={handlePersonalDataChange} />
                        <InputFieldWithIcon label='Telefono' id='phone' placeholder='Numero telefonico' value={formData.personalData.phone} handleDatachange={handlePersonalDataChange} />
                        <InputFieldWithIcon label='Correo electronico' id='mail' placeholder='Correo electronico' value={formData.personalData.mail} handleDatachange={handlePersonalDataChange} />
                        <InputFieldWithIcon label='Creencia religiosa' id='religiousBelief' placeholder='Creencia religiosa' value={formData.personalData.religiousBelief} handleDatachange={handlePersonalDataChange} />
                        <Divider className='pt-3' appearance='strong' ><span className='text-xl font-roboto'>Motivo de consulta</span></Divider>
                        <TextFieldWithIcon label='Motivo de consulta' id='motive' placeholder='Describe el motivo de la consulta' handleDatachange={(e) => setFormData({ ...formData, motive: e.target.value })} value={formData.motive} />
                        <Divider className='pt-3' appearance='strong' ><span className='text-xl font-roboto'>Antecedentes personales</span></Divider>
                        <InputFieldWithIcon label='Patologicos' id='pathological' placeholder='Antecedentes patologicos...' value={formData.personalBackground.pathological} handleDatachange={handlePersonalBackgroundChange} />
                        <InputFieldWithIcon label='Farmacologicos' id='farmacological' placeholder='Antecedentes farmacologicos...' value={formData.personalBackground.farmacological} handleDatachange={handlePersonalBackgroundChange} />
                        <InputFieldWithIcon label='Quirurgicos' id='quirurgical' placeholder='Antecedentes quirurgicos...' value={formData.personalBackground.quirurgical} handleDatachange={handlePersonalBackgroundChange} />
                        <InputFieldWithIcon label='Trauma' id='trauma' placeholder='Antecedentes de trauma...' value={formData.personalBackground.trauma} handleDatachange={handlePersonalBackgroundChange} />
                        <InputFieldWithIcon label='Alergicos' id='alergic' placeholder='Antecedentes alergicos...' value={formData.personalBackground.alergic} handleDatachange={handlePersonalBackgroundChange} />
                        <InputFieldWithIcon label='Toxicos' id='toxic' placeholder='Antecedentes toxicos...' value={formData.personalBackground.toxic} handleDatachange={handlePersonalBackgroundChange} />
                        <InputFieldWithIcon label='Hospitalarios' id='hospitalary' placeholder='Antecedentes hospitalarios...' value={formData.personalBackground.hospitalary} handleDatachange={handlePersonalBackgroundChange} />
                        <Checkbox label={'Es gineco-obstetrico?'} onChange={() => setIsGinecoObstetric(!isGinecoObstetric)} />
                        {!isGinecoObstetric ? null : (
                            <div className='col-span-full flex flex-col space-y-1 items-center'>
                                <Label>Gineco-Obstetrico</Label>
                                <div className='grid grid-cols-4 w-full gap-x-4'>
                                    <Label className='col-span-full mb-3'>Formula obstetrica</Label>
                                    <Label>Gestaciones</Label>
                                    <InputFieldWithIcon id='gestations' type='number' placeholder='Gestaciones' value={formData.personalBackground.ginecoObstetric?.OS.gestations + "" || ""} handleDatachange={(e) => setFormData({ ...formData, personalBackground: { ...formData.personalBackground, ginecoObstetric: { ...formData.personalBackground.ginecoObstetric, OS: { ...formData.personalBackground.ginecoObstetric?.OS, gestations: parseInt(e.target.value) } } } })} />
                                    <Label>Partos</Label>
                                    <InputFieldWithIcon id='births' type='number' placeholder='Partos' value={formData.personalBackground.ginecoObstetric?.OS.births + "" || ""} handleDatachange={(e) => setFormData({ ...formData, personalBackground: { ...formData.personalBackground, ginecoObstetric: { ...formData.personalBackground.ginecoObstetric, OS: { ...formData.personalBackground.ginecoObstetric?.OS, births: parseInt(e.target.value) } } } })} />
                                    <Label>Cesareas</Label>
                                    <InputFieldWithIcon id='Caesarean' type='number' placeholder='Partos' value={formData.personalBackground.ginecoObstetric?.OS.Caesarean + "" || ""} handleDatachange={(e) => setFormData({ ...formData, personalBackground: { ...formData.personalBackground, ginecoObstetric: { ...formData.personalBackground.ginecoObstetric, OS: { ...formData.personalBackground.ginecoObstetric?.OS, births: parseInt(e.target.value) } } } })} />
                                    <Label>Abortos</Label>
                                    <InputFieldWithIcon id='abortions' type='number' placeholder='Abortos' value={formData.personalBackground.ginecoObstetric?.OS.abortions + "" || ""} handleDatachange={(e) => setFormData({ ...formData, personalBackground: { ...formData.personalBackground, ginecoObstetric: { ...formData.personalBackground.ginecoObstetric, OS: { ...formData.personalBackground.ginecoObstetric?.OS, abortions: parseInt(e.target.value) } } } })} />
                                    <div className='col-span-full flex flex-col space-y-1'>
                                        <InputFieldWithIcon label='Ultima menstruacion' id='lastMenstruation' placeholder='Ultima menstruacion...' value={formData.personalBackground.ginecoObstetric?.lastMenstruation || ""} handleDatachange={(e) => setFormData({ ...formData, personalBackground: { ...formData.personalBackground, ginecoObstetric: { ...formData.personalBackground.ginecoObstetric, lastMenstruation: e.target.value, OS: formData.personalBackground.ginecoObstetric?.OS || {} } } })} />
                                        <InputFieldWithIcon label='Ciclos' id='cycles' placeholder='Ciclos...' value={formData.personalBackground.ginecoObstetric?.cycles || ""} handleDatachange={(e) => setFormData({ ...formData, personalBackground: { ...formData.personalBackground, ginecoObstetric: { ...formData.personalBackground.ginecoObstetric, cycles: e.target.value, OS: formData.personalBackground.ginecoObstetric?.OS || {} } } })} />
                                        <InputFieldWithIcon label='Menarquia' id='menarche' placeholder='Menarquia ...' value={formData.personalBackground.ginecoObstetric?.menarche || ""} handleDatachange={(e) => setFormData({ ...formData, personalBackground: { ...formData.personalBackground, ginecoObstetric: { ...formData.personalBackground.ginecoObstetric, menarche: e.target.value, OS: formData.personalBackground.ginecoObstetric?.OS || {} } } })} />
                                        <InputFieldWithIcon label='Planificacion' id='planification' placeholder='Planificacion ...' value={formData.personalBackground.ginecoObstetric?.planification || ""} handleDatachange={(e) => setFormData({ ...formData, personalBackground: { ...formData.personalBackground, ginecoObstetric: { ...formData.personalBackground.ginecoObstetric, planification: e.target.value, OS: formData.personalBackground.ginecoObstetric?.OS || {} } } })} />
                                        <InputFieldWithIcon label='Ultimo papanicolau' id='papSmear' placeholder='Ultimo papanicolau ...' value={formData.personalBackground.ginecoObstetric?.papSmear || ""} handleDatachange={(e) => setFormData({ ...formData, personalBackground: { ...formData.personalBackground, ginecoObstetric: { ...formData.personalBackground.ginecoObstetric, papSmear: e.target.value, OS: formData.personalBackground.ginecoObstetric?.OS || {} } } })} />
                                        <TextFieldWithIcon label='Observaciones' id='observations' placeholder='Ingrese observaciones...' handleDatachange={(e) => setFormData({ ...formData, personalBackground: { ...formData.personalBackground, ginecoObstetric: { ...formData.personalBackground.ginecoObstetric, observations: e.target.value, OS: formData.personalBackground.ginecoObstetric?.OS || {} } } })} value={formData.personalBackground.ginecoObstetric?.observations || ""} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <Divider className='pt-3' appearance='strong' ><span className='text-xl font-roboto'>Antecedentes familiares</span></Divider>
                        <TextFieldWithIcon id='familyBackground' placeholder='Ingrese los antecedentes familiares...' handleDatachange={(e) => setFormData({ ...formData, familyBackground: e.target.value })} value={formData.familyBackground || ""} />
                        <Divider className='pt-3' appearance='strong' ><span className='text-xl font-roboto'>Enfermedad actual</span></Divider>
                        <TextFieldWithIcon id='currentIllness' placeholder='Ingrese la enfermedad actual...' handleDatachange={(e) => setFormData({ ...formData, currentIllness: e.target.value })} value={formData.currentIllness || ""} />
                        <Divider className='pt-3' appearance='strong' ><span className='text-xl font-roboto'>Revision por sistemas</span></Divider>
                        <div className='col-span-full space-y-1 items-center grid grid-cols-2 w-full gap-x-4'>
                            <InputFieldWithIcon label='Piel y Fanera' id='skin' placeholder='Ingrese revision de piel y fanera' value={formData.systemReview.skin} handleDatachange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, skin: e.target.value } })} />
                            <InputFieldWithIcon label='Genitourinario' id='genitourinary' placeholder='Ingrese revision del sistema genitourinario' value={formData.systemReview.genitourinary} handleDatachange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, genitourinary: e.target.value } })} />
                            <InputFieldWithIcon label='Colageno' id='collagen' placeholder='Ingrese revision de colageno' value={formData.systemReview.collagen} handleDatachange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, collagen: e.target.value } })} />
                            <InputFieldWithIcon label='Musculoesqueletico' id='musculoskeletal' placeholder='Ingrese revision del sistema musculoesqueletico' value={formData.systemReview.musculoskeletal} handleDatachange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, musculoskeletal: e.target.value } })} />
                            <InputFieldWithIcon label='Linfatico' id='lymphatic' placeholder='Ingrese revision del sistema linfatico' value={formData.systemReview.lymphatic} handleDatachange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, lymphatic: e.target.value } })} />
                            <InputFieldWithIcon label='Alimentacion' id='feeding' placeholder='Ingrese revision de alimentacion' value={formData.systemReview.feeding} handleDatachange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, feeding: e.target.value } })} />
                            <InputFieldWithIcon label='Auditivo' id='auditive' placeholder='Ingrese revision del sistema auditivo' value={formData.systemReview.auditive} handleDatachange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, auditive: e.target.value } })} />
                            <InputFieldWithIcon label='Sueño' id='sleep' placeholder='Ingrese revision del sueño' value={formData.systemReview.sleep} handleDatachange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, sleep: e.target.value } })} />
                            <InputFieldWithIcon label='Visual' id='visual' placeholder='Ingrese revision del sitema visual' value={formData.systemReview.visual} handleDatachange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, visual: e.target.value } })} />
                            <InputFieldWithIcon label='Actividad fisica' id='physicalActivity' placeholder='Ingrese revision de la actividad fisica' value={formData.systemReview.physicalActivity} handleDatachange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, physicalActivity: e.target.value } })} />
                            <InputFieldWithIcon label='Respiratorio' id='respiratory' placeholder='Ingrese revision del sistema respiratorio' value={formData.systemReview.respiratory} handleDatachange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, respiratory: e.target.value } })} />
                            <InputFieldWithIcon label='Psicosocial' id='psychosocial' placeholder='Ingrese revision psicosocial' value={formData.systemReview.psychosocial} handleDatachange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, psychosocial: e.target.value } })} />
                            <InputFieldWithIcon label='Digestivo' id='digestive' placeholder='Ingrese revision del sistema digestivo' value={formData.systemReview.digestive} handleDatachange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, digestive: e.target.value } })} />
                        </div>
                        <Divider className='py-3' appearance='strong' ><span className='text-xl font-roboto'>Familiograma</span></Divider>
                        <TextFieldWithIcon id='familyogram' placeholder='Familiograma' handleDatachange={(e) => setFormData({ ...formData, familyogram: e.target.value })} value={formData.familyogram || ""} />
                        <Divider className='py-3' appearance='strong' ><span className='text-xl font-roboto'>Examen fisico</span></Divider>
                        <div className='grid grid-cols-2'>
                            <InputFieldWithIcon label='Frecuencia cardiaca (lpm)' type='number' id='heartRate' placeholder='Frecuencia cardiaca' value={formData.physicalExam.heartRate + "" || ""} handleDatachange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, heartRate: parseFloat(e.target.value) } })} />
                            <InputFieldWithIcon label='Frecuencia respiratoria (rpm)' type='number' id='respiratoryRate' placeholder='Frecuencia respiratoria' value={formData.physicalExam.respiratoryRate + "" || ""} handleDatachange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, respiratoryRate: parseFloat(e.target.value) } })} />
                            <InputFieldWithIcon label='Tension arterial' id='bloodPressure' placeholder='Presion arterial' value={formData.physicalExam.bloodPressure + "" || ""} handleDatachange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, bloodPressure: e.target.value } })} />
                            <InputFieldWithIcon label='saturation' id='saturation' type='number' placeholder='Saturacion' value={formData.physicalExam.saturation + ""} handleDatachange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, saturation: parseFloat(e.target.value) } })} />
                            <InputFieldWithIcon label='Temperatura (C)' id='temperature' type='number' placeholder='Temperatura' value={formData.physicalExam.temperature + ""} handleDatachange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, temperature: parseFloat(e.target.value) } })} />
                            <InputFieldWithIcon label='Peso (kg)' id='weight' type='number' placeholder='Peso' value={formData.physicalExam.weight + ""} handleDatachange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, weight: parseFloat(e.target.value) } })} />
                            <InputFieldWithIcon label='Talla (m)' id='size' type='number' placeholder='Talla' value={formData.physicalExam.size + ""} handleDatachange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, size: parseFloat(e.target.value) } })} />
                            <InputFieldWithIcon label='IMC' id='IMC' type='number' placeholder='IMC' value={formData.physicalExam.IMC + ""} handleDatachange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, IMC: parseFloat(e.target.value) } })} />
                        </div>
                        <TextFieldWithIcon label='Examen Fisico' id='physicalExam' placeholder='Ingrese el examen fisico...' handleDatachange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, physicalExam: e.target.value } })} value={formData.physicalExam.physicalExam} />
                        <Label htmlFor='physicalExam'>Examen Fisico</Label>
                        <Divider className='pt-3' appearance='strong' ><span className='text-xl font-roboto'>Diagnostico</span></Divider>
                        <div className='col-span-full'>
                            <div className='grid grid-col-2'>
                                <Button onClick={addDiagnostic}>Agregar diagnostico</Button>
                                <Button onClick={removeDiagnostic}>Remover diagnostico</Button>
                                <div className='col-span-2'>
                                    {list.map((_x, i) => (
                                        <div key={i} className='flex flex-col space-y-1'>
                                            <InputFieldWithIcon id='diagnostic' placeholder='Ingrese el diagnostico...' value={formData.diagnostic[i].description} handleDatachange={(e) => {
                                                const newDiagnostic = formData.diagnostic.map((item, index) => {
                                                    if (i === index) {
                                                        return { description: e.target.value }
                                                    }
                                                    return item;
                                                });
                                                setFormData({ ...formData, diagnostic: newDiagnostic });
                                            }} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                        <Divider className='pt-3' appearance='strong' ><span className='text-xl font-roboto'>Tratamiento</span></Divider>
                        <div className='grid grid-col-2 col-span-full'>
                            <Button onClick={addTreatment}>Agregar tratamiento</Button>
                            <Button onClick={removeTreatment}>Remover tratamiento</Button>

                            <div className='col-span-2'>
                                {list2.map((_x, i) => (
                                    <div key={i} className='flex flex-col space-y-1'>
                                        <InputFieldWithIcon id='treatment' placeholder='Ingrese el tratamiento...' value={formData.treatment[i].description} handleDatachange={(e) => {
                                            const newTreatment = formData.treatment.map((item, index) => {
                                                if (i === index) {
                                                    return { description: e.target.value }
                                                }
                                                return item;
                                            });
                                            setFormData({ ...formData, treatment: newTreatment });
                                        }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Divider />
                </div>
            </div>
        </div>
    );
}