import { SelectTabData, SelectTabEvent, Tab, TabList, TabValue } from "@fluentui/react-components";
import { useEffect, useState } from 'react';
import PatientList from '../components/PatientList.tsx'
import { PatientSummary } from '../types/types.ts'
import { patientList } from '../assets/data/testVals.ts'
import { useThemeContext } from "../context/themeContext.ts";
import AddEvolution from "../components/AddEvolution.tsx";
import ExportPDF from "../components/ExportPDF.tsx";
import NewPatient from "../components/NewPatient.tsx";
export default function PatientsPage() {
    const { isDarkMode } = useThemeContext();
    const [tabSelected, setTabSelected] = useState<TabValue>("viewPatients");
    const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
        setTabSelected(data.value)
        setAddEvolutionComponent("list");
        setSelectedPatient(null);
    }
    const [patientData, setPatientData] = useState<PatientSummary[]>([]);
    useEffect(() => {
        setPatientData(patientList);
        console.log(patientList);
    }, [])

    const [addEvolutionComponent, setAddEvolutionComponent] = useState<string>("list");
    const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(null);

    useEffect(() => {
        if (selectedPatient && addEvolutionComponent) {
            console.log("going to edit selected patient: ", selectedPatient);
        }
    }, [selectedPatient, addEvolutionComponent])

    const [exportType, setExportType] = useState<string>("");
    return (
        <div className={`h-full m-3 ${isDarkMode ? "bg-thirdBgDark" : "bg-white"}`}>
            <div>
                <p className={`text-4xl font-bold font-roboto pl-3 pt-5 ${isDarkMode ? "text-white" : "text-blue-900"}`}>Pacientes</p>
            </div>
            <div>
                <TabList selectedValue={tabSelected} onTabSelect={onTabSelect} className="flex flex-col m-3 gap-3 font-lato overflow-x-auto">
                    <Tab value="viewPatients">Ver pacientes</Tab>
                    <Tab value="createPatients">Crear paciente</Tab>
                    <Tab value="uncompletedHistory">Terminar más tarde</Tab>
                </TabList>
            </div>
            <div className="flex">
                {tabSelected === "viewPatients" && (
                    <div className='max-h-[calc(100vh-250px)] w-full'>
                        {addEvolutionComponent === "list" ? (
                                <PatientList patientData={patientData} setAddEvolutionComponent={setAddEvolutionComponent} fatherSetSelectedPatient={setSelectedPatient} setExportType={setExportType} />
                        ) : (null)}
                        {addEvolutionComponent === "evolution" ? (
                                <AddEvolution patientData={selectedPatient} setAddEvolutionComponent={setAddEvolutionComponent} />
                        ) : (null)}
                        {addEvolutionComponent === "export" ? (
                                <ExportPDF patientData={selectedPatient} exportType={exportType} setAddEvolutionComponent={setAddEvolutionComponent} />
                        ) : (null)}

                    </div>
                )}
                {tabSelected === "createPatients" && (
                    <div className='max-h-[calc(100vh-250px)] w-full'>
                        <NewPatient />
                    </div>

                )}
                {tabSelected === 'uncompletedHistory' && (
                    <div className="max-h-[calc(100vh-250px)] mx-3">Contenido para historias no completadas</div>
                )}
            </div>
        </div>

    )
}
