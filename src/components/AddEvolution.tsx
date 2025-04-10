import { Button, Input, Label, Textarea, useToastController, Toast, ToastTitle, ToastBody, ToastIntent } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { ArrowLeft20Regular, Save20Regular, SaveArrowRight20Regular, ContentView20Regular, AddCircle20Regular } from '@fluentui/react-icons';
import { PatientMainData } from "../types/types";
import ConfirmationDialogs from "./ConfirmationDialogs";
import { EvolutionType } from "../types/types";
import { client } from '../supabase/client';

interface Props {
    patientData: PatientMainData | null;
    setAddEvolutionComponent: (value: string) => void;
    fetchPatientAndOpenDialog: (patient_id: number) => void;
    clearPatientCache: (patient_id: number) => void;
    fetchFinishLaterEvolutions: () => void;
    setChangeViewPatientContent: (value: string) => void;
}

export default function AddEvolution({ patientData, setAddEvolutionComponent, fetchPatientAndOpenDialog, clearPatientCache, fetchFinishLaterEvolutions,setChangeViewPatientContent }: Props) {
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
    //Store form data
    const [formData, setFormData] = useState<EvolutionType>({
        attended_date: '',
        current_illness: '',
        diagnosis: '',
        is_alternative: false,
        is_finish_later: false,
        motive: '',
        patient_id: patientData?.patient_id || 0,
        physical_exam: '',
        plan: '',
        therapy: ''
    });
    //Function to handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }
    //Function to show alternative therapy
    const showAlternative = () => {
        setFormData({
            ...formData,
            is_alternative: !formData.is_alternative,
            therapy: ''
        });
    }
    //Set current date
    useEffect(() => {
        const currentDate = new Date();
        const localISOTime = new Date(
            currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
        ).toISOString().slice(0, 16);
        setFormData((prevData) => ({
            ...prevData,
            attended_date: localISOTime
        }));
    }, []);
    //Submit evolution
    const submitEvolution = async (data: EvolutionType) => {
        const { error } = await client.rpc("add_patient_evolution", {
            attended_date: data.attended_date,
            current_illness: data.current_illness,
            diagnosis: data.diagnosis,
            is_alternative: data.is_alternative,
            is_finish_later: data.is_finish_later,
            motive: data.motive,
            patient_id: data.patient_id,
            physical_exam: data.physical_exam,
            plan: data.plan,
            therapy: data.therapy,
        });
        if (error) {
            console.error('Error submitting evolution:', error);
            showToast('Error', 'No se pudo enviar la evolucion', 'error')
            return;
        } else {
            showToast('Evolucion enviada', 'La evolucion se envio correctamente', 'success')
            setFormData({
                attended_date: '',
                current_illness: '',
                diagnosis: '',
                is_alternative: false,
                is_finish_later: false,
                motive: '',
                patient_id: patientData?.patient_id || 0,
                physical_exam: '',
                plan: '',
                therapy: ''
            })
            fetchFinishLaterEvolutions();
            clearPatientCache(data.patient_id);
            setChangeViewPatientContent('list');
        }
    }
    //Handle submit
    const handleSubmit = () => {
        const dataToSend = { ...formData, is_finish_later: false };
        setFormData(dataToSend)
        submitEvolution(dataToSend);
    }
    //Handle submit later
    const handleSubmitLater = () => {
        const dataToSend = { ...formData, is_finish_later: true };
        setFormData(dataToSend)
        submitEvolution(dataToSend);
    }
    //Check if form is valid and enable buttons
    const [isFormValid, setIsFormValid] = useState(false);
    const [isFormFilled, setIsFormFilled] = useState(false);
    useEffect(() => {
        const hasEmptyFields = (data: EvolutionType): boolean => {
            for (const key in data) {
                const value = data[key as keyof EvolutionType];

                if (key === 'therapy' && !data.is_alternative) {
                    continue;
                }
                if (value === '' || value === undefined || value === null) {
                    return true;
                }
            }
            return false;
        };
        if (formData.attended_date !== '') {
            setIsFormFilled(true);
        }
        setIsFormValid(!hasEmptyFields(formData));
    }, [formData]);

    //Handle patient details
    const handlePatientDetails = () => {
        fetchPatientAndOpenDialog(patientData?.patient_id || 0);
    }
    //Return to main page
    const returnToMainPage = () => {
        setAddEvolutionComponent("list");
    }
    return (
        <div className="flex flex-col flex-grow h-full w-full px-5">
            <div className="flex min-h-[31px] w-full items-center">


                <ConfirmationDialogs props={{ valid: true, buttonDescription: 'Volver', description: 'Esta seguro que desea volver? los cambios no se guardaran a menos que los envie', mainButtonText: 'Volver a la lista de pacientes', secondaryButtonText: "Seguir con la evolucion", title: 'Confirmacion de retorno', mainFunction: returnToMainPage, icon: (<ArrowLeft20Regular />) }} />
                <ConfirmationDialogs props={{ valid: isFormValid, mainFunction: handleSubmit, buttonDescription: 'Guardar', description: 'Esta seguro que desea enviar la evolucion medica? Una vez enviada no podra ser modificada', mainButtonText: 'Enviar', title: 'Confirmacion de envio de Evolucion', secondaryButtonText: 'Volver', icon: (<Save20Regular />) }} />
                <ConfirmationDialogs props={{ valid: isFormFilled, buttonDescription: 'Continuar mas tarde', description: '¿Estás seguro de que deseas guardar la evolución y continuar más tarde? Esto solo se puede hacer una vez y no podra modificar los campos que ya fueron llenados', mainButtonText: 'Enviar para continuar mas tarde', mainFunction: handleSubmitLater, secondaryButtonText: 'Volver', title: 'Confirmacion para continuar mas tarde', icon: (<SaveArrowRight20Regular />) }} />

                <Button
                    onClick={handlePatientDetails}
                    icon={<ContentView20Regular />}
                    className="min-h-[30px]"
                    size="medium"
                >
                    Ver detalles de historia clinica
                </Button>
                <Button
                    onClick={showAlternative}
                    appearance={`${formData.is_alternative ? "primary" : "secondary"}`}
                    icon={<AddCircle20Regular />}
                    className="min-h-[30px]"
                    size="medium"
                >
                    Agregar terapia alternativa
                </Button>
            </div>
            <div className="w-full">
                <h1 className="font-roboto text-2xl mt-5">Crear evolucion para <span className="font-bold">{patientData?.name} - {patientData?.id}</span></h1>
            </div>

            <div className="overflow-y-auto flex flex-col">
                <div className="flex flex-col mt-5">
                    <Label htmlFor="attended_date">Fecha:</Label>
                    <Input
                        type="datetime-local"
                        name="attended_date"
                        id="attended_date"
                        value={formData.attended_date}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="flex flex-col mt-5">
                    <Label htmlFor="motive">Motivo de consulta:</Label>
                    <Textarea
                        id="motive"
                        name="motive"
                        value={formData.motive}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Escribe el motivo de la consulta..."
                        resize="vertical"
                    />
                </div>

                <div className="flex flex-col mt-5">
                    <Label htmlFor="current_illness">Enfermedad actual:</Label>
                    <Textarea
                        id="current_illness"
                        name="current_illness"
                        value={formData.current_illness}
                        onChange={handleInputChange}
                        rows={3}
                        style={{ overflow: "hidden" }}
                        placeholder="Describe la enfermedad actual..."
                        resize="both"
                    />
                </div>

                <div className="flex flex-col mt-5">
                    <Label htmlFor="physical_exam">Examen fisico</Label>
                    <Textarea
                        id="physical_exam"
                        name="physical_exam"
                        value={formData.physical_exam}
                        onChange={handleInputChange}
                        rows={3}
                        style={{ overflow: "hidden" }}
                        placeholder="Describe el resultado del examen fisico..."
                        resize="both"
                    />
                </div>
                <div className="flex flex-col mt-5">
                    <Label htmlFor="diagnosis">Diagnostico:</Label>
                    <Textarea
                        id="diagnosis"
                        name="diagnosis"
                        value={formData.diagnosis}
                        onChange={handleInputChange}
                        rows={3}
                        style={{ overflow: "hidden" }}
                        placeholder="Describe el diagnostico..."
                        resize="both"
                    />
                </div>
                <div className="flex flex-col my-5">
                    <Label htmlFor="plan">Plan:</Label>
                    <Textarea
                        id="plan"
                        name="plan"
                        value={formData.plan}
                        onChange={handleInputChange}
                        rows={3}
                        style={{ overflow: "hidden" }}
                        placeholder="Describe el plan..."
                        resize="both"
                    />
                </div>
                {formData.is_alternative && (
                    <div className="">
                        <div className="flex flex-col mb-10 mt-5">
                            <Label htmlFor="therapy">Ingrese terapia alternativa</Label>
                            <Textarea
                                name="therapy"
                                id="therapy"
                                value={formData.therapy}
                                onChange={handleInputChange}
                                rows={3}
                                style={{ overflow: "hidden" }}
                                placeholder="Ingrese terapia alternativa..."
                                resize="both"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
