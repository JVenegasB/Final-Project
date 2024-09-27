import { Divider, SelectTabData, SelectTabEvent, Tab, TabList, TabValue } from "@fluentui/react-components";
import { useEffect, useState } from 'react';
import PatientList from '../components/PatientList.tsx'
import PatientHistory from "../components/PatientHistory.tsx";
import { PatientSummary } from '../types/types.ts'
import AddEvolution from "../components/AddEvolution.tsx"
import { patientList } from '../assets/data/testVals.ts'

import { historiesWithEmptyComponents,evolutionsWithEmptyComponents } from '../assets/data/testVals.ts';

export default function PatientsPage() {
    const [tabSelected, setTabSelected] = useState<TabValue>("viewPatients");
    const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
        setTabSelected(data.value)
    }
    const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(null);
    const [viewDetails, setViewDetails] = useState<boolean>(false);
    const [patientData, setPatientData] = useState<PatientSummary[]>();
    useEffect(() => {
        setPatientData(patientList);
        console.log(historiesWithEmptyComponents);
        console.log(evolutionsWithEmptyComponents);
    }, [])
    return (
        <div className="w-full">
            <div className="">
                <p className="text-4xl font-extrabold text-blue-600 font-roboto pl-3">Pacientes</p>
            </div>
            <Divider className="mt-4"></Divider>
            <div>
                <TabList selectedValue={tabSelected} onTabSelect={onTabSelect} className="flex flex-col m-3 gap-3 font-openSans">
                    <Tab value="viewPatients">
                        <p className={`${tabSelected === "viewPatients" ? "border-b-2 border-blue-500" : ""} hover:text-blue-500 cursor-pointer`}>
                            Ver pacientes
                        </p>
                    </Tab>
                    <Tab value="createPatients">
                        <p className={`${tabSelected === "createPatients" ? "border-b-2 border-blue-500" : ""} hover:text-blue-500 cursor-pointer`}>
                            Crear Pacientes
                        </p>
                    </Tab>
                    <Tab value="uncompletedHistory">
                        <p className={`${tabSelected === "createPatients" ? "border-b-2 border-blue-500" : ""} hover:text-blue-500 cursor-pointer`}>
                            No completadas
                        </p>
                    </Tab>
                </TabList>
            </div>
            <div>
                {tabSelected === "viewPatients" && (
                    <div className={`mx-3  h-full ${viewDetails ? "flex flex-col mb-5" : "grid lg:grid-cols-[1fr_auto_1fr]"}`}>
                        <div className={`max-h-screen overflow-y-auto lg:px-3`}>
                            {!viewDetails ? (
                                <PatientList setSelectedPatient={setSelectedPatient} patientData={patientData} />
                            ) : (
                                <PatientHistory selectedPatient={selectedPatient} viewDetails={viewDetails} setViewDetails={setViewDetails} />
                            )}
                        </div>

                        <div className={`${viewDetails ? ' hidden my-5' : 'lg:flex max-h-[100vh]'}`}>
                            <Divider vertical className="h-full " />
                        </div>

                        {selectedPatient && (
                            !viewDetails ? (
                                <div className="max-h-screen overflow-y-auto lg:pl-3">
                                    <PatientHistory selectedPatient={selectedPatient} viewDetails={viewDetails} setViewDetails={setViewDetails} />
                                </div>
                            ) : (
                                <div className="max-h-screen overflow-y-auto lg:px-3">
                                    <AddEvolution />
                                </div>
                            )

                        )}
                    </div>

                )}
                {tabSelected === "createPatients" && (
                    <div className="mx-3">
                        Contenido para crear pacientes
                    </div>
                )}
                {tabSelected === 'uncompletedHistory' && (
                    <div className="mx-3">
                        Contenido para historias no completadas
                    </div>
                )}
            </div>
        </div>


    )
}