import { Button, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Switch } from "@fluentui/react-components";
import { useThemeContext } from "../context/themeContext";
import { client } from '../supabase/client'
import { useEffect, useState } from "react";
import { Table } from '@fluentui/react-components'

interface SettingsComponentProps {
  company_id?: number;
  isClinicMember?: boolean | null;
  userRole?: string;
}

interface JoinRequestType {
  decision_date: string,
  requested_date: string,
  status: string,
  user_name: string,
  user_id: string,
  clinic_id: number,
  id: number
}


export default function SettingsComponent({ company_id, isClinicMember, userRole }: SettingsComponentProps) {
  const { isDarkMode, setIsDarkMode } = useThemeContext();
  const [clinicRequestList, setClinicRequestList] = useState<JoinRequestType[]>([])
  const fetchJoinRequests = async () => {
    const { data: clinic, error } = await client.from('join_requests').select('*').eq('clinic_id', company_id)
    if (error) {
      console.error('Error fetching data: ', error)
    } else {
      setClinicRequestList(clinic)
    }
  }

  useEffect(() => {
    if (isClinicMember) {
      fetchJoinRequests()
    }
  }, [])
  useEffect(() => {
    console.log(userRole)
  }, [userRole])

  const handleAcceptRequest = async (request_id: number) => {
    console.log(request_id)
    const { data: requestData, error } = await client.from('join_requests').select('*').eq('id', request_id).single()
    if (error) {
      console.error('Error fetching request data: ', error)
    } else {
      console.log('Request data: ', requestData)
      const { data: userData, error } = await client.from('users').select('*').eq('user_id', requestData.user_id).single()
      if (error) {
        console.error('Error fetching user data: ', error)
      } else {
        const { error } = await client.from('clinic_users').insert([
          {
            user_id: userData.user_id,
            clinic_id: company_id,
          }
        ])
        if (error) {
          console.error('Error creating clinic user: ', error)
        } else {
          console.log('Clinic user created')
          const { error } = await client.from('join_requests').update({
            status: 'approved',
            decision_date: new Date().toISOString()
          }).eq('id', request_id)
          if (error) {
            console.error('Error updating join request: ', error)
          } else {
            console.log('Join request updated')
            fetchJoinRequests()
          }
        }
      }
    }
  }
  const handleRejectRequest = async (request_id: number) => {

      const { error } = await client.from('join_requests').update({
        status: 'rejected',
        decision_date: new Date().toISOString()
      }).eq('id', request_id)
      if (error) {
        console.error('Error updating join request: ', error)
      } else {
        console.log('Join request rejected')
        fetchJoinRequests()
      }
  }

  return (
    <div className={`h-full m-3 ${isDarkMode ? "bg-thirdBgDark" : "bg-white"}`}>
      <h1 className={`text-4xl font-bold font-roboto p-5 ${isDarkMode ? "text-white" : "text-blue-900"}`}>Configuraciones</h1>
      <div className="grid lg:grid-cols-2 grid-cols-1 ">
        <div className={`m-3 p-3 ${isDarkMode ? "bg-secondaryBgDark" : "bg-secondaryBgLight"} rounded-md`}>
          <h2 className='my-3 font-roboto text-2xl'>Tema</h2>
          <Switch labelPosition="before" label={`${isDarkMode ? 'Modo oscuro' : 'Modo claro'}`} onChange={() => setIsDarkMode(!isDarkMode)} />
        </div>
        {(isClinicMember && userRole === 'admin') &&
          <div className={`m-3 p-3 ${isDarkMode ? "bg-secondaryBgDark" : "bg-secondaryBgLight"} rounded-md `}>
            <div className="flex flex-row justify-between">
              <h2 className="py-2 px-1 font-roboto text-lg">Solicitud de ingreso</h2>
              <Button onClick={() => fetchJoinRequests()}>Refresh</Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell className="w-36">Usuario</TableHeaderCell>
                    <TableHeaderCell className="w-56">Fecha de solicitud</TableHeaderCell>
                    <TableHeaderCell className="w-36">Estado</TableHeaderCell>
                    <TableHeaderCell className="w-36">Acciones</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clinicRequestList.map((request, index) => (
                    <TableRow key={index}>
                      <TableCell>{request.user_name}</TableCell>
                      <TableCell>{request.requested_date}</TableCell>
                      <TableCell>{request.status}</TableCell>
                      <TableCell>
                        {request.status === 'requested' ? <>
                          <Button onClick={() => handleAcceptRequest(request.id)}>Aceptar</Button>
                          <Button onClick={() => handleRejectRequest(request.id)}>Rechazar</Button>
                        </> : <div className="italic">{request.status}</div>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

          </div>}
        <div className={`m-3 p-3 ${isDarkMode ? "bg-secondaryBgDark" : "bg-secondaryBgLight"} rounded-md col-span-full`}>
          Editar usuario
          <div>
            Formulario para editar usuario
          </div>
        </div>
      </div>

    </div>
  )
}