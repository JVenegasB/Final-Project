import { Button, Input, Label, Textarea } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { ArrowLeft20Regular,Save20Regular,SaveArrowRight20Regular,ContentView20Regular,AddCircle20Regular } from '@fluentui/react-icons';
import { PatientSummary } from "../types/types";
import PatientHistory from "./PatientHistory";
import ConfirmationDialogs from "./ConfirmationDialogs";

interface Props {
    patientData: PatientSummary | null;
    setAddEvolutionComponent: (value: string) => void;
}

export default function AddEvolution({ patientData, setAddEvolutionComponent }: Props) {
    const [formData, setFormData] = useState({
        date: "",
        motive: "",
        currentIllness: "",
        physicalExam: "",
        diagnosis: "",
        plan: "",
        isAlternative: false,
        alternative: "",
        annotation: "",
        finishLater: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const textarea = e.target;

        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
        setFormData({
            ...formData,
            [name]: value
        });
    }
    const showAlternative = () => {
        setFormData({
            ...formData,
            isAlternative: !formData.isAlternative
        });
    }

    useEffect(() => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // getMonth() es 0-indexado
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

        setFormData((prevData) => ({
            ...prevData,
            date: formattedDateTime
        }));
    }, []);

    const handleSubmit = () => {
        console.log("Enviando datos", formData);
    }
    const handleSubmitLater = () => {
        setFormData({
            ...formData,
            finishLater: true
        })
        console.log("Enviando datos para continuar mas tarde", formData);
    }
    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        const isValid = Object.entries(formData).every(([key, value]) => {
            if (key === 'annotation') return true;
            if (formData.isAlternative === false && key === 'alternative') return true;
            return value !== "";
        })
        setIsFormValid(isValid);
    }, [formData]);

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const handlePatientDetails = () => {
        setOpenDialog(true);
    }
    
    const returnToMainPage = () => {
        setAddEvolutionComponent("list");
    }
    return (
        <div className="flex flex-col flex-grow h-full w-full px-5">

            <div className="flex ">
                

                <ConfirmationDialogs props={{valid:true,buttonDescription:'Volver',description:'Esta seguro que desea volver? los cambios no se guardaran a menos que los envie',mainButtonText:'Volver a la lista de pacientes',secondaryButtonText:"Seguir con la evolucion",title:'Confirmacion de retorno',mainFunction:returnToMainPage, icon:(<ArrowLeft20Regular/>)}} />
                <ConfirmationDialogs props={{valid: isFormValid, mainFunction: handleSubmit, buttonDescription: 'Guardar', description: 'Esta seguro que desea enviar la evolucion medica? Una vez enviada no podra ser modificada', mainButtonText: 'Enviar', title: 'Confirmacion de envio de Evolucion', secondaryButtonText: 'Volver',icon:(<Save20Regular/>) }} />
                <ConfirmationDialogs props={{valid: true, buttonDescription: 'Continuar mas tarde', description: '¿Estás seguro de que deseas guardar la evolución y continuar más tarde? Esto solo se puede hacer una vez', mainButtonText: 'Enviar para continuar mas tarde', mainFunction: handleSubmitLater, secondaryButtonText: 'Volver', title: 'Confirmacion para continuar mas tarde',icon:(<SaveArrowRight20Regular/>) }} />

                <Button
                    onClick={handlePatientDetails}
                    icon={<ContentView20Regular/>}
                >
                    Ver detalles de historia clinica
                </Button>
                <Button
                    onClick={showAlternative}
                    appearance={`${formData.isAlternative ? "primary" : "secondary"}`}
                    icon={<AddCircle20Regular/>}
                >
                    Agregar terapia alternativa
                </Button>
            </div>
            <div className="w-full">
                <h1 className="font-roboto text-2xl mt-5">Crear historia para <span className="font-bold">{patientData?.personalData.name} - {patientData?.personalData.identification}</span></h1>
            </div>
            <PatientHistory open={openDialog} setOpen={setOpenDialog} selectedPatient={patientData} />

            <div className="overflow-y-auto flex flex-col">
                <div className="flex flex-col mt-5">
                    <Label htmlFor="date">Fecha:</Label>
                    <Input
                        type="datetime-local"
                        name="date"
                        id="date"
                        value={formData.date}
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
                        style={{ overflow: "hidden" }}
                        placeholder="Escribe el motivo de la consulta..."
                        resize="both"
                    />
                </div>

                <div className="flex flex-col mt-5">
                    <Label htmlFor="illness">Enfermedad actual:</Label>
                    <Textarea
                        id="illness"
                        name="currentIllness"
                        value={formData.currentIllness}
                        onChange={handleInputChange}
                        rows={3}
                        style={{ overflow: "hidden" }}
                        placeholder="Describe la enfermedad actual..."
                        resize="both"
                    />
                </div>

                <div className="flex flex-col mt-5">
                    <Label htmlFor="physicalExam">Examen fisico</Label>
                    <Textarea
                        id="physicalExam"
                        name="physicalExam"
                        value={formData.physicalExam}
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
                {formData.isAlternative && (
                    <div className="">
                        <div className="flex flex-col mb-10 mt-5">
                            <Label htmlFor="alternative">Ingrese terapia alternativa</Label>
                            <Textarea
                                name="alternative"
                                id="alternative"
                                value={formData.alternative}
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
            {/* 
            <div className="max-h-[80vh] overflow-y-auto px-10">

                
                
                
            </div> */}
        </div>
    );
}
