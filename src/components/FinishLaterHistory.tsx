import React, { useEffect, useState } from 'react'
import { TableColumnDefinition, Spinner, createTableColumn, useTableFeatures, useTableSort, TableColumnId, Table, TableHeader, TableHeaderCell, TableRow, TableBody, TableCell, Dialog, DialogContent, DialogBody, DialogTitle, DialogSurface, DialogActions, Button, Divider, Checkbox, Label, useToastController, Toast, ToastTitle, ToastBody, ToastIntent } from "@fluentui/react-components";
import { PatientMainData, PatientSummary } from '../types/types';
import InputFieldToComplete from './InputFieldToComplete';
import InputFieldCie10 from './InputFieldCie10';
import InputFieldWithIcon from './InputFieldWithIcon';
import TextFieldToComplete from './TextFieldToComplete';
import { useLoadingHistContext } from '../context/loadingIncHistContext';
import { client } from '../supabase/client';


const columns: TableColumnDefinition<PatientMainData>[] = [
    createTableColumn<PatientMainData>({
        columnId: 'name',
        compare: (a, b) => a.name.localeCompare(b.name),
    }),
    createTableColumn<PatientMainData>({
        columnId: 'id',
        compare: (a, b) => a.id.localeCompare(b.id),
    }),
    createTableColumn<PatientMainData>({
        columnId: 'first_session',
        compare: (a, b) => a.first_session.localeCompare(b.first_session),
    }),
    createTableColumn<PatientMainData>({
        columnId: 'last_session',
        compare: (a, b) => a.last_session.localeCompare(b.last_session),
    }),
];

interface Props {
    isFinishLaterHistory: PatientMainData[];
    fetchPatientList: () => void;
}

export default function FinishLaterHistory({ isFinishLaterHistory, fetchPatientList }: Props) {
    //Toaster
    const { dispatchToast } = useToastController("global-toaster");
    const showToast = (title: string, description: string, intent: ToastIntent) => {
        dispatchToast(
            <Toast>
                <ToastTitle >{title}</ToastTitle>
                <ToastBody>{description}</ToastBody>

            </Toast>,
            { position: "top-end", intent }
        )
    }
    const [isLoading,] = useLoadingHistContext()
    const { getRows, sort: { getSortDirection, toggleColumnSort, sort }, } = useTableFeatures(
        {
            columns: columns,
            items: isFinishLaterHistory
        },
        [useTableSort({
            defaultSortState: { sortColumn: "file", sortDirection: "ascending" },
        })]
    );
    const headerSortProps = (columnId: TableColumnId) => ({
        onClick: (e: React.MouseEvent) => {
            toggleColumnSort(e, columnId);
        },
        sortDirection: getSortDirection(columnId),
    });
    const rows = sort(getRows());
    //Dialog controls
    const [formData, setFormData] = useState<PatientSummary | null>(null);
    const [formDataMirror, setFormDataMirror] = useState<PatientSummary | null>(null);
    const [open, setOpen] = useState(false);
    const openDialog = (patient_id: number) => {
        setOpen(true)
        fetchSelectedPatientDetails(patient_id);
    };
    const fetchSelectedPatientDetails = async (patient_id: number) => {
        try {
            const { data, error } = await client.functions.invoke(`retrieve-patient-complete-history?patient_id=${patient_id}`,{
                method: 'GET',
            });
            if (error) {
                console.error('Error fetching selected patient details:', error);
                showToast('Error', 'No pudimos obtener los detalles del paciente', 'error');
                return
            }
            const modifiedData = data.map((prevData: PatientSummary) => ({
                ...prevData,
                first_session: prevData.first_session.split('T')[0],
                last_session: prevData.last_session.split('T')[0],
                evolution: Array.isArray(prevData.evolution)
                    ? prevData.evolution.map(evo => ({
                        ...evo,
                        attended_date: evo.attended_date ? evo.attended_date.split('T')[0] : null,
                    }))
                    : null,
            }));
            setFormData(modifiedData[0]);
            setFormDataMirror(modifiedData[0]);
        } catch (err) {
            showToast('Error', 'No pudimos obtener los detalles del paciente', 'error');
            console.error('Error fetching selected patient details:', err);
        }
    }


    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'age' ? Number(value) : value,
        } as PatientSummary));
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
        } as PatientSummary));
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
        } as PatientSummary));
    };

    const [isGinecoObstetric, setIsGinecoObstetric] = useState(false);
    useEffect(() => {
        if (formData?.personal_background.isGinecoObstetric) {
            setIsGinecoObstetric(formData?.personal_background.isGinecoObstetric);
        }
    }, [formData])

    const handleSystemReview = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            system_review: {
                ...prevData?.system_review,
                [name]: value,
            }
        } as PatientSummary));
    }
    const addDiagnosis = () => {
        setFormData((prevData) => ({
            ...prevData,
            diagnosis: [
                ...(prevData?.diagnosis || []),
                { description: '', code: '' }
            ]
        } as PatientSummary));
    };
    const [inputValue2, setInputValue2] = useState<string>('');
    const removeDiagnosis = () => {
        setFormData((prevData) => ({
            ...prevData,
            diagnosis: prevData?.diagnosis ? prevData.diagnosis.slice(0, -1) : []
        } as PatientSummary));
    };
    const addTreatment = () => {
        if (inputValue2.trim() !== '_') {
            setFormData((prevData) => ({
                ...prevData,
                treatment: [
                    ...(prevData?.treatment || []),
                    { description: inputValue2 }
                ]
            } as PatientSummary));

            setInputValue2('');
        }
    };

    const removeTreatment = () => {
        setFormData((prevData) => ({
            ...prevData,
            treatment: prevData?.treatment ? prevData.treatment.slice(0, -1) : []
        } as PatientSummary));
    };

    const closeDialog = () => {
        setOpen(false);
        setFormData(null);
        setFormDataMirror(null);
        setIsGinecoObstetric(false);
        setIsComplete(false);
    }
    const [isSendingData, setIsSendingData] = useState(false);
    const sendData = async () => {
        setIsSendingData(true);
        try {
            const { error } = await client.functions.invoke('update_history', {
                method: 'POST',
                body: JSON.stringify(formData),
            });
            if (error) {
                showToast('Error', 'No pudimos enviar los datos', 'error');
            } else {
                showToast('Exito', 'Historia clinica actualizada', 'success');
                setOpen(false);
                setFormData(null);
                setFormDataMirror(null);
                setIsGinecoObstetric(false);
                setIsComplete(false);
                fetchPatientList();
            }
        } catch (err) {
            console.error('Error sending data:', err)
            showToast('Error', 'No pudimos enviar los datos', 'error');
        } finally {
            setIsSendingData(false);
        }

    }

    const [isComplete, setIsComplete] = useState(false);
    useEffect(() => {
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
                    if (key === 'evolution' || key=== 'paraclinic') {
                        continue; // Ignore 'evolution' field
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
            const completeness = errors.length === 0;
            return { completeness, errors };
        };
        const { completeness } = isComplete();
        setIsComplete(completeness);
    }, [formData])
    return (
        <div>
            <Table id='incompleteHistoryTable'>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell {...headerSortProps("name")}>Nombre</TableHeaderCell>
                        <TableHeaderCell {...headerSortProps("id")}>Cedula</TableHeaderCell>
                        <TableHeaderCell {...headerSortProps("first_session")}>Primera consulta</TableHeaderCell>
                        <TableHeaderCell {...headerSortProps("last_session")}>Ultima consulta</TableHeaderCell>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isFinishLaterHistory === null && <TableRow><TableCell colSpan={3}><Spinner size='extra-large' className='my-12' /></TableCell></TableRow>}
                    {isFinishLaterHistory.length === 0 && <TableRow><TableCell colSpan={3}>No hay historias pendientes</TableCell></TableRow>}
                    {rows.map(({ item }, index) => (
                        <TableRow key={index} onClick={() => openDialog(item.patient_id)}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.first_session}</TableCell>
                            <TableCell>{item.last_session}</TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
            <Dialog open={open}>
                <DialogSurface style={{ width: '70%', maxWidth: '90%' }}>
                    <DialogBody>
                        <DialogTitle>Completar Historia Clinica</DialogTitle>
                        {isLoading ? (
                            <DialogContent className="space-y-5">
                                <Spinner size="extra-large" className="my-12" />
                            </DialogContent>
                        ) : formData ? (
                            <DialogContent>
                                <div className='grid lg:grid-cols-2 grid-cols-1 space-x-2 space-y-1'>
                                    <Divider className='col-span-full' appearance='strong' ><span className='text-xl font-roboto'>Datos personales</span></Divider>

                                    <InputFieldToComplete input={formData?.name} id='name' isComplete={formDataMirror?.name !== ""} type="text" label="Nombre" handleDataChange={handleDataChange} />
                                    <InputFieldToComplete input={formData?.age + ''} id='age' isComplete={formDataMirror?.age !== 0 && formDataMirror?.age !== null} type="number" label="Edad" handleDataChange={handleDataChange} />
                                    <InputFieldToComplete input={formData?.date_of_birth} id='date_of_birth' isComplete={formDataMirror?.date_of_birth !== '' && formDataMirror?.date_of_birth !== null} type="date" label="Fecha de nacimiento" handleDataChange={handleDataChange} />
                                    <InputFieldToComplete input={formData?.occupation} id='occupation' isComplete={formDataMirror?.occupation !== '' && formDataMirror?.occupation !== null} type="text" label="Ocupacion" handleDataChange={handleDataChange} />
                                    <InputFieldToComplete input={formData?.marital_status} id='marital_status' isComplete={formDataMirror?.marital_status !== '' && formDataMirror?.marital_status !== null} type="text" label="marital_status" handleDataChange={handleDataChange} />
                                    <InputFieldToComplete input={formData?.identification} id='identification' isComplete={formDataMirror?.identification !== '' && formDataMirror?.identification !== null} type="text" label="identification" handleDataChange={handleDataChange} />
                                    <div className='col-span-full flex flex-col space-y-1'>
                                        <InputFieldToComplete input={formData?.address} id='address' isComplete={formDataMirror?.address !== '' && formDataMirror?.address !== null} type="text" handleDataChange={handleDataChange} label="Direccion" />
                                        <InputFieldToComplete input={formData?.phone} id='phone' isComplete={formDataMirror?.phone !== '' && formDataMirror?.phone !== null} type="text" handleDataChange={handleDataChange} label="Teléfono" />
                                        <InputFieldToComplete input={formData?.email} id='email' isComplete={formDataMirror?.email !== '' && formDataMirror?.email !== null} type="text" handleDataChange={handleDataChange} label="Correo electrónico" />
                                        <InputFieldToComplete input={formData?.religious_belief} id='religious_belief' isComplete={formDataMirror?.religious_belief !== '' && formDataMirror?.religious_belief !== null} type="text" handleDataChange={handleDataChange} label="Creencia religiosa" />
                                        <Divider className='pt-3' appearance='strong'><span className='text-xl font-roboto'>Motivo de consulta</span></Divider>
                                        <InputFieldToComplete input={formData?.motive} id='motive' isComplete={formDataMirror?.motive !== '' && formDataMirror?.motive !== null} type="text" handleDataChange={(e) => setFormData({ ...formData, motive: e.target.value } as PatientSummary)} label="Motivo de consulta" />
                                        <Divider className='pt-3' appearance='strong'><span className='text-xl font-roboto'>Enfermedad actual</span></Divider>
                                        <InputFieldToComplete input={formData?.current_illness} id='currentIllness' isComplete={formDataMirror?.current_illness !== '' && formDataMirror?.current_illness !== null} type="text" handleDataChange={(e) => setFormData({ ...formData, current_illness: e.target.value } as PatientSummary)} label="Enfermedad actual" />
                                        <Divider className='pt-3' appearance='strong'><span className='text-xl font-roboto'>Antecedentes personales</span></Divider>
                                        <InputFieldToComplete input={formData?.personal_background?.pathological} id='pathological' isComplete={formDataMirror?.personal_background?.pathological !== '' && formDataMirror?.personal_background?.pathological !== null} type="text" handleDataChange={handlePersonalBackground} label="Patológicos" />
                                        <InputFieldToComplete input={formData?.personal_background?.pharmacological} id='pharmacological' isComplete={formDataMirror?.personal_background?.pharmacological !== '' && formDataMirror?.personal_background?.pharmacological !== null} type="text" handleDataChange={handlePersonalBackground} label="Farmacológicos" />
                                        <InputFieldToComplete input={formData?.personal_background?.surgical} id='surgical' isComplete={formDataMirror?.personal_background?.surgical !== '' && formDataMirror?.personal_background?.surgical !== null} type="text" handleDataChange={handlePersonalBackground} label="Quirúrgicos" />
                                        <InputFieldToComplete input={formData?.personal_background?.trauma} id='trauma' isComplete={formDataMirror?.personal_background?.trauma !== '' && formDataMirror?.personal_background?.trauma !== null} type="text" handleDataChange={handlePersonalBackground} label="Trauma" />
                                        <InputFieldToComplete input={formData?.personal_background?.allergic} id='allergic' isComplete={formDataMirror?.personal_background?.allergic !== '' && formDataMirror?.personal_background?.allergic !== null} type="text" handleDataChange={handlePersonalBackground} label="Alérgicos" />
                                        <InputFieldToComplete input={formData?.personal_background?.toxic} id='toxic' isComplete={formDataMirror?.personal_background?.toxic !== '' && formDataMirror?.personal_background?.toxic !== null} type="text" handleDataChange={handlePersonalBackground} label="Tóxicos" />
                                        <InputFieldToComplete input={formData?.personal_background?.hospitalary} id='hospitalary' isComplete={formDataMirror?.personal_background?.hospitalary !== '' && formDataMirror?.personal_background?.hospitalary !== null} type="text" handleDataChange={handlePersonalBackground} label="Hospitalarios" />
                                        <Checkbox label={'Es gineco-obstetrico?'} onChange={() => setIsGinecoObstetric(!isGinecoObstetric)} checked={isGinecoObstetric} />
                                        {!isGinecoObstetric ? null : (
                                            <div className='col-span-full flex flex-col space-y-1 items-center'>
                                                <Label>Gineco-Obstetrico</Label>
                                                <div className='grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 w-full gap-x-4'>
                                                    <Label className='col-span-full mb-3'>Formula obstetrica</Label>
                                                    <InputFieldToComplete input={formData?.personal_background?.gestations?.toString()} id='gestations' isComplete={formDataMirror?.personal_background?.gestations !== null} type='number' label='Gestaciones' handleDataChange={handlePersonalBackground} />
                                                    <InputFieldToComplete input={formData?.personal_background?.births?.toString()} id='births' isComplete={formDataMirror?.personal_background?.births !== null} type='number' label='Partos' handleDataChange={handlePersonalBackground} />
                                                    <InputFieldToComplete input={formData?.personal_background?.caesarean?.toString()} id='caesarean' isComplete={formDataMirror?.personal_background?.caesarean !== null} type='number' label='Cesareas' handleDataChange={handlePersonalBackground} />
                                                    <InputFieldToComplete input={formData?.personal_background?.abortions?.toString()} id='abortions' isComplete={formDataMirror?.personal_background?.abortions !== null} type='number' label='Abortos' handleDataChange={handlePersonalBackground} />
                                                    <InputFieldToComplete input={formData?.personal_background?.last_menstruation} id='last_menstruation' isComplete={formDataMirror?.personal_background?.last_menstruation !== '' && formDataMirror?.personal_background?.last_menstruation !== null} type='text' label='Ultima menstruacion' handleDataChange={handlePersonalBackground} />
                                                    <InputFieldToComplete input={formData?.personal_background?.cycles} id='cycles' isComplete={formDataMirror?.personal_background?.cycles !== '' && formDataMirror?.personal_background?.cycles !== null} type='text' label='Ciclos' handleDataChange={handlePersonalBackground} />
                                                    <InputFieldToComplete input={formData?.personal_background?.menarche} id='menarche' isComplete={formDataMirror?.personal_background?.menarche !== '' && formDataMirror?.personal_background?.menarche !== null} type='text' label='Menarquia' handleDataChange={handlePersonalBackground} />
                                                    <InputFieldToComplete input={formData?.personal_background?.planification} id='planification' isComplete={formDataMirror?.personal_background?.planification !== '' && formDataMirror?.personal_background?.planification !== null} type='text' label='Planificacion' handleDataChange={handlePersonalBackground} />
                                                    <InputFieldToComplete input={formData?.personal_background?.pap_smear} id='pap_smear' isComplete={formDataMirror?.personal_background?.pap_smear !== '' && formDataMirror?.personal_background?.pap_smear !== null} type='text' label='Ultimo papanicolau' handleDataChange={handlePersonalBackground} />
                                                    <div className='col-span-full'>
                                                        <TextFieldToComplete label='Observaciones' id='observations' placeholder='Ingrese observaciones...' isComplete={formDataMirror?.personal_background?.observations !== '' && formDataMirror?.personal_background?.observations !== null} handleDataChange={(e) => setFormData({ ...formData, personal_background: { ...formData?.personal_background, observations: e.target.value } } as PatientSummary)} input={formData?.personal_background?.observations || ''} />

                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <Divider className="pt-3" appearance="strong"><span className="text-xl font-roboto">Antecedentes familiares</span></Divider>
                                        <InputFieldToComplete
                                            input={formData?.family_background}
                                            id="family_background"
                                            isComplete={formDataMirror?.family_background !== ""}
                                            type="text"
                                            label="Antecedentes familiares"
                                            handleDataChange={(e) => setFormData({ ...formData, family_background: e.target.value } as PatientSummary)}
                                        />
                                        <Divider className="pt-3" appearance="strong"><span className="text-xl font-roboto">Revision por sistemas</span></Divider>
                                        <div className="col-span-full space-y-1 items-center grid lg:grid-cols-2 grid-cols-1 w-full gap-x-4">
                                            <InputFieldToComplete input={formData?.system_review?.skin} id="skin" isComplete={formDataMirror?.system_review?.skin !== ""} type="text" label="Piel y Fanera" handleDataChange={handleSystemReview} />
                                            <InputFieldToComplete input={formData?.system_review?.genitourinary} id="genitourinary" isComplete={formDataMirror?.system_review?.genitourinary !== ""} type="text" label="Genitourinario" handleDataChange={handleSystemReview} />
                                            <InputFieldToComplete input={formData?.system_review?.collagen} id="collagen" isComplete={formDataMirror?.system_review?.collagen !== ""} type="text" label="Colageno" handleDataChange={handleSystemReview} />
                                            <InputFieldToComplete input={formData?.system_review?.musculoskeletal} id="musculoskeletal" isComplete={formDataMirror?.system_review?.musculoskeletal !== ""} type="text" label="Musculoesqueletico" handleDataChange={handleSystemReview} />
                                            <InputFieldToComplete input={formData?.system_review?.lymphatic} id="lymphatic" isComplete={formDataMirror?.system_review?.lymphatic !== ""} type="text" label="Linfatico" handleDataChange={handleSystemReview} />
                                            <InputFieldToComplete input={formData?.system_review?.feeding} id="feeding" isComplete={formDataMirror?.system_review?.feeding !== ""} type="text" label="Alimentacion" handleDataChange={handleSystemReview} />
                                            <InputFieldToComplete input={formData?.system_review?.cardiac} id="cardiac" isComplete={formDataMirror?.system_review?.cardiac !== ""} type="text" label="Cardiaco" handleDataChange={handleSystemReview} />
                                            <InputFieldToComplete input={formData?.system_review?.sleep} id="sleep" isComplete={formDataMirror?.system_review?.sleep !== ""} type="text" label="Sueño" handleDataChange={handleSystemReview} />
                                            <InputFieldToComplete input={formData?.system_review?.nervous} id="nervous" isComplete={formDataMirror?.system_review?.nervous !== "" && formDataMirror?.system_review?.nervous !== null } type="text" label="Nervioso" handleDataChange={handleSystemReview} />
                                            <InputFieldToComplete input={formData?.system_review?.physical_activity} id="physical_activity" isComplete={formDataMirror?.system_review?.physical_activity !== ""} type="text" label="Actividad fisica" handleDataChange={handleSystemReview} />
                                            <InputFieldToComplete input={formData?.system_review?.respiratory} id="respiratory" isComplete={formDataMirror?.system_review?.respiratory !== ""} type="text" label="Respiratorio" handleDataChange={handleSystemReview} />
                                            <InputFieldToComplete input={formData?.system_review?.psychosocial} id="psychosocial" isComplete={formDataMirror?.system_review?.psychosocial !== ""} type="text" label="Psicosocial" handleDataChange={handleSystemReview} />
                                            <InputFieldToComplete input={formData?.system_review?.digestive} id="digestive" isComplete={formDataMirror?.system_review?.digestive !== ""} type="text" label="Digestivo" handleDataChange={handleSystemReview} />
                                            <InputFieldToComplete input={formData?.system_review?.senses} id="senses" isComplete={formDataMirror?.system_review?.senses !== ""} type="text" label="Sentidos" handleDataChange={handleSystemReview} />
                                            <InputFieldToComplete input={formData?.system_review?.blood} id="blood" isComplete={formDataMirror?.system_review?.blood !== "" && formDataMirror?.system_review?.blood !== null} type="text" label="Sangre" handleDataChange={handleSystemReview} />
                                        </div>
                                        <Divider className='py-3' appearance='strong'><span className='text-xl font-roboto'>Familiograma</span></Divider>
                                        <InputFieldToComplete input={formData?.familiogram} id='familiogram' isComplete={formDataMirror?.familiogram !== ""} type='text' label='Familiograma' handleDataChange={(e) => setFormData({ ...formData, familiogram: e.target.value } as PatientSummary)} />

                                        <Divider className='py-3' appearance='strong'><span className='text-xl font-roboto'>Examen fisico</span></Divider>
                                        <div className='grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 w-full gap-x-4'>
                                            <InputFieldToComplete input={formData?.physical_exam?.heart_rate?.toString()} id='heart_rate' isComplete={formDataMirror?.physical_exam?.heart_rate !== 0 && formDataMirror?.physical_exam?.heart_rate !== null} type='number' label='Frecuencia cardiaca (lpm)' handleDataChange={handlePhysicalExam} />
                                            <InputFieldToComplete input={formData?.physical_exam?.respiratory_rate?.toString()} id='respiratory_rate' isComplete={formDataMirror?.physical_exam?.respiratory_rate !== 0 && formDataMirror?.physical_exam?.respiratory_rate !== null} type='number' label='Frecuencia respiratoria (rpm)' handleDataChange={handlePhysicalExam} />
                                            <InputFieldToComplete input={formData?.physical_exam?.blood_pressure} id='blood_pressure' isComplete={formDataMirror?.physical_exam?.blood_pressure !== ""} type='text' label='Tension arterial' handleDataChange={handlePhysicalExam} />
                                            <InputFieldToComplete input={formData?.physical_exam?.saturation?.toString()} id='saturation' isComplete={formDataMirror?.physical_exam?.saturation !== 0 && formDataMirror?.physical_exam?.saturation !== null} type='number' label='Saturacion' handleDataChange={handlePhysicalExam} />
                                            <InputFieldToComplete input={formData?.physical_exam?.temperature?.toString()} id='temperature' isComplete={formDataMirror?.physical_exam?.temperature !== 0 && formDataMirror?.physical_exam?.temperature !== null} type='number' label='Temperatura (C)' handleDataChange={handlePhysicalExam} />
                                            <InputFieldToComplete input={formData?.physical_exam?.weight?.toString()} id='weight' isComplete={formDataMirror?.physical_exam?.weight !== 0 && formDataMirror?.physical_exam?.weight !== null} type='number' label='Peso (kg)' handleDataChange={handlePhysicalExam} />
                                            <InputFieldToComplete input={formData?.physical_exam?.size?.toString()} id='size' isComplete={formDataMirror?.physical_exam?.size !== 0 && formDataMirror?.physical_exam?.size !== null} type='number' label='Talla (m)' handleDataChange={handlePhysicalExam} />
                                            <InputFieldToComplete input={formData?.physical_exam?.imc?.toString()} id='imc' isComplete={formDataMirror?.physical_exam?.imc !== 0 && formDataMirror?.physical_exam?.imc !== null} type='number' label='IMC' handleDataChange={handlePhysicalExam} />
                                        </div>
                                        <InputFieldToComplete input={formData?.physical_exam?.physical_exam} id='physical_exam' isComplete={formDataMirror?.physical_exam?.physical_exam !== ""} type='text' label='Examen Fisico' handleDataChange={(e) => setFormData({ ...formData, physical_exam: { ...formData?.physical_exam, physical_exam: e.target.value } } as PatientSummary)} />
                                        <Divider className='pt-3' appearance='strong'><span className='text-xl font-roboto'>Diagnostico</span></Divider>
                                        <div className='col-span-full'>
                                            <div className='grid grid-cols-2 gap-4'>
                                                <Button onClick={addDiagnosis}>Agregar diagnostico</Button>
                                                <Button onClick={removeDiagnosis}>Remover diagnostico</Button>
                                                <div className='col-span-2 space-y-2'>
                                                    {formData?.diagnosis?.map((_, i) => (
                                                        <div key={i} className='flex flex-col space-y-2'>
                                                            <InputFieldCie10
                                                                id={`diagnostic-${i}`}
                                                                placeholder="Ingrese el diagnostico..."
                                                                value={formData?.diagnosis?.[i]?.description || ''}
                                                                handleDatachange={(e) => {
                                                                    const newDiagnosis = formData?.diagnosis.map((item, index) =>
                                                                        index === i ? { ...item, description: e.target.value } : item
                                                                    );

                                                                    setFormData((prevData) => ({
                                                                        ...prevData,
                                                                        diagnosis: newDiagnosis,
                                                                    } as PatientSummary));
                                                                }}
                                                                handleCie10Change={(e) => {
                                                                    const newDiagnosis = formData?.diagnosis.map((item, index) =>
                                                                        index === i ? { ...item, code: e.target.value } : item
                                                                    );

                                                                    setFormData((prevData) => ({
                                                                        ...prevData,
                                                                        diagnosis: newDiagnosis,
                                                                    } as PatientSummary));
                                                                }}
                                                                cieValue={formData?.diagnosis?.[i]?.code || ''}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <Divider className='py-3' appearance='strong'>
                                            <span className='text-xl font-roboto'>Tratamiento</span>
                                        </Divider>
                                        <div className='grid grid-cols-2 gap-4'>
                                            <Button onClick={addTreatment}>Agregar tratamiento</Button>
                                            <Button onClick={removeTreatment}>Remover tratamiento</Button>
                                            <div className='col-span-2 space-y-2 mb-5'>
                                                {formData?.treatment?.map((_, i) => (
                                                    <div key={i} className="flex flex-col space-y-2">
                                                        <InputFieldWithIcon
                                                            id={`treatment-${i}`}
                                                            placeholder="Ingrese el tratamiento..."
                                                            value={formData?.treatment?.[i]?.description || ''}
                                                            handleDatachange={(e) => {
                                                                const newTreatment = formData?.treatment.map((item, index) =>
                                                                    index === i ? { description: e.target.value } : item
                                                                );

                                                                setFormData((prevData) => ({
                                                                    ...prevData,
                                                                    treatment: newTreatment,
                                                                } as PatientSummary));
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        ) : (<DialogContent className='space-y-5'><Spinner size='extra-large' className='my-12' /></DialogContent>)

                        }

                        <DialogActions>
                            <Button onClick={() => closeDialog()} appearance='secondary'>Cerrar</Button>
                            <Button appearance='primary' onClick={() => sendData()} disabled={!isComplete || isSendingData}>{isSendingData ? "Enviando..." : "Enviar"}</Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </div>
    )
}
