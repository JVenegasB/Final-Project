import { SelectTabData, SelectTabEvent, Tab, TabList, TabValue } from "@fluentui/react-components";
import { useEffect, useRef, useState } from 'react';
import PatientList from '../components/PatientList.tsx'
import { PatientMainData, PatientSummary } from '../types/types.ts'
import { useThemeContext } from "../context/themeContext.ts";
import AddEvolution from "../components/AddEvolution.tsx";
import ExportPDF from "../components/ExportPDF.tsx";
import NewPatient from "../components/NewPatient.tsx";
import { useClinicContext } from "../context/clinicContext.ts";
import PatientHistory from "../components/PatientHistory.tsx";



export default function PatientsPage() {
    const [clinicData] = useClinicContext();
    const { isDarkMode } = useThemeContext();
    const [tabSelected, setTabSelected] = useState<TabValue>("viewPatients");
    const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
        setTabSelected(data.value)
        setAddEvolutionComponent("list");
    }
    const [patientData, setPatientData] = useState<PatientMainData[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<PatientSummary[] | null>(null);
    const fetchPatientList = async () => {
        if(clinicData === null){
            console.error('No clinic data found');
            return;
        }
        const url = `http://127.0.0.1:54321/functions/v1/fetchMainUserData?clinicid=${clinicData.id}`;
        try {
            const res = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
            const data = await res.json();
            const modifiedData = data.map((prevData: PatientMainData) => ({
                ...prevData,
                first_session: prevData.first_session.split('T')[0],
                last_session: prevData.last_session.split('T')[0]
            }))
            setPatientData(modifiedData);
        } catch (err) {
            console.error('Error fetching patient list:', err);
        }
    }

    useEffect(() => {
        fetchPatientList()
    }, [])

    const patientCache = useRef<{ [key: number]: { data: PatientSummary[] } }>({});
    const fetchSelectedPatientDetails = async (patient_id: number, forceRefresh = false) => {
        console.log("Cache:", patientCache.current);
        const cachedData = patientCache.current[patient_id];
        if (cachedData && !forceRefresh) {
            console.log('Using Cache');
            setSelectedPatient(cachedData.data);
            return;
        }

        const url = `http://127.0.0.1:54321/functions/v1/retrieve-patient-complete-history?patient_id=${patient_id}`;
        try {
            console.log('Fetching selected patient details from service');
            const res = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await res.json();
            const modifiedData = data.map((prevData: PatientSummary) => ({
                ...prevData,
                first_session: prevData.first_session.split('T')[0],
                last_session: prevData.last_session.split('T')[0],
                evolution: prevData.evolution
                    ? prevData.evolution.map(evo => ({
                          ...evo,
                          attended_date: evo.attended_date ? evo.attended_date.split('T')[0] : null,
                      }))
                    : null,
            }));
            patientCache.current[patient_id] = { data: modifiedData };

            setSelectedPatient(modifiedData);
        } catch (err) {
            console.error('Error fetching selected patient details:', err);
        }
    }

    const [addEvolutionComponent, setAddEvolutionComponent] = useState<string>("list");
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);


    const [exportType, setExportType] = useState<string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const fetchPatientAndOpenDialog = async (patient_id: number) => {
        console.log('fetching patient and opening dialog');
        fetchSelectedPatientDetails(patient_id);
        setOpenDialog(true);
        setSelectedPatientId(patient_id);
    }
    const fetchPatientAndExport = (patient_id:number) => {
        fetchSelectedPatientDetails(patient_id);

    }
    const [selectedPatientMainData, setSelectedPatientMainData] = useState<PatientMainData | null>(null);
    useEffect(() => {
        console.log(selectedPatient)
    },[selectedPatient])
    const clearPatientCache = (patient_id: number) => {
        delete patientCache.current[patient_id];
        console.log(`Cache cleared for patient_id: ${patient_id}`);
    };
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
                            <PatientList patientData={patientData} setAddEvolutionComponent={setAddEvolutionComponent} fatherSetSelectedPatient={fetchPatientAndOpenDialog} setExportType={setExportType} setSelectedPatient={setSelectedPatientMainData} fetchPatientAndExport={fetchPatientAndExport}/>
                        ) : (null)}
                        {addEvolutionComponent === "evolution" ? (
                                <AddEvolution patientData={selectedPatientMainData} setAddEvolutionComponent={setAddEvolutionComponent} fetchPatientAndOpenDialog={fetchPatientAndOpenDialog} clearPatientCache={clearPatientCache}/>
                        ) : (null)}
                        {addEvolutionComponent === "export" ? (
                                selectedPatient && selectedPatient.length > 0 && (
                                    <ExportPDF patientData={selectedPatient[0]} exportType={exportType} setAddEvolutionComponent={setAddEvolutionComponent} />
                                )
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
            {selectedPatient!==null &&
                <PatientHistory open={openDialog} setOpen={setOpenDialog} selectedPatient={selectedPatient[0]} fetchSelectedPatientDetails={fetchSelectedPatientDetails} selectedPatientId={selectedPatientId}/>
            }
        </div>

    )
}
