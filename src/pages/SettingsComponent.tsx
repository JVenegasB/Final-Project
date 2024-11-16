import { Button, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Switch } from "@fluentui/react-components";
import { useThemeContext } from "../context/themeContext";
import { client } from '../supabase/client'
import { useEffect, useState } from "react";
import { Table } from '@fluentui/react-components'
import UserDataChangeComponent from "../components/UserDataChangeComponent";
import CompanyDataChangeComponent from '../components/CompanyDataChangeComponent';
import { useClinicContext } from '../context/clinicContext.ts';
import { useUserContext } from '../context/userContext.ts';


interface SettingsComponentProps {
  isClinicMember?: boolean | null;
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


export default function SettingsComponent({ isClinicMember }: SettingsComponentProps) {
  //context data
  const [user] = useUserContext();
  const [clinicData] = useClinicContext();
  const { isDarkMode, setIsDarkMode } = useThemeContext();
  //Store values from form
  const [clinicRequestList, setClinicRequestList] = useState<JoinRequestType[]>([])
  //Get join request users company
  const fetchJoinRequests = async () => {
    const { data: clinic, error } = await client.from('join_requests').select('*').eq('clinic_id', clinicData?.id)
    if (error) {
      console.error('Error fetching data: ', error)
    } else {
      setClinicRequestList(clinic)
    }
  }

  //Fetch on load
  useEffect(() => {
    if (isClinicMember) {
      fetchJoinRequests()
    }
  }, [])

  //Accept request from user
  const handleAcceptRequest = async (request_id: number) => {
    //change to edge function
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
            clinic_id: clinicData?.id,
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
  //Reject join request
  const handleRejectRequest = async (request_id: number) => {
    //Move to edge function
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
    <div className={`h-full m-3 ${isDarkMode ? "bg-thirdBgDark" : "bg-white"} max-h-[calc(100vh-90px)] overflow-y-auto`}>
      <h1 className={`text-4xl font-bold font-roboto p-5 ${isDarkMode ? "text-white" : "text-blue-900"}`}>Configuraciones</h1>
      <div className="grid lg:grid-cols-2 grid-cols-1 ">
        <div className={`m-3 p-3 ${isDarkMode ? "bg-secondaryBgDark" : "bg-secondaryBgLight"} rounded-md ${!(isClinicMember && user?.role === 'admin') && 'col-span-full'}`}>
          <h2 className='my-3 font-roboto text-2xl'>Tema</h2>
          <Switch labelPosition="before" label={`${isDarkMode ? 'Modo oscuro' : 'Modo claro'}`} onChange={() => setIsDarkMode(!isDarkMode)} />
        </div>

        <div className={`m-3 p-3 ${isDarkMode ? "bg-secondaryBgDark" : "bg-secondaryBgLight"} rounded-md ${!(isClinicMember && user?.role === 'admin') && 'col-span-full'}`}>
          <h2 className='my-3 font-roboto text-2xl'>Editar datos de usuario</h2>
          <div >
            <UserDataChangeComponent />
          </div>
        </div>
        {(isClinicMember && user?.role === 'admin') &&
          <div className={`m-3 p-3 ${isDarkMode ? "bg-secondaryBgDark" : "bg-secondaryBgLight"} rounded-md `}>
            <div className="flex flex-row justify-between">
              <h2 className='my-3 font-roboto text-2xl'>Solicitud de ingreso</h2>
              <Button onClick={() => fetchJoinRequests()}>recargar</Button>
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

          </div>
        }
        {(isClinicMember && user?.role === 'admin') &&
          <div className={`m-3 p-3 ${isDarkMode ? "bg-secondaryBgDark" : "bg-secondaryBgLight"} rounded-md`}>
            <h2 className='my-3 font-roboto text-2xl'>Editar datos de consultorio</h2>
            <div >
              <CompanyDataChangeComponent />
            </div>
          </div>
        }

      </div>

    </div>
  )
}
