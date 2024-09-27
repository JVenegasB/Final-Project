import { Divider } from "@fluentui/react-components";
import { useEffect, useState } from "react";

export default function AddEvolution() {
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
    
        console.log(formattedDateTime);
        setFormData((prevData) => ({
            ...prevData,
            date: formattedDateTime
        }));
    }, []);

    const handleSubmit = () => {
        const emptyFields = Object.entries(formData).filter(([key, value]) => {
            if (key === 'isAlternative') return false;
            return value === "";
        });

        if (emptyFields.length > 0) {
            console.log("Campos vacíos: ",emptyFields);
        } else {
            console.log("Enviando datos", formData);
        }
    }
    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        console.log('A')
        const isValid = Object.values(formData).every(value => {
            if (formData.isAlternative === false && value === formData.alternative) {
              return true;
            }
            return value !== "";
          });
      
          setIsFormValid(isValid);
    },[formData])
    
    return (
        <div className="border-black border-2 rounded-xl h-full mt-10">
            <div className="flex flex-row items-center w-full border-b-2 border-black h-12">
                <div className={`w-2/12 flex justify-center px-2 py-3 border-r-2 border-black hover:bg-customHover rounded-tl-xl font-roboto ${formData.isAlternative && 'bg-blue-600 text-white'}`} onClick={() => showAlternative()}>
                    <button >Proceso alternativo</button>
                </div>
                <div className="w-8/12 flex justify-center font-roboto font-bold text-xl">
                    Evolución
                </div>
                <div className="w-2/12 flex justify-center px-2 py-3 border-l-2 border-black hover:bg-customHover rounded-tr-xl" onClick={() => handleSubmit()}>
                    <button >{isFormValid ? ("Guardar"):("Terminar mas tarde")}</button>
                </div>
            </div>

            <div className="max-h-[80vh] overflow-y-auto px-10">


                <div className="flex flex-col mt-5">
                    <label htmlFor="date">Fecha:</label>
                    <input
                        type="datetime-local"
                        name="date"
                        id="date"
                        value={formData.date}
                        className="w-1/4 bg-customButton rounded-md"
                        onChange={handleInputChange}
                    />
                </div>

                <div className="flex flex-col mt-5">
                    <label htmlFor="motive">Motivo de consulta:</label>
                    <textarea
                        id="motive"
                        name="motive"
                        value={formData.motive}
                        onChange={handleInputChange}
                        className="w-full bg-customButton rounded-md p-2 resize-none"
                        rows={3}
                        style={{ overflow: "hidden" }}
                        placeholder="Escribe el motivo de la consulta..."
                    />
                </div>

                <div className="flex flex-col mt-5">
                    <label htmlFor="illness">Enfermedad actual:</label>
                    <textarea
                        id="illness"
                        name="currentIllness"
                        value={formData.currentIllness}
                        onChange={handleInputChange}
                        className="w-full bg-customButton rounded-md p-2 resize-none"
                        rows={3}
                        style={{ overflow: "hidden" }}
                        placeholder="Describe la enfermedad actual..."
                    />
                </div>

                <div className="flex flex-col mt-5">
                    <label htmlFor="physicalExam">Examen fisico</label>
                    <textarea
                        id="physicalExam"
                        name="physicalExam"
                        value={formData.physicalExam}
                        onChange={handleInputChange}
                        className="w-full bg-customButton rounded-md p-2 resize-none"
                        rows={3}
                        style={{ overflow: "hidden" }}
                        placeholder="Describe el resultado del examen fisico..."
                    />
                </div>
                <div className="flex flex-col mt-5">
                    <label htmlFor="diagnosis">Diagnostico:</label>
                    <textarea
                        id="diagnosis"
                        name="diagnosis"
                        value={formData.diagnosis}
                        onChange={handleInputChange}
                        className="w-full bg-customButton rounded-md p-2 resize-none"
                        rows={3}
                        style={{ overflow: "hidden" }}
                        placeholder="Describe el diagnostico..."
                    />
                </div>
                <div className="flex flex-col mt-5">
                    <label htmlFor="plan">Plan:</label>
                    <textarea
                        id="plan"
                        name="plan"
                        value={formData.plan}
                        onChange={handleInputChange}
                        className="w-full bg-customButton rounded-md p-2 resize-none"
                        rows={3}
                        style={{ overflow: "hidden" }}
                        placeholder="Describe el plan..."
                    />
                </div>
                <div className="flex flex-col my-5">
                    <label htmlFor="annotation">Anotaciones:</label>
                    <textarea
                        id="annotation"
                        name="annotation"
                        value={formData.annotation}
                        onChange={handleInputChange}
                        className="w-full bg-customButton rounded-md p-2 resize-none"
                        rows={3}
                        style={{ overflow: "hidden" }}
                        placeholder="Escribir anotaciones..."
                    />
                </div>
                
                {formData.isAlternative && (
                    <div className="mt-3">
                        <Divider/>
                        <div className="flex flex-col mb-10 mt-5">
                        <label htmlFor="alternative">Ingrese terapia alternativa</label>
                        <textarea
                            name="alternative"
                            id="alternative"
                            value={formData.alternative}
                            onChange={handleInputChange}
                            className="w-full bg-customButton rounded-md p-2 resize-none"
                            rows={3}
                            style={{ overflow: "hidden" }}
                            placeholder="Ingrese terapia alternativa..."
                        />
                    </div>
                    </div>
                )}
            </div>
        </div>
    );
}
