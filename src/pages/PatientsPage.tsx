import { SelectTabData, SelectTabEvent, Tab, TabList, TabValue, useToastController, Toast, ToastTitle, ToastBody, ToastIntent, Dialog, DialogSurface, DialogBody, DialogContent, DialogTitle, DialogActions, Button } from "@fluentui/react-components";
import { useEffect, useRef, useState } from 'react';
import PatientList from '../components/PatientList.tsx'
import { EvolutionToComplete, PatientMainData, PatientSummary } from '../types/types.ts'
import { useThemeContext } from "../context/themeContext.ts";
import AddEvolution from "../components/AddEvolution.tsx";
import ExportPDF from "../components/ExportPDF.tsx";
import NewPatient from "../components/NewPatient.tsx";
import PatientHistory from "../components/PatientHistory.tsx";
import FinishLater from '../components/FinishLater.tsx';
import { client } from "../supabase/client.ts";

interface PatientsPageProps {
    fetchPatientList: () => void;
    patientData: PatientMainData[];
    setPatientData: (data: PatientMainData[]) => void;
    isFinishLaterEvolution: EvolutionToComplete[];
    isFinishLaterHistory: PatientMainData[];
    fetchFinishLaterEvolutions: () => void;
}

export default function PatientsPage({ fetchPatientList, patientData, isFinishLaterEvolution, isFinishLaterHistory, fetchFinishLaterEvolutions }: PatientsPageProps) {
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
    //Theme contest
    const { isDarkMode } = useThemeContext();
    //Change values to change tab
    const [tabSelected, setTabSelected] = useState<TabValue>("viewPatients");
    const [tabToView, setTabToView] = useState<SelectTabData>();
    const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
        if (isFieldFilled) {
            setOpen(true);
            setTabToView(data);
            return;
        } else {
            changeTab(data);
        }
    }
    const [open, setOpen] = useState<boolean>(false);
    //Variable to store a patients complete history
    const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(null);
    //Store in cache queried patients
    const patientCache = useRef<{ [key: number]: { data: PatientSummary } }>({});
    const fetchParaclinicsUrl = async (url: string) => {
        const { data: signedUrlData, error: signedUrlError } = await client.storage.from('Paraclinics').createSignedUrl(url, 60 * 60 * 18)
        if (signedUrlError) {
            console.error('Error getting signed url', signedUrlError)
            showToast('Error al obtener los datos', signedUrlError.message, 'error')
            return
        }
        return signedUrlData?.signedUrl;
    }
    //fetched patient details from id
    const fetchSelectedPatientDetails = async (patient_id: number, forceRefresh = false) => {
        //validate if patient has been fetched before
        const cachedData = patientCache.current[patient_id];
        if (cachedData && !forceRefresh) {
            setSelectedPatient(cachedData.data);
            return;
        }
        //fetch patient
        try {
            const { data, error } = await client.functions.invoke(`retrieve-patient-complete-history?patient_id=${patient_id}`, {
                method: 'GET',
            })

            if (error) {
                console.error('Error fetching selected patient details:', error);
                showToast("Error", "Error al cargar el historial del paciente seleccionado", 'error');
                return;
            }
            let updatedData; // Declare updatedData outside the blocks

            if (data[0].paraclinic && data[0].paraclinic.length > 0) {
                const paraclinicsToViewTemp = [];
                for (const paraclinic of data[0].paraclinic) {
                    const realUrl = await fetchParaclinicsUrl(paraclinic.content_url);
                    paraclinicsToViewTemp.push({
                        ...paraclinic,
                        real_url: realUrl,
                    });
                }
                updatedData = {
                    ...data[0],
                    paraclinic: paraclinicsToViewTemp,
                };
            } else {
                updatedData = {
                    ...data[0],
                };
            }
            patientCache.current[patient_id] = { data: updatedData };
            setSelectedPatient(updatedData);
        } catch (err) {
            console.error('Error fetching selected patient details:', err);
            showToast("Error", "Error al cargar el historial del paciente", 'error');
        }
    }

    //variable to variate content displayed in view Patient tab
    const [changeViewPatientContent, setChangeViewPatientContent] = useState<string>("list");
    //variable to store selected patient id
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

    //Dialog to show patients detailed history
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const fetchPatientAndOpenDialog = async (patient_id: number) => {
        setSelectedPatientId(patient_id);
        setOpenDialog(true);
        fetchSelectedPatientDetails(patient_id);
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
    };
    //store and change values of finish later histories and evolutions
    const [pendingSum, setPendingSum] = useState<number>(0);
    useEffect(() => {
        setPendingSum(isFinishLaterEvolution.length + isFinishLaterHistory.length);
    }, [isFinishLaterEvolution, isFinishLaterHistory]);
    //Define the type of export the user selected
    const [exportType, setExportType] = useState<string>("");

    //when createPatients tab is selected and a field id filled, user is prompted a warning if changing tabs
    const [isFieldFilled, setIsFieldFilled] = useState<boolean>(false);

    const changeTab = (data: SelectTabData) => {
        setOpen(false);
        setIsFieldFilled(false);
        setTabSelected(data.value)
        setChangeViewPatientContent("list");
    }
    const handleDialogConfirm = () => {
        if (tabToView) {
            changeTab(tabToView);
        }
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
                    <Tab value="uncompletedHistory">Pendientes ({pendingSum})</Tab>
                </TabList>
            </div>
            <div className="flex">
                {tabSelected === "viewPatients" && (
                    <div className='max-h-[calc(100vh-250px)] w-full'>
                        {changeViewPatientContent === "list" ? (
                            <PatientList patientData={patientData} setAddEvolutionComponent={setChangeViewPatientContent} fatherSetSelectedPatient={fetchPatientAndOpenDialog} setExportType={setExportType} setSelectedPatient={setSelectedPatientMainData} fetchPatientAndExport={fetchPatientAndExport} fetchPatientList={fetchPatientList} />
                        ) : (null)}
                        {changeViewPatientContent === "evolution" ? (
                            <AddEvolution patientData={selectedPatientMainData} setAddEvolutionComponent={setChangeViewPatientContent} fetchPatientAndOpenDialog={fetchPatientAndOpenDialog} clearPatientCache={clearPatientCache} fetchFinishLaterEvolutions={fetchFinishLaterEvolutions} setChangeViewPatientContent={setChangeViewPatientContent} />
                        ) : (null)}
                        {changeViewPatientContent === "export" ? (
                            selectedPatient && (
                                <ExportPDF patientData={selectedPatient} exportType={exportType} setAddEvolutionComponent={setChangeViewPatientContent} />
                            )
                        ) : (null)}

                    </div>
                )}
                {tabSelected === "createPatients" && (
                    <div className='max-h-[calc(100vh-250px)] w-full'>
                        <NewPatient fetchPatientList={fetchPatientList} setTabSelected={setTabSelected} setIsFieldFilled={setIsFieldFilled} />
                        <div>
                            <Dialog open={open}>
                                <DialogSurface>
                                    <DialogBody>
                                        <DialogTitle>
                                            <div>Advertencia</div>
                                        </DialogTitle>
                                        <DialogContent>
                                            <div>Si cambias de pestaña perderas la informacion ingresada</div>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button appearance="secondary" onClick={() => setOpen(false)}>Volver</Button>
                                            <Button appearance="primary" onClick={handleDialogConfirm}>Continuar</Button>
                                        </DialogActions>
                                    </DialogBody>
                                </DialogSurface>
                            </Dialog>
                        </div>
                    </div>
                )}
                {tabSelected === 'uncompletedHistory' && (
                    <div className="max-h-[calc(100vh-250px)] w-full">
                        <FinishLater isFinishLaterEvolution={isFinishLaterEvolution} isFinishLaterHistory={isFinishLaterHistory} fetchPatientList={fetchPatientList} fetchFinishLaterEvolutions={fetchFinishLaterEvolutions} />
                    </div>
                )}
            </div>
            {(openDialog === true) &&
                <PatientHistory open={openDialog} setOpen={setOpenDialog} selectedPatient={selectedPatient} fetchSelectedPatientDetails={fetchSelectedPatientDetails} selectedPatientId={selectedPatientId} />
            }
        </div>

    )
}
