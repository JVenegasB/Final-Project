import React, { useEffect, useState } from 'react';
import { Input, Textarea, Checkbox, Label, Divider, Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, InfoLabel } from "@fluentui/react-components";
import { PersonRegular, BriefcaseRegular, PersonChatRegular, SlideRecordRegular, ClockRegular, ClipboardCheckmarkRegular } from '@fluentui/react-icons';
import { useUserContext } from '../context/userContext';

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
        <div className='flex flex-col h-full w-full'>
            <div className='flex flex-row justify-between px-10'>
                <div>
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
                    <Label htmlFor='doctor' ><div className='text-base justify-center items-center font-roboto mr-2'>Doctor: </div> </Label>
                    <Input id='doctor' name='doctor' contentBefore={<ClipboardCheckmarkRegular />} value={formData.doctor} onChange={(e) => setFormData({ ...formData, doctor: e.target.value })} />
                </div>
            </div>
            <div className='flex flex-col justify-center items-center space-y-3'>
                <div className='grid grid-cols-3 font-semibold gap-x-4 gap-y-2 mb-6'>
                    <Divider className='col-span-3' appearance='strong' ><span className='text-xl font-roboto'>Datos personales</span></Divider>
                    <div className='flex flex-col space-y-1'>
                        <Label htmlFor='name'>Nombre del paciente</Label>
                        <Input
                            id='name'
                            name='name'
                            value={formData.personalData.name || ''}
                            placeholder='Nombre del paciente'
                            onChange={handlePersonalDataChange}
                            contentBefore={<PersonRegular />}
                        />
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <Label htmlFor='age'>Edad</Label>
                        <Input
                            id='age'
                            name='age'
                            type='number'
                            value={formData.personalData.age + "" || ""}
                            placeholder='Edad'
                            onChange={handlePersonalDataChange}
                            contentBefore={<ClockRegular />}

                        />
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <Label htmlFor='dateOfBirth'>Fecha de nacimiento</Label>
                        <Input
                            id='dateOfBirth'
                            name='dateOfBirth'
                            type='date'
                            value={formData.personalData.dateOfBirth}
                            placeholder='Fecha de nacimiento'
                            onChange={handlePersonalDataChange}
                        />
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <Label htmlFor='occupation'>Ocupacion</Label>
                        <Input
                            id='occupation'
                            name='occupation'
                            value={formData.personalData.occupation}
                            placeholder='Occupacion'
                            onChange={handlePersonalDataChange}
                            contentBefore={<BriefcaseRegular />}
                        />
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <Label htmlFor='maritalStatus'>Estado civil</Label>
                        <Input
                            id='maritalStatus'
                            name='maritalStatus'
                            value={formData.personalData.maritalStatus}
                            placeholder='Estado civil'
                            onChange={handlePersonalDataChange}
                            contentBefore={<PersonChatRegular />}
                        />
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <Label htmlFor='identification'>Cedula</Label>
                        <Input
                            id='identification'
                            name='identification'
                            value={formData.personalData.identification}
                            placeholder='Cedula'
                            onChange={handlePersonalDataChange}
                            contentBefore={<SlideRecordRegular />}
                        />
                    </div>
                    <div className='col-span-3 flex flex-col space-y-1'>
                        <Label htmlFor='address'>Direccion</Label>
                        <Input
                            id='address'
                            name='address'
                            value={formData.personalData.address}
                            placeholder='Direccion'
                            onChange={handlePersonalDataChange}
                        />
                    </div>
                    <div className='flex flex-col space-y-1 col-span-3'>
                        <Label htmlFor='phone'>Telefono</Label>
                        <Input
                            id='phone'
                            name='phone'
                            value={formData.personalData.phone}
                            placeholder='Telefono'
                            onChange={handlePersonalDataChange}
                        />
                    </div>
                    <div className='col-span-3 flex flex-col space-y-1'>
                        <Label htmlFor='mail'>Correo electronico</Label>
                        <Input
                            id='mail'
                            name='mail'
                            value={formData.personalData.mail}
                            placeholder='Correo electronico'
                            onChange={handlePersonalDataChange}
                        />
                    </div>
                    <div className='col-span-3 flex flex-col space-y-1'>
                        <Label htmlFor='religiousBelief'>Creencia religiosa</Label>
                        <Input
                            id='religiousBelief'
                            name='religiousBelief'
                            value={formData.personalData.religiousBelief}
                            placeholder='Creencia religiosa'
                            onChange={handlePersonalDataChange}
                        />
                    </div>
                    <Divider className='col-span-3 mt-3' appearance='strong' ><span className='text-xl font-roboto'>Motivo de consulta</span></Divider>
                    <div className='col-span-3 flex flex-col space-y-1'>
                        <Label htmlFor='motive'>Motivo de consulta</Label>
                        <Textarea
                            id="motive"
                            name="motive"
                            value={formData.motive}
                            onChange={(e) => setFormData({ ...formData, motive: e.target.value })}
                            placeholder="Describe el motivo de consulta..."
                            resize='vertical'
                        />
                    </div>
                    <Divider className='col-span-3 mt-3' appearance='strong' ><span className='text-xl font-roboto'>Antecedentes personales</span></Divider>
                    <div className='col-span-3 flex flex-col space-y-1'>
                        <Label htmlFor='pathological'>Patologicos</Label>
                        <Input
                            id="pathological"
                            name="pathological"
                            value={formData.personalBackground.pathological}
                            onChange={handlePersonalBackgroundChange}
                            placeholder="Ingresa antecedentes patologicos..."
                        />
                    </div>
                    <div className='col-span-3 flex flex-col space-y-1'>
                        <Label htmlFor='farmacological'>Farmacologicos</Label>
                        <Input
                            id="farmacological"
                            name="farmacological"
                            value={formData.personalBackground.farmacological}
                            onChange={handlePersonalBackgroundChange}
                            placeholder="Ingresa antecedentes farmacologicos..."
                        />
                    </div>
                    <div className='col-span-3 flex flex-col space-y-1'>
                        <Label htmlFor='quirurgical'>Quirurgicos</Label>
                        <Input
                            id="quirurgical"
                            name="quirurgical"
                            value={formData.personalBackground.quirurgical}
                            onChange={handlePersonalBackgroundChange}
                            placeholder="Ingresa antecedentes quirurgicos..."
                        />
                    </div>
                    <div className='col-span-3 flex flex-col space-y-1'>
                        <Label htmlFor='trauma'>Trauma</Label>
                        <Input
                            id="trauma"
                            name="trauma"
                            value={formData.personalBackground.trauma}
                            onChange={handlePersonalBackgroundChange}
                            placeholder="Ingresa antecedentes de trauma ..."
                        />
                    </div>
                    <div className='col-span-3 flex flex-col space-y-1'>
                        <Label htmlFor='alergic'>Alergicos</Label>
                        <Input
                            id="alergic"
                            name="alergic"
                            value={formData.personalBackground.alergic}
                            onChange={handlePersonalBackgroundChange}
                            placeholder="Ingresa antecedentes alergicos..."
                        />
                    </div>
                    <div className='col-span-3 flex flex-col space-y-1'>
                        <Label htmlFor='toxic'>Toxicos</Label>
                        <Input
                            id="toxic"
                            name="toxic"
                            value={formData.personalBackground.toxic}
                            onChange={handlePersonalBackgroundChange}
                            placeholder="Ingresa antecedentes toxicos..."
                        />
                    </div>
                    <div className='col-span-3 flex flex-col space-y-1'>
                        <Label htmlFor='hospitalary'>Hospitalarios</Label>
                        <Input
                            id="hospitalary"
                            name="hospitalary"
                            value={formData.personalBackground.hospitalary}
                            onChange={handlePersonalBackgroundChange}
                            placeholder="Ingresa antecedentes hospitalarios..."
                        />
                    </div>
                    <div>
                        <Checkbox label={'Es gineco-obstetrico?'} onChange={() => setIsGinecoObstetric(!isGinecoObstetric)} />
                    </div>
                    {!isGinecoObstetric ? null : (
                        <div className='col-span-3 flex flex-col space-y-1 items-center'>
                            <Label>Gineco-Obstetrico</Label>
                            <div className='grid grid-cols-4 w-full gap-x-4'>
                                <Label className='col-span-4 mb-3'>Formula obstetrica</Label>
                                <div className='col-span-1'>
                                    <Label>Gestaciones</Label>
                                </div>
                                <div className='col-span-1 '>
                                    <Input
                                        id="gestations"
                                        name="gestations"
                                        type='number'
                                        value={formData.personalBackground.ginecoObstetric?.OS.gestations + "" || ""}
                                        onChange={(e) => setFormData({ ...formData, personalBackground: { ...formData.personalBackground, ginecoObstetric: { ...formData.personalBackground.ginecoObstetric, OS: { ...formData.personalBackground.ginecoObstetric?.OS, gestations: parseInt(e.target.value) } } } })}
                                        placeholder="Gestaciones"
                                        className='w-full'
                                    />
                                </div>
                                <div className='col-span-1'>
                                    <Label>Partos</Label>
                                </div>
                                <div className='col-span-1 '>
                                    <Input
                                        id="births"
                                        name="births"
                                        type='number'
                                        value={formData.personalBackground.ginecoObstetric?.OS.births + "" || ""}
                                        onChange={(e) => setFormData({ ...formData, personalBackground: { ...formData.personalBackground, ginecoObstetric: { ...formData.personalBackground.ginecoObstetric, OS: { ...formData.personalBackground.ginecoObstetric?.OS, births: parseInt(e.target.value) } } } })}
                                        placeholder="Partos"
                                        className='w-full'
                                    />
                                </div>
                                <div className='col-span-1'>
                                    <Label>Cesareas</Label>
                                </div>
                                <div className='col-span-1 '>
                                    <Input
                                        id="Caesarean"
                                        name="Caesarean"
                                        type='number'
                                        value={formData.personalBackground.ginecoObstetric?.OS.Caesarean + "" || ""}
                                        onChange={(e) => setFormData({ ...formData, personalBackground: { ...formData.personalBackground, ginecoObstetric: { ...formData.personalBackground.ginecoObstetric, OS: { ...formData.personalBackground.ginecoObstetric?.OS, Caesarean: parseInt(e.target.value) } } } })}
                                        placeholder="Cesareas"
                                        className='w-full'
                                    />
                                </div>
                                <div className='col-span-1'>
                                    <Label>Abortos</Label>
                                </div>
                                <div className='col-span-1 '>
                                    <Input
                                        id="abortions"
                                        name="abortions"
                                        type='number'
                                        value={formData.personalBackground.ginecoObstetric?.OS.abortions + "" || ""}
                                        onChange={(e) => setFormData({ ...formData, personalBackground: { ...formData.personalBackground, ginecoObstetric: { ...formData.personalBackground.ginecoObstetric, OS: { ...formData.personalBackground.ginecoObstetric?.OS, abortions: parseInt(e.target.value) } } } })}
                                        placeholder="Abortos"
                                        className='w-full'
                                    />
                                </div>
                                <div className='col-span-4 flex flex-col space-y-1'>
                                    <Label>Ultima menstruacion</Label>
                                    <Input
                                        id="lastMenstruation"
                                        name="lastMenstruation"
                                        value={formData.personalBackground.ginecoObstetric?.lastMenstruation || ""}
                                        onChange={(e) => setFormData({ ...formData, personalBackground: { ...formData.personalBackground, ginecoObstetric: { ...formData.personalBackground.ginecoObstetric, lastMenstruation: e.target.value, OS: formData.personalBackground.ginecoObstetric?.OS || {} } } })}
                                        placeholder="Ultima menstruacion"
                                        className='w-full'
                                    />
                                </div>
                                <div className='col-span-4 flex flex-col space-y-1'>
                                    <Label>Ciclos</Label>
                                    <Input
                                        id="cycles"
                                        name="cycles"
                                        value={formData.personalBackground.ginecoObstetric?.cycles || ""}
                                        onChange={(e) => setFormData({ ...formData, personalBackground: { ...formData.personalBackground, ginecoObstetric: { ...formData.personalBackground.ginecoObstetric, cycles: e.target.value, OS: formData.personalBackground.ginecoObstetric?.OS || {} } } })}
                                        placeholder="Ciclos"
                                        className='w-full'
                                    />
                                </div>
                                <div className='col-span-4 flex flex-col space-y-1'>
                                    <Label>Menarquia</Label>
                                    <Input
                                        id="menarche"
                                        name="menarche"
                                        value={formData.personalBackground.ginecoObstetric?.menarche || ""}
                                        onChange={(e) => setFormData({ ...formData, personalBackground: { ...formData.personalBackground, ginecoObstetric: { ...formData.personalBackground.ginecoObstetric, menarche: e.target.value, OS: formData.personalBackground.ginecoObstetric?.OS || {} } } })}
                                        placeholder="Menarquia"
                                        className='w-full'
                                    />
                                </div>
                                <div className='col-span-4 flex flex-col space-y-1'>
                                    <Label>Planificacion</Label>
                                    <Input
                                        id="planification"
                                        name="planification"
                                        value={formData.personalBackground.ginecoObstetric?.planification || ""}
                                        onChange={(e) => setFormData({ ...formData, personalBackground: { ...formData.personalBackground, ginecoObstetric: { ...formData.personalBackground.ginecoObstetric, planification: e.target.value, OS: formData.personalBackground.ginecoObstetric?.OS || {} } } })}
                                        placeholder="Planificacion"
                                        className='w-full'
                                    />
                                </div>
                                <div className='col-span-4 flex flex-col space-y-1'>
                                    <Label>Ultimo Papanicolau</Label>
                                    <Input
                                        id="papSmear"
                                        name="papSmear"
                                        value={formData.personalBackground.ginecoObstetric?.papSmear || ""}
                                        onChange={(e) => setFormData({ ...formData, personalBackground: { ...formData.personalBackground, ginecoObstetric: { ...formData.personalBackground.ginecoObstetric, papSmear: e.target.value, OS: formData.personalBackground.ginecoObstetric?.OS || {} } } })}
                                        placeholder="Ultimo Papanicolau"
                                        className='w-full'
                                    />
                                </div>
                                <div className='col-span-4 flex flex-col space-y-1'>
                                    <Label>Observaciones</Label>
                                    <Textarea
                                        id="observations"
                                        name="observations"
                                        value={formData.personalBackground.ginecoObstetric?.observations || ""}
                                        onChange={(e) => setFormData({ ...formData, personalBackground: { ...formData.personalBackground, ginecoObstetric: { ...formData.personalBackground.ginecoObstetric, observations: e.target.value, OS: formData.personalBackground.ginecoObstetric?.OS || {} } } })}
                                        placeholder="Ingrese observaciones..."
                                        className='w-full'
                                        resize='vertical'
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <Divider className='col-span-3 mt-3' appearance='strong' ><span className='text-xl font-roboto'>Antecedentes familiares</span></Divider>
                    <div className='col-span-3 flex flex-col space-y-1'>
                        <Textarea
                            id="familyBackground"
                            name="familyBackground"
                            value={formData.familyBackground || ""}
                            onChange={(e) => setFormData({ ...formData, familyBackground: e.target.value })}
                            placeholder="Ingrese los antecedentes familiares..."
                            className='w-full'
                            resize='vertical'
                        />
                    </div>
                    <Divider className='col-span-3 mt-3' appearance='strong' ><span className='text-xl font-roboto'>Enfermedad actual</span></Divider>
                    <div className='col-span-3 flex flex-col space-y-1'>
                        <Textarea
                            id="currentIllness"
                            name="currentIllness"
                            value={formData.currentIllness || ""}
                            onChange={(e) => setFormData({ ...formData, currentIllness: e.target.value })}
                            placeholder="Ingrese la enfermedad actual..."
                            className='w-full'
                            resize='vertical'
                        />
                    </div>
                    <Divider className='col-span-3 mt-3' appearance='strong' ><span className='text-xl font-roboto'>Revision por sistemas</span></Divider>
                    <div className='col-span-3 space-y-1 items-center grid grid-cols-2 w-full gap-x-4'>
                        <div className='flex flex-col space-y-1'>
                            <Label htmlFor='skin'>Piel y Fanera</Label>
                            <Input
                                id='skin'
                                name='skin'
                                value={formData.systemReview.skin}
                                onChange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, skin: e.target.value } })}
                                placeholder='Ingrese revision de piel y fanera'
                            />
                        </div>
                        <div className='flex flex-col space-y-1'>
                            <Label htmlFor='genitourinary'>Genitourinario</Label>
                            <Input
                                id='genitourinary'
                                name='genitourinary'
                                value={formData.systemReview.genitourinary}
                                onChange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, genitourinary: e.target.value } })}
                                placeholder='Ingrese revision del sistema genitourinario'
                            />
                        </div>

                        <div className='flex flex-col space-y-1'>
                            <Label htmlFor='collagen'>Colageno</Label>
                            <Input
                                id='collagen'
                                name='collagen'
                                value={formData.systemReview.collagen}
                                onChange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, collagen: e.target.value } })}
                                placeholder='Ingrese revision de colageno'
                            />
                        </div>
                        <div className='flex flex-col space-y-1'>
                            <Label htmlFor='musculoskeletal'>Musculoesqueletico</Label>
                            <Input
                                id='musculoskeletal'
                                name='musculoskeletal'
                                value={formData.systemReview.musculoskeletal}
                                onChange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, musculoskeletal: e.target.value } })}
                                placeholder='Ingrese revision del sistema musculoesqueletico'
                            />
                        </div>
                        <div className='flex flex-col space-y-1'>
                            <Label htmlFor='lymphatic'>Linfatico</Label>
                            <Input
                                id='lymphatic'
                                name='lymphatic'
                                value={formData.systemReview.lymphatic}
                                onChange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, lymphatic: e.target.value } })}
                                placeholder='Ingrese revision del sistema linfatico'
                            />
                        </div>
                        <div className='flex flex-col space-y-1'>
                            <Label htmlFor='feeding'>Alimentacion</Label>
                            <Input
                                id='feeding'
                                name='feeding'
                                value={formData.systemReview.feeding}
                                onChange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, feeding: e.target.value } })}
                                placeholder='Ingrese revision de alimentacion'
                            />
                        </div>
                        <div className='flex flex-col space-y-1'>
                            <Label htmlFor='auditive'>Auditivo</Label>
                            <Input
                                id='auditive'
                                name='auditive'
                                value={formData.systemReview.auditive}
                                onChange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, auditive: e.target.value } })}
                                placeholder='Ingrese revision del sistema auditivo'
                            />
                        </div>
                        <div className='flex flex-col space-y-1'>
                            <Label htmlFor='sleep'>Sueño</Label>
                            <Input
                                id='sleep'
                                name='sleep'
                                value={formData.systemReview.sleep}
                                onChange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, sleep: e.target.value } })}
                                placeholder='Ingrese revision del sueño'
                            />
                        </div>
                        <div className='flex flex-col space-y-1'>
                            <Label htmlFor='visual'>Visual</Label>
                            <Input
                                id='visual'
                                name='visual'
                                value={formData.systemReview.visual}
                                onChange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, visual: e.target.value } })}
                                placeholder='Ingrese revision del sistema visual'
                            />
                        </div>
                        <div className='flex flex-col space-y-1'>
                            <Label htmlFor='physicalActivity'>Actividad fisica</Label>
                            <Input
                                id='physicalActivity'
                                name='physicalActivity'
                                value={formData.systemReview.physicalActivity}
                                onChange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, physicalActivity: e.target.value } })}
                                placeholder='Ingrese revision de la actividad fisica'
                            />
                        </div>
                        <div className='flex flex-col space-y-1'>
                            <Label htmlFor='respiratory'>Respiratorio</Label>
                            <Input
                                id='respiratory'
                                name='respiratory'
                                value={formData.systemReview.respiratory}
                                onChange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, respiratory: e.target.value } })}
                                placeholder='Ingrese revision ddel sistema respiratorio'
                            />
                        </div>
                        <div className='flex flex-col space-y-1'>
                            <Label htmlFor='psychosocial'>Psicosocial</Label>
                            <Input
                                id='psychosocial'
                                name='psychosocial'
                                value={formData.systemReview.psychosocial}
                                onChange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, psychosocial: e.target.value } })}
                                placeholder='Ingrese revision psicosocial'
                            />
                        </div>
                        <div className='flex flex-col space-y-1'>
                            <Label htmlFor='digestive'>Digestivo</Label>
                            <Input
                                id='digestive'
                                name='digestive'
                                value={formData.systemReview.digestive}
                                onChange={(e) => setFormData({ ...formData, systemReview: { ...formData.systemReview, digestive: e.target.value } })}
                                placeholder='Ingrese revision del sistema digestivo'
                            />
                        </div>
                    </div>
                    <Divider className='col-span-3 mt-3' appearance='strong' ><span className='text-xl font-roboto'>Familiograma</span></Divider>
                    <div className='col-span-3 flex flex-col space-y-1'>
                        <Textarea
                            id="currentIllness"
                            name="currentIllness"
                            value={formData.familyogram || ""}
                            onChange={(e) => setFormData({ ...formData, familyogram: e.target.value })}
                            placeholder="Familiograma"
                            className='w-full'
                            resize='vertical'
                        />
                    </div>
                    <Divider className='col-span-3 mt-3' appearance='strong' ><span className='text-xl font-roboto'>Examen fisico</span></Divider>
                    <div className='flex flex-col space-y-1'>
                        <Label htmlFor='heartRate'>Frecuencia cardiaca (lpm)</Label>
                        <Input
                            id='heartRate'
                            name='heartRate'
                            type='number'
                            value={formData.physicalExam.heartRate + "" || ""}
                            onChange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, heartRate: parseFloat(e.target.value) } })}
                            placeholder='Frecuencia cardiaca'
                        />
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <Label htmlFor='respiratoryRate'>Frecuencia respiratoria (rpm)</Label>
                        <Input
                            id='respiratoryRate'
                            name='respiratoryRate'
                            type='number'
                            value={formData.physicalExam.respiratoryRate + "" || ""}
                            onChange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, respiratoryRate: parseFloat(e.target.value) } })}
                            placeholder='Frecuencia respiratoria'
                        />
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <Label htmlFor='bloodPressure'>Tension arterial</Label>
                        <Input
                            id='bloodPressure'
                            name='bloodPressure'
                            value={formData.physicalExam.bloodPressure}
                            onChange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, bloodPressure: e.target.value } })}
                            placeholder='Presion arterial'
                        />
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <Label htmlFor='saturation'>Saturacion(%)</Label>
                        <Input
                            id='saturation'
                            name='saturation'
                            value={formData.physicalExam.saturation + ""}
                            type='number'
                            onChange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, saturation: parseFloat(e.target.value) } })}
                            placeholder='Saturacion'
                        />
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <Label htmlFor='temperature'>Temperatura (C)</Label>
                        <Input
                            id='temperature'
                            name='temperature'
                            type='number'
                            value={formData.physicalExam.temperature + ""}
                            onChange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, temperature: parseFloat(e.target.value) } })}
                            placeholder='Temperatura'
                        />
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <Label htmlFor='weight'>Peso (kg)</Label>
                        <Input
                            id='weight'
                            name='weight'
                            type='number'
                            value={formData.physicalExam.weight + ""}
                            onChange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, weight: parseInt(e.target.value) } })}
                            placeholder='Peso'
                        />
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <Label htmlFor='size'>Talla (m)</Label>
                        <Input
                            id='size'
                            name='size'
                            type='number'
                            value={formData.physicalExam.size + ""}
                            onChange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, size: parseFloat(e.target.value) } })}
                            placeholder='Talla'
                        />
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <Label htmlFor='IMC'>IMC</Label>
                        <Input
                            id='IMC'
                            name='IMC'
                            type='number'
                            value={formData.physicalExam.IMC + "" || ""}
                            placeholder='IMC'
                        />
                    </div>
                    <div className='flex flex-col space-y-1 col-span-3'>
                        <Label htmlFor='IMC'>Examen Fisico</Label>
                        <Textarea
                            id='IMC'
                            name='IMC'
                            value={formData.physicalExam.physicalExam}
                            placeholder='Ingrese el examen fisico...'
                            onChange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, physicalExam: e.target.value } })}
                            resize='vertical'
                        />
                    </div>
                    <Divider className='col-span-3 mt-3' appearance='strong' ><span className='text-xl font-roboto'>Diagnostico</span></Divider>
                    <div className='grid grid-col-2  col-span-3 '>

                        <Button onClick={addDiagnostic}>Agregar diagnostico</Button>
                        <Button onClick={removeDiagnostic}>Remover diagnostico</Button>
                        <div className='col-span-2'>
                            {list.map((_x, i) => (
                                <div key={i} className='flex flex-col space-y-1'>
                                    <Input
                                        id='diagnostic'
                                        name='diagnostic'
                                        value={formData.diagnostic[i].description}
                                        onChange={(e) => {
                                            const newDiagnostic = formData.diagnostic.map((item, index) => {
                                                if (i === index) {
                                                    return { description: e.target.value }
                                                }
                                                return item;
                                            });
                                            setFormData({ ...formData, diagnostic: newDiagnostic });
                                        }}
                                        placeholder='Ingrese el diagnostico...'
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <Divider className='col-span-3 mt-3' appearance='strong' ><span className='text-xl font-roboto'>Tratamiento</span></Divider>
                    <div className='grid grid-col-2  col-span-3 '>
                        <Button onClick={addTreatment}>Agregar tratamiento</Button>
                        <Button onClick={removeTreatment}>Remover tratamiento</Button>

                        <div className='col-span-2'>
                            {list2.map((_x, i) => (
                                <div key={i} className='flex flex-col space-y-1'>
                                    <Input
                                        id='treatment'
                                        name='treatment'
                                        value={formData.treatment[i].description}
                                        onChange={(e) => {
                                            const newTreatment = formData.treatment.map((item, index) => {
                                                if (i === index) {
                                                    return { description: e.target.value }
                                                }
                                                return item;
                                            });
                                            setFormData({ ...formData, treatment: newTreatment });
                                        }}
                                        placeholder='Ingrese el tratamiento...'
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <Divider></Divider>

                </div>

            </div>

        </div>
    );
}