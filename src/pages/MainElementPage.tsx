import { Table, TableHeader, TableRow, TableHeaderCell, TableBody, TableCell } from "@fluentui/react-components";
import { useThemeContext } from "../context/themeContext";

import { Session } from "@supabase/supabase-js";
import { useClinicContext } from '../context/clinicContext.ts';
import FinishLater from "../components/FinishLater.tsx";
import { EvolutionToComplete, PatientMainData } from "../types/types.ts";
import ClinicSendJoinRequest from "../components/ClinicSendJoinRequest.tsx";
import ClinicCreationComponent from "../components/ClinicCreationComponent.tsx";

interface MainElementPageType {
    isClinicMember: boolean | null;
    userJoinRequests?: JoinRequestType[]
    userSession: Session | null
    userName?: string
    fetchPatientList: () => void;
    setPatientData: (data: PatientMainData[]) => void;
    isFinishLaterEvolution: EvolutionToComplete[];
    isFinishLaterHistory: PatientMainData[];
    fetchFinishLaterEvolutions: () => void;
    fetchClinicUserData: (session: Session) => void;
    fetchUserJoinRequests: (session: Session) => void;
}

interface JoinRequestType {
    id: number;
    user_id: string;
    clinic_id: number;
    status: string;
    requested_date: string;
    clinic: clinic
}
interface clinic {
    name: string
}


export default function MainElementPage({ isClinicMember, userJoinRequests, userSession, userName, fetchPatientList, isFinishLaterEvolution, isFinishLaterHistory, fetchFinishLaterEvolutions,fetchClinicUserData,fetchUserJoinRequests }: MainElementPageType) {
    const [clinicName] = useClinicContext();
    const { isDarkMode, } = useThemeContext();
    return (
        <div className={`h-full m-3 ${isDarkMode ? "bg-thirdBgDark" : "bg-customBg"} max-h-[calc(100vh-10px)] overflow-y-auto`}>
            <div className='p-5'>
                {!isClinicMember ?
                    <>
                        <h1 className={`text-4xl font-bold font-roboto ${isDarkMode ? "text-white" : "text-blue-900"}`}>Bienvenido</h1>
                        <p>No te encuentras asociado a ningun consultorio</p>

                        <div className={`m-3 p-3 ${isDarkMode ? "bg-secondaryBgDark" : "bg-secondaryBgLight"} rounded-md overflow-x-auto`}>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHeaderCell className="w-36">Consultorio</TableHeaderCell>
                                        <TableHeaderCell className="w-56">Fecha de solicitud</TableHeaderCell>
                                        <TableHeaderCell className="w-36">Estado</TableHeaderCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {userJoinRequests?.map((request: JoinRequestType, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell>{request.clinic.name}</TableCell>
                                            <TableCell>{request.requested_date}</TableCell>
                                            <TableCell>{request.status}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {!userJoinRequests?.some((request) => request.status === 'accepted' || request.status === 'requested') &&
                            <>
                                <div className={`m-3 p-3 ${isDarkMode ? "bg-secondaryBgDark" : "bg-secondaryBgLight"} rounded-md`}>
                                    <p className="font-roboto text-lg my-2">No tienes solicitudes pentiendes</p>
                                    <ClinicSendJoinRequest userSession={userSession} userName={userName} fetchUserJoinRequests={fetchUserJoinRequests}/>
                                </div>
                                <div className={`m-3 p-3 ${isDarkMode ? "bg-secondaryBgDark" : "bg-secondaryBgLight"} rounded-md`}>
                                    <p className="font-roboto text-lg my-2">O create un consultorio</p>
                                    <ClinicCreationComponent userSession={userSession} fetchClinicUserData={fetchClinicUserData}/>
                                </div>
                            </>

                        }
                    </> : <>
                        <h1 className={`text-4xl font-bold font-roboto ${isDarkMode ? "text-white" : "text-blue-900"} my-7`}>Bienvenido a {clinicName?.name}</h1>
                        <FinishLater isFinishLaterEvolution={isFinishLaterEvolution} isFinishLaterHistory={isFinishLaterHistory} fetchPatientList={fetchPatientList} fetchFinishLaterEvolutions={fetchFinishLaterEvolutions}/>

                    </>
                }
            </div>
        </div>
    )
}
