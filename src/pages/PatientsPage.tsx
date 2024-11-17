import { SelectTabData, SelectTabEvent, Tab, TabList, TabValue } from "@fluentui/react-components";
import { useEffect, useRef, useState } from 'react';
import PatientList from '../components/PatientList.tsx'
import { EvolutionToComplete, PatientMainData, PatientSummary } from '../types/types.ts'
import { useThemeContext } from "../context/themeContext.ts";
import AddEvolution from "../components/AddEvolution.tsx";
import ExportPDF from "../components/ExportPDF.tsx";
import NewPatient from "../components/NewPatient.tsx";
import PatientHistory from "../components/PatientHistory.tsx";
import FinishLater from '../components/FinishLater.tsx';

interface PatientsPageProps {
    fetchPatientList: () => void;
    patientData: PatientMainData[];
    setPatientData: (data: PatientMainData[]) => void;
    isFinishLaterEvolution: EvolutionToComplete[];
    isFinishLaterHistory: PatientMainData[];
    fetchFinishLaterEvolutions: () => void;
}


export default function PatientsPage({ fetchPatientList, patientData, /*setPatientData,*/ isFinishLaterEvolution, isFinishLaterHistory,fetchFinishLaterEvolutions }: PatientsPageProps) {
    //Theme contest
    const { isDarkMode } = useThemeContext();
    //Change values to change tab
    const [tabSelected, setTabSelected] = useState<TabValue>("viewPatients");
    const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
        setTabSelected(data.value)
        setChangeViewPatientContent("list");
    }
    //Variable to store a patients complete history
    const [selectedPatient, setSelectedPatient] = useState<PatientSummary[] | null>(null);
    //Store in cache queried patients
    const patientCache = useRef<{ [key: number]: { data: PatientSummary[] } }>({});
    //fetched patient details from id
    const fetchSelectedPatientDetails = async (patient_id: number, forceRefresh = false) => {
        //validate if patient has been fetched before
        console.log("Cache:", patientCache.current);
        const cachedData = patientCache.current[patient_id];
        if (cachedData && !forceRefresh) {
            console.log('Using Cache');
            setSelectedPatient(cachedData.data);
            return;
        }
        //fetch patient
        //Maybe not needed edge function here?
        const url = `http://127.0.0.1:54321/functions/v1/retrieve-patient-complete-history?patient_id=${patient_id}`;
        try {
            console.log('Fetching selected patient details from service');
            const res = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await res.json();
            //Format patients data
            const modifiedData = data.map((prevData: PatientSummary) => ({
                ...prevData,
                first_session: prevData.first_session,
                last_session: prevData.last_session,
                evolution: Array.isArray(prevData.evolution)
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
    //variable to variate content displayed in view Patient tab
    const [changeViewPatientContent, setChangeViewPatientContent] = useState<string>("list");
    //variable to store selected patient id
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

    //Dialog to show patients detailed history
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const fetchPatientAndOpenDialog = async (patient_id: number) => {
        fetchSelectedPatientDetails(patient_id);
        setOpenDialog(true);
        setSelectedPatientId(patient_id);
    }
    //Fetch patient data to export it into other page
    const fetchPatientAndExport = (patient_id: number) => {
        fetchSelectedPatientDetails(patient_id);
    }
    //store patients header data
    const [selectedPatientMainData, setSelectedPatientMainData] = useState<PatientMainData | null>(null);
    //given a patient id, remove it from cache
    const clearPatientCache = (patient_id: number) => {
        delete patientCache.current[patient_id];
        console.log(`Cache cleared for patient_id: ${patient_id}`);
    };
    //store and change values of finish later histories and evolutions
    const [pendingSum, setPendingSum] = useState<number>(0);
    useEffect(() => {
        setPendingSum(isFinishLaterEvolution.length + isFinishLaterHistory.length);
    }, [isFinishLaterEvolution, isFinishLaterHistory]);
    //Define the type of export the user selected
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
                    <Tab value="uncompletedHistory">Terminar más tarde ({pendingSum})</Tab>
                </TabList>
            </div>
            <div className="flex">
                {tabSelected === "viewPatients" && (
                    <div className='max-h-[calc(100vh-250px)] w-full'>
                        {changeViewPatientContent === "list" ? (
                            <PatientList patientData={patientData} setAddEvolutionComponent={setChangeViewPatientContent} fatherSetSelectedPatient={fetchPatientAndOpenDialog} setExportType={setExportType} setSelectedPatient={setSelectedPatientMainData} fetchPatientAndExport={fetchPatientAndExport} />
                        ) : (null)}
                        {changeViewPatientContent === "evolution" ? (
                            <AddEvolution patientData={selectedPatientMainData} setAddEvolutionComponent={setChangeViewPatientContent} fetchPatientAndOpenDialog={fetchPatientAndOpenDialog} clearPatientCache={clearPatientCache} fetchFinishLaterEvolutions={fetchFinishLaterEvolutions}/>
                        ) : (null)}
                        {changeViewPatientContent === "export" ? (
                            selectedPatient && selectedPatient.length > 0 && (
                                <ExportPDF patientData={selectedPatient[0]} exportType={exportType} setAddEvolutionComponent={setChangeViewPatientContent} />
                            )
                        ) : (null)}

                    </div>
                )}
                {tabSelected === "createPatients" && (
                    <div className='max-h-[calc(100vh-250px)] w-full'>
                        <NewPatient fetchPatientList={fetchPatientList}/>
                    </div>
                )}
                {tabSelected === 'uncompletedHistory' && (
                    <div className="max-h-[calc(100vh-250px)] w-full">
                        <FinishLater isFinishLaterEvolution={isFinishLaterEvolution} isFinishLaterHistory={isFinishLaterHistory} fetchPatientList={fetchPatientList} fetchFinishLaterEvolutions={fetchFinishLaterEvolutions}/>
                    </div>
                )}
            </div>
            {(selectedPatient !== null) &&
                <PatientHistory open={openDialog} setOpen={setOpenDialog} selectedPatient={selectedPatient[0]} fetchSelectedPatientDetails={fetchSelectedPatientDetails} selectedPatientId={selectedPatientId} />
            }
        </div>

    )
}
