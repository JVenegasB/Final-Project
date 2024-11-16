import { Table, TableHeader, TableRow, TableHeaderCell, TableBody, TableCell, InfoLabel, Button } from "@fluentui/react-components";
import { useThemeContext } from "../context/themeContext";
import { useState } from "react";
import InputFieldWithIcon from "../components/InputFieldWithIcon";
import { client } from "../supabase/client";
import { Session } from "@supabase/supabase-js";
import { useClinicContext } from '../context/clinicContext.ts';
import FinishLater from "../components/FinishLater.tsx";
import { EvolutionToComplete, PatientMainData } from "../types/types.ts";

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


export default function MainElementPage({ isClinicMember, userJoinRequests, userSession, userName, fetchPatientList, isFinishLaterEvolution, isFinishLaterHistory, fetchFinishLaterEvolutions }: MainElementPageType) {
    const [clinicName] = useClinicContext();
    const { isDarkMode, } = useThemeContext();
    const [joinRequestCode, setJoinRequestCode] = useState('')

    const sendJoinRequest = async () => {
        //validate code exists
        const { data: clinic, error } = await client.from('clinic').select('*').eq('unique_code', joinRequestCode).single()
        if (clinic) {
            console.log('Clinic found')
            const { data, error } = await client.from('join_requests').insert([
                {
                    user_id: userSession?.user.id,
                    clinic_id: clinic.id,
                    user_name: userName
                }
            ])
            if (error) {
                console.log('Error creating join request', error)
            } else {
                console.log('Join request created')
                console.log('Data from request: ', data)
            }
        }
        if (error) {
            console.error('Error finding clinic', error)
        }
    }
    return (
        <div className={`h-full m-3 ${isDarkMode ? "bg-thirdBgDark" : "bg-white"}`}>
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
                            <div className={`m-3 p-3 ${isDarkMode ? "bg-secondaryBgDark" : "bg-secondaryBgLight"} rounded-md`}>

                                <p>Solicitud rechazada. Ingresa otro codigo para entrar:</p>
                                <InfoLabel info={
                                    <>
                                        <p>Solicite al administrador de la empresa el codigo de identificacion.</p>
                                        <p>Este se encuentra en la esquina superior derecha de la pantalla de inicio.</p>
                                    </>
                                }>
                                    Ingrese el codigo identificador de la empresa
                                </InfoLabel>
                                <InputFieldWithIcon id='companyCode' placeholder='Codigo de empresa' value={joinRequestCode} handleDatachange={(e) => setJoinRequestCode(e.target.value)} />
                                <Button onClick={sendJoinRequest}>Enviar solicitud</Button>
                            </div>
                        }
                    </> : <>
                        <h1 className={`text-4xl font-bold font-roboto ${isDarkMode ? "text-white" : "text-blue-900"}`}>Bienvenido a {clinicName?.name}</h1>
                        <FinishLater isFinishLaterEvolution={isFinishLaterEvolution} isFinishLaterHistory={isFinishLaterHistory} fetchPatientList={fetchPatientList} fetchFinishLaterEvolutions={fetchFinishLaterEvolutions} />

                    </>
                }
            </div>
        </div>
    )
}
