import React, { useEffect, useState } from 'react';
import { Checkbox, Label, Divider, Button, InfoLabel } from "@fluentui/react-components";
import { PersonRegular, BriefcaseRegular, PersonChatRegular, SlideRecordRegular, ClockRegular, ClipboardCheckmarkRegular, SaveArrowRight20Regular, Save20Regular } from '@fluentui/react-icons';
import InputFieldWithIcon from './InputFieldWithIcon'
import TextFieldWithIcon from './TextFieldWithIcon'
import ConfirmationDialogs from './ConfirmationDialogs'
import InputFieldCie10 from './InputFieldCie10'
import { PatientSummary } from '../types/types';
import { useClinicContext } from '../context/clinicContext';
import { useUserContext } from '../context/userContext';

const initialPatientSummary: PatientSummary = {
    id: 0,
    address: '',
    age: 0,
    clinic_id: 0,
    current_illness: '',
    date_of_birth: '',
    diagnosis: [],
    doctor: '',
    email: '',
    familiogram: '',
    family_background: '',
    first_session: '',
    identification: '',
    is_finish_later: false,
    last_session: '',
    marital_status: '',
    motive: '',
    name: '',
    occupation: '',
    personal_background: {
        pathological: '',
        pharmacological: '',
        surgical: '',
        trauma: '',
        allergic: '',
        toxic: '',
        hospitalary: '',
        gestations: 0,
        births: 0,
        caesarean: 0,
        abortions: 0,
        last_menstruation: '',
        planification: '',
        menarche: '',
        cycles: '',
        pap_smear: '',
        observations: '',
        isGinecoObstetric: false,
    },
    phone: '',
    physical_exam: {
        heart_rate: 0,
        respiratory_rate: 0,
        blood_pressure: '',
        saturation: 0,
        temperature: 0,
        weight: 0,
        size: 0,
        imc: 0,
        physical_exam: '',
    },
    religious_belief: '',
    system_review: {
        skin: '',
        collagen: '',
        lymphatic: '',
        auditory: '',
        visual: '',
        respiratory: '',
        digestive: '',
        genitourinary: '',
        musculoskeletal: '',
        feeding: '',
        sleep: '',
        physical_activity: '',
        psychosocial: '',
    },
    treatment: [],
};
interface NewPatientProps { 
    fetchPatientList: () => void;
}

export default function NewPatient({fetchPatientList}: NewPatientProps) {
    //variable to store the form data
    const [formData, setFormData] = useState<PatientSummary>(initialPatientSummary);
    //Context to get clinic and logged user data
    const [clinic] = useClinicContext();
    const [loggedUser] = useUserContext();
    // Initialize the form with clinic and doctor information
    useEffect(() => {
        const currentDate = new Date().toISOString();
        setFormData((prevData) => ({
            ...prevData,
            first_session: currentDate,
            last_session: currentDate,
            personal_background: {
                ...prevData.personal_background,
                isGinecoObstetric: false,
            },
        }));
    }, []);
    //Fill clinic_id and doctor fields
    useEffect(() => {
        if (clinic) {
            setFormData((prevData) => ({
                ...prevData,
                clinic_id: clinic.id,
            }));
        }
        if (loggedUser) {
            setFormData((prevData) => ({
                ...prevData,
                doctor: loggedUser.name,
            }));
        }
    }, [clinic, loggedUser]);

    // Check completeness
    const [isSendLaterEnable, setIsSendLaterEnable] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [missingFields, setMissingFields] = useState<string[]>([]);
    useEffect(() => {
        console.log(formData)
        const enableSendLater = Boolean(
            formData?.name?.trim() &&
            formData?.identification?.trim() &&
            formData?.first_session &&
            formData?.last_session &&
            formData?.doctor &&
            formData?.clinic_id
        );


        const isComplete = () => {
            const errors: string[] = [];

            const checkIfEmpty = (value: string | number | boolean | null | undefined): boolean =>
                value === null || value === '' || value === undefined;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const validateNestedObject = (obj: any, parentKey = '') => {
                for (const key in obj) {
                    const fullKey = parentKey ? `${parentKey}.${key}` : key;
                    const value = obj[key];
                    if (parentKey === 'personal_background' && !formData?.personal_background?.isGinecoObstetric) {
                        continue;
                    }
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        validateNestedObject(value, fullKey);
                    } else if (checkIfEmpty(value)) {
                        errors.push(fullKey);
                    }
                }
            };

            // Validate main formData object
            validateNestedObject(formData);

            // Specific checks for GinecoObstetric fields if isGinecoObstetric is true
            if (formData?.personal_background?.isGinecoObstetric) {
                const ginecoFields = [
                    'gestations',
                    'births',
                    'caesarean',
                    'abortions',
                    'last_menstruation',
                    'planification',
                    'menarche',
                    'cycles',
                    'pap_smear',
                    'observations'
                ];

                for (const field of ginecoFields) {
                    const value = formData.personal_background[field as keyof typeof formData.personal_background];
                    if (checkIfEmpty(value)) {
                        errors.push(`personal_background.${field}`);
                    }
                }
            }
            if (formData?.diagnosis && formData.diagnosis.length > 0) {
                formData.diagnosis.forEach((diagnosis, index) => {
                    if (checkIfEmpty(diagnosis.description)) {
                        errors.push(`diagnosis[${index}].description`);
                    }
                    if (checkIfEmpty(diagnosis.code)) {
                        errors.push(`diagnosis[${index}].code`);
                    }
                });
            } else {
                errors.push('diagnosis');
            }
            if (formData?.treatment && formData.treatment.length > 0) {
                formData.treatment.forEach((treatment, index) => {
                    if (checkIfEmpty(treatment.description)) {
                        errors.push(`treatment[${index}].description`);
                    }
                });
            } else {
                errors.push('tratment');
            }
            setMissingFields(errors);
            return errors.length === 0;
        };

        setIsComplete(isComplete());
        setIsSendLaterEnable(enableSendLater);
    }, [formData]);

    //Handle data changes
    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'age' ? Number(value) : value,
        }));
    };
    //Handle personalBackground changes
    const handlePersonalBackground = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            personal_background: {
                ...prevData?.personal_background,
                [name]: value,
            }
        }));
    }
    //Handle physicalExam changes
    const handlePhysicalExam = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            physical_exam: {
                ...prevData?.physical_exam,
                [name]:
                    name === 'heart_rate' || name === 'respiratory_rate' || name === 'saturation'
                        ? parseInt(value)
                        : name === 'temperature' || name === 'weight' || name === 'size' || name === 'imc'
                            ? parseFloat(value)
                            : name === 'blood_pressure' || name === 'physical_exam'
                                ? value
                                : value,
            },
        }));
    };

    //Handle systemReview changes
    const handleSystemReview = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            system_review: {
                ...prevData?.system_review,
                [name]: value,
            }
        }));
    }
    //Handle ginecoObstetric changes
    const [isGinecoObstetric, setIsGinecoObstetric] = useState(false);
    useEffect(() => {
        if (!isGinecoObstetric) {
            setFormData((prevData) => ({
                ...prevData,
                personal_background: {
                    ...prevData?.personal_background,
                    gestations: undefined,
                    births: undefined,
                    caesarean: undefined,
                    abortions: undefined,
                    last_menstruation: undefined,
                    planification: undefined,
                    menarche: undefined,
                    cycles: undefined,
                    pap_smear: undefined,
                    observations: undefined,
                    isGinecoObstetric: false,
                }
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                personal_background: {
                    ...prevData?.personal_background,
                    gestations: 0,
                    births: 0,
                    caesarean: 0,
                    abortions: 0,
                    last_menstruation: '',
                    planification: '',
                    menarche: '',
                    cycles: '',
                    pap_smear: '',
                    observations: '',
                    isGinecoObstetric: true,
                }
            }));
        }
    }, [isGinecoObstetric]);
    //calculate IMC value
    useEffect(() => {
        if (formData?.physical_exam?.size && formData.physical_exam?.weight && formData.physical_exam.size > 0 && formData.physical_exam.weight > 0) {
            const IMC = formData.physical_exam.weight / (formData.physical_exam.size) ** 2;
            setFormData((prevData) => ({
                ...prevData,
                physical_exam: {
                    ...prevData?.physical_exam,
                    imc: IMC,
                }
            }));
        }
    }, [formData?.physical_exam?.size, formData?.physical_exam?.weight]);

    //Handle diagnosis changes and add or remove diagnosis
    // const [inputValue, setInputValue] = useState<string>('');
    const [inputValue2, setInputValue2] = useState<string>('');
    // const [list, setList] = useState<string[]>([]);
    const [list2, setList2] = useState<string[]>([]);

    const addDiagnosis = () => {
        setFormData((prevData) => ({
            ...prevData,
            diagnosis: [
                ...(prevData?.diagnosis || []),
                { description: '', code: '' }
            ]
        }));
    };

    const removeDiagnosis = () => {
        // setList((prevList) => prevList.slice(0, -1));

        setFormData((prevData) => ({
            ...prevData,
            diagnosis: prevData?.diagnosis ? prevData.diagnosis.slice(0, -1) : []
        }));
    };

    //Handle treatment changes and add or remove treatment
    const addTreatment = () => {
        if (inputValue2.trim() !== '_') {
            setList2((prevList) => [...prevList, inputValue2]);

            setFormData((prevData) => ({
                ...prevData,
                treatment: [
                    ...(prevData?.treatment || []),
                    { description: inputValue2 }
                ]
            }));

            setInputValue2('');
        }
    };

    const removeTreatment = () => {
        setList2((prevList) => prevList.slice(0, -1));

        setFormData((prevData) => ({
            ...prevData,
            treatment: prevData?.treatment ? prevData.treatment.slice(0, -1) : []
        }));
    };

    //Send later patient history
    const sendLater = async () => {
        const updatedData = { ...formData, is_finish_later: true };
        setFormData(updatedData);
        console.log(updatedData)
        const url = 'http://127.0.0.1:54321/functions/v1/create-patient';
        try {
            //post
            const res = await fetch(url,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            })
            if(res.ok){
                console.log('Data saved successfully');
                //vaciar formulario
                setFormData(initialPatientSummary);
                fetchPatientList()
            }
        } catch (error) {
            console.error('Error saving data:', error);
            
        }
    }
    //Send patient history
    const sendData = async() => {
        const updatedData = { ...formData, is_finish_later: false };
        setFormData(updatedData);

        const url = 'http://127.0.0.1:54321/functions/v1/create-patient';
        try {
            //post
            const res = await fetch(url,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            })
            if(res.ok){
                console.log('Data saved successfully');
                //Dialogo de confirmacion de envio
                setFormData(initialPatientSummary);
                fetchPatientList()
            }
        } catch (error) {
            console.error('Error saving data:', error);
            
        }
    }
    return (
        <div className='flex flex-col h-full w-full overflow-y-auto'>
            <div className='flex md:flex-row flex-col justify-between md:mx-5 mx-2'>
                <div>
                    <ConfirmationDialogs props={{ buttonDescription: 'Terminar mas tarde', description: '¿Estás seguro de que deseas guardar la historia y continuar más tarde? Esto solo se puede hacer una vez', mainButtonText: 'Enviar para continuar mas tarde', mainFunction: sendLater, secondaryButtonText: 'Cancelar', title: 'Confirmacion para continuar mas tarde', valid: isSendLaterEnable, icon: (<SaveArrowRight20Regular />) }} />
                    <ConfirmationDialogs props={{ buttonDescription: 'Guardar', description: 'Esta seguro que desea enviar la historia? Una vez enviada no se puede deshacer ni editar', mainButtonText: 'Enviar', mainFunction: sendData, secondaryButtonText: 'Cancelar', title: 'Confirmacion de envio de Evolucion', valid: isComplete, icon: (<Save20Regular />) }} />
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
                    <InputFieldWithIcon label='Doctor: ' id='doctor' placeholder='Nombre del doctor' value={formData?.doctor ?? ''} handleDatachange={(e) => setFormData({ ...formData, doctor: e.target.value })} icon={<ClipboardCheckmarkRegular />} />
                </div>
            </div>
            <div className='flex justify-center space-y-3 mx-2'>
                <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 font-semibold gap-x-4 gap-y-2 mb-6'>
                    <Divider className='col-span-full' appearance='strong' ><span className='text-xl font-roboto'>Datos personales</span></Divider>
                    <InputFieldWithIcon label='Nombre del paciente' id='name' placeholder='Nombre del paciente' value={formData?.name || ''} handleDatachange={handleDataChange} icon={<PersonRegular />} />
                    <InputFieldWithIcon label='Edad' id='age' placeholder='Edad del paciente' type='number' value={formData?.age + '' || ''} handleDatachange={handleDataChange} icon={<ClockRegular />} />
                    <InputFieldWithIcon label='Fecha de nacimiento' id='date_of_birth' type='date' placeholder='Ingrese fecha de nacimiento del paciente' value={formData?.date_of_birth || ''} handleDatachange={handleDataChange} icon={<PersonRegular />} />
                    <InputFieldWithIcon label='Ocupacion' id='occupation' placeholder='Ocupacion del paciente' value={formData?.occupation || ''} handleDatachange={handleDataChange} icon={<BriefcaseRegular />} />
                    <InputFieldWithIcon label='Estado civil' id='marital_status' placeholder='Estado civil del paciente' value={formData?.marital_status || ''} handleDatachange={handleDataChange} icon={<PersonChatRegular />} />
                    <InputFieldWithIcon label='Cedula' id='identification' placeholder='Cedula del paciente' value={formData?.identification || ''} handleDatachange={handleDataChange} icon={<SlideRecordRegular />} />
                    <div className='col-span-full flex flex-col space-y-1'>
                        <InputFieldWithIcon label='Direccion' id='address' placeholder='Direccion del paciente' value={formData?.address || ''} handleDatachange={handleDataChange} />
                        <InputFieldWithIcon label='Telefono' id='phone' placeholder='Numero telefonico' value={formData?.phone || ''} handleDatachange={handleDataChange} />
                        <InputFieldWithIcon label='Correo electronico' id='email' placeholder='Correo electronico' value={formData?.email || ''} handleDatachange={handleDataChange} />
                        <InputFieldWithIcon label='Creencia religiosa' id='religious_belief' placeholder='Creencia religiosa' value={formData?.religious_belief || ''} handleDatachange={handleDataChange} />
                        <Divider className='pt-3' appearance='strong' ><span className='text-xl font-roboto'>Motivo de consulta</span></Divider>
                        <TextFieldWithIcon label='Motivo de consulta' id='motive' placeholder='Describe el motivo de la consulta' handleDatachange={(e) => setFormData({ ...formData, motive: e.target.value })} value={formData?.motive || ''} />
                        <Divider className='pt-3' appearance='strong' ><span className='text-xl font-roboto'>Enfermedad actual</span></Divider>
                        <TextFieldWithIcon id='currentIllness' placeholder='Ingrese la enfermedad actual...' handleDatachange={(e) => setFormData({ ...formData, current_illness: e.target.value })} value={formData?.current_illness || ""} />
                        <Divider className='pt-3' appearance='strong' ><span className='text-xl font-roboto'>Antecedentes personales</span></Divider>
                        <InputFieldWithIcon label='Patologicos' id='pathological' placeholder='Antecedentes patologicos...' value={formData?.personal_background?.pathological || ''} handleDatachange={handlePersonalBackground} />
                        <InputFieldWithIcon label='Farmacologicos' id='pharmacological' placeholder='Antecedentes farmacologicos...' value={formData?.personal_background?.pharmacological || ''} handleDatachange={handlePersonalBackground} />
                        <InputFieldWithIcon label='Quirurgicos' id='surgical' placeholder='Antecedentes quirurgicos...' value={formData?.personal_background?.surgical || ''} handleDatachange={handlePersonalBackground} />
                        <InputFieldWithIcon label='Trauma' id='trauma' placeholder='Antecedentes de trauma...' value={formData?.personal_background?.trauma || ''} handleDatachange={handlePersonalBackground} />
                        <InputFieldWithIcon label='Alergicos' id='allergic' placeholder='Antecedentes alergicos...' value={formData?.personal_background?.allergic || ''} handleDatachange={handlePersonalBackground} />
                        <InputFieldWithIcon label='Toxicos' id='toxic' placeholder='Antecedentes toxicos...' value={formData?.personal_background?.toxic || ''} handleDatachange={handlePersonalBackground} />
                        <InputFieldWithIcon label='Hospitalarios' id='hospitalary' placeholder='Antecedentes hospitalarios...' value={formData?.personal_background?.hospitalary || ''} handleDatachange={handlePersonalBackground} />
                        <Checkbox label={'Es gineco-obstetrico?'} onChange={() => setIsGinecoObstetric(!isGinecoObstetric)} />
                        {!isGinecoObstetric ? null : (
                            <div className='col-span-full flex flex-col space-y-1 items-center'>
                                <Label>Gineco-Obstetrico</Label>
                                <div className='grid grid-cols-4 w-full gap-x-4'>
                                    <Label className='col-span-full mb-3'>Formula obstetrica</Label>
                                    <Label>Gestaciones</Label>
                                    <InputFieldWithIcon id='gestations' type='number' placeholder='Gestaciones' value={formData?.personal_background?.gestations + "" || ""} handleDatachange={handlePersonalBackground} />
                                    <Label>Partos</Label>
                                    <InputFieldWithIcon id='births' type='number' placeholder='Partos' value={formData?.personal_background?.births + "" || ""} handleDatachange={handlePersonalBackground} />
                                    <Label>Cesareas</Label>
                                    <InputFieldWithIcon id='caesarean' type='number' placeholder='Partos' value={formData?.personal_background?.caesarean + "" || ""} handleDatachange={handlePersonalBackground} />
                                    <Label>Abortos</Label>
                                    <InputFieldWithIcon id='abortions' type='number' placeholder='Abortos' value={formData?.personal_background?.abortions + "" || ""} handleDatachange={handlePersonalBackground} />
                                    <div className='col-span-full flex flex-col space-y-1'>
                                        <InputFieldWithIcon label='Ultima menstruacion' id='last_menstruation' placeholder='Ultima menstruacion...' value={formData?.personal_background?.last_menstruation || ""} handleDatachange={handlePersonalBackground} />
                                        <InputFieldWithIcon label='Ciclos' id='cycles' placeholder='Ciclos...' value={formData?.personal_background?.cycles || ""} handleDatachange={handlePersonalBackground} />
                                        <InputFieldWithIcon label='Menarquia' id='menarche' placeholder='Menarquia ...' value={formData?.personal_background?.menarche || ""} handleDatachange={handlePersonalBackground} />
                                        <InputFieldWithIcon label='Planificacion' id='planification' placeholder='Planificacion ...' value={formData?.personal_background?.planification || ""} handleDatachange={handlePersonalBackground} />
                                        <InputFieldWithIcon label='Ultimo papanicolau' id='pap_smear' placeholder='Ultimo papanicolau ...' value={formData?.personal_background?.pap_smear || ""} handleDatachange={handlePersonalBackground} />
                                        <TextFieldWithIcon label='Observaciones' id='observations' placeholder='Ingrese observaciones...' handleDatachange={(e) => setFormData({ ...formData, personal_background: { ...formData?.personal_background, observations: e.target.value } })} value={formData?.personal_background?.observations || ""} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <Divider className='pt-3' appearance='strong' ><span className='text-xl font-roboto'>Antecedentes familiares</span></Divider>
                        <TextFieldWithIcon id='familyBackground' placeholder='Ingrese los antecedentes familiares...' handleDatachange={(e) => setFormData({ ...formData, family_background: e.target.value })} value={formData?.family_background || ""} />
                       
                        <Divider className='pt-3' appearance='strong' ><span className='text-xl font-roboto'>Revision por sistemas</span></Divider>
                        <div className='col-span-full space-y-1 items-center grid grid-cols-2 w-full gap-x-4'>
                            <InputFieldWithIcon label='Piel y Fanera' id='skin' placeholder='Ingrese revision de piel y fanera' value={formData?.system_review?.skin || ""} handleDatachange={handleSystemReview} />
                            <InputFieldWithIcon label='Genitourinario' id='genitourinary' placeholder='Ingrese revision del sistema genitourinario' value={formData?.system_review?.genitourinary || ""} handleDatachange={handleSystemReview} />
                            <InputFieldWithIcon label='Colageno' id='collagen' placeholder='Ingrese revision de colageno' value={formData?.system_review?.collagen || ""} handleDatachange={handleSystemReview} />
                            <InputFieldWithIcon label='Musculoesqueletico' id='musculoskeletal' placeholder='Ingrese revision del sistema musculoesqueletico' value={formData?.system_review?.musculoskeletal || ""} handleDatachange={handleSystemReview} />
                            <InputFieldWithIcon label='Linfatico' id='lymphatic' placeholder='Ingrese revision del sistema linfatico' value={formData?.system_review?.lymphatic || ""} handleDatachange={handleSystemReview} />
                            <InputFieldWithIcon label='Alimentacion' id='feeding' placeholder='Ingrese revision de alimentacion' value={formData?.system_review?.feeding || ""} handleDatachange={handleSystemReview} />
                            <InputFieldWithIcon label='Auditivo' id='auditory' placeholder='Ingrese revision del sistema auditivo' value={formData?.system_review?.auditory || ""} handleDatachange={handleSystemReview} />
                            <InputFieldWithIcon label='Sueño' id='sleep' placeholder='Ingrese revision del sueño' value={formData?.system_review?.sleep || ""} handleDatachange={handleSystemReview} />
                            <InputFieldWithIcon label='Visual' id='visual' placeholder='Ingrese revision del sitema visual' value={formData?.system_review?.visual || ""} handleDatachange={handleSystemReview} />
                            <InputFieldWithIcon label='Actividad fisica' id='physical_activity' placeholder='Ingrese revision de la actividad fisica' value={formData?.system_review?.physical_activity || ""} handleDatachange={handleSystemReview} />
                            <InputFieldWithIcon label='Respiratorio' id='respiratory' placeholder='Ingrese revision del sistema respiratorio' value={formData?.system_review?.respiratory || ""} handleDatachange={handleSystemReview} />
                            <InputFieldWithIcon label='Psicosocial' id='psychosocial' placeholder='Ingrese revision psicosocial' value={formData?.system_review?.psychosocial || ""} handleDatachange={handleSystemReview} />
                            <InputFieldWithIcon label='Digestivo' id='digestive' placeholder='Ingrese revision del sistema digestivo' value={formData?.system_review?.digestive || ""} handleDatachange={handleSystemReview} />
                        </div>
                        <Divider className='py-3' appearance='strong' ><span className='text-xl font-roboto'>Familiograma</span></Divider>
                        <TextFieldWithIcon id='familyogram' placeholder='Familiograma' handleDatachange={(e) => setFormData({ ...formData, familiogram: e.target.value })} value={formData?.familiogram || ""} />
                        <Divider className='py-3' appearance='strong' ><span className='text-xl font-roboto'>Examen fisico</span></Divider>
                        <div className='grid grid-cols-2'>
                            <InputFieldWithIcon label='Frecuencia cardiaca (lpm)' type='number' id='heart_rate' placeholder='Frecuencia cardiaca' value={formData?.physical_exam?.heart_rate + "" || ""} handleDatachange={handlePhysicalExam} />
                            <InputFieldWithIcon label='Frecuencia respiratoria (rpm)' type='number' id='respiratory_rate' placeholder='Frecuencia respiratoria' value={formData?.physical_exam?.respiratory_rate + "" || ""} handleDatachange={handlePhysicalExam} />
                            <InputFieldWithIcon label='Tension arterial' id='blood_pressure' placeholder='Tension arterial' value={formData?.physical_exam?.blood_pressure || ""} handleDatachange={handlePhysicalExam} />
                            <InputFieldWithIcon label='saturation' id='saturation' type='number' placeholder='Saturacion' value={formData?.physical_exam?.saturation + ""} handleDatachange={handlePhysicalExam} />
                            <InputFieldWithIcon label='Temperatura (C)' id='temperature' type='number' placeholder='Temperatura' value={formData?.physical_exam?.temperature + ""} handleDatachange={handlePhysicalExam} />
                            <InputFieldWithIcon label='Peso (kg)' id='weight' type='number' placeholder='Peso' value={formData?.physical_exam?.weight + ""} handleDatachange={handlePhysicalExam} />
                            <InputFieldWithIcon label='Talla (m)' id='size' type='number' placeholder='Talla' value={formData?.physical_exam?.size + ""} handleDatachange={handlePhysicalExam} />
                            <InputFieldWithIcon label='IMC' id='imc' type='number' placeholder='IMC' value={formData?.physical_exam?.imc + ""} handleDatachange={handlePhysicalExam} />
                        </div>
                        <TextFieldWithIcon label='Examen Fisico' id='physical_exam' placeholder='Ingrese el examen fisico...' handleDatachange={(e) => setFormData({ ...formData, physical_exam: { ...formData?.physical_exam, physical_exam: e.target.value } })} value={formData?.physical_exam?.physical_exam || ""} />
                        <Divider className='pt-3' appearance='strong' ><span className='text-xl font-roboto'>Diagnostico</span></Divider>
                        <div className='col-span-full'>
                            <div className='grid grid-col-2'>
                                <Button onClick={addDiagnosis}>Agregar diagnostico</Button>
                                <Button onClick={removeDiagnosis}>Remover diagnostico</Button>
                                <div className='col-span-2'>
                                    {formData.diagnosis.map((_x, i) => (
                                        <div key={i} className='flex flex-col space-y-1'>
                                            <InputFieldCie10
                                                id={`diagnostic-${i}`}
                                                placeholder="Ingrese el diagnostico..."
                                                value={formData?.diagnosis?.[i]?.description || ''}
                                                handleDatachange={(e) => {
                                                    const newDiagnosis = (formData?.diagnosis || []).map((item, index) => {
                                                        if (i === index) {
                                                            return { ...item, description: e.target.value };
                                                        }
                                                        return item;
                                                    });

                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        diagnosis: newDiagnosis,
                                                    }));
                                                }}
                                                handleCie10Change={(e) => {
                                                    const newDiagnosis = (formData?.diagnosis || []).map((item, index) => {
                                                        if (i === index) {
                                                            return { ...item, code: e.target.value };
                                                        }
                                                        return item;
                                                    });

                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        diagnosis: newDiagnosis,
                                                    }));
                                                }}
                                                cieValue={formData?.diagnosis?.[i]?.code || ''}
                                            />


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
                                    <div key={i} className="flex flex-col space-y-1">
                                        <InputFieldWithIcon
                                            id="treatment"
                                            placeholder="Ingrese el tratamiento..."
                                            value={formData?.treatment?.[i]?.description || ''}
                                            handleDatachange={(e) => {
                                                const newTreatment = (formData?.treatment || []).map((item, index) => {
                                                    if (i === index) {
                                                        return { description: e.target.value };
                                                    }
                                                    return item;
                                                });

                                                setFormData((prevData) => ({
                                                    ...prevData,
                                                    treatment: newTreatment,
                                                }));
                                            }}
                                        />
                                    </div>

                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}