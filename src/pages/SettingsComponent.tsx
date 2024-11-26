import { Button, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Switch ,useId, useToastController, Toast, ToastTitle, ToastBody,Toaster, ToastIntent} from "@fluentui/react-components";
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
  fetchLogoUrl: (clinicLogoUrl:string) => void;
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


export default function SettingsComponent({ isClinicMember,fetchLogoUrl }: SettingsComponentProps) {
  //Toaster
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);
  const showToast = (title:string,description:string,intent:ToastIntent) => {
      dispatchToast(
          <Toast>
              <ToastTitle >{title}</ToastTitle>
              <ToastBody>{description}</ToastBody>

          </Toast>,
          { position:"top-end",intent }
      )
  }
  //context data
  const [user] = useUserContext();
  const [clinicData] = useClinicContext();
  const { isDarkMode, setIsDarkMode } = useThemeContext();
  //Store values from form
  const [clinicRequestList, setClinicRequestList] = useState<JoinRequestType[]>([])
  //Get join request users company
  const [fetchingJoinRequests, setFetchingJoinRequests] = useState(false)
  const fetchJoinRequests = async () => {
    setFetchingJoinRequests(true)
    const { data: clinic, error } = await client.from('join_requests').select('*').eq('clinic_id', clinicData?.id)
    if (error) {
      console.error('Error fetching data: ', error)
      showToast('Error al cargar las solicitudes',error.message,'error')
      setFetchingJoinRequests(false)
    } else {
      const modifiedClinic = clinic.map((request: JoinRequestType) => ({
        ...request,
        requested_date: request.requested_date.split('T')[0], // Add formatted date
      }));
      setClinicRequestList(modifiedClinic)
      setFetchingJoinRequests(false)
    }
  }

  //Fetch on load
  useEffect(() => {
    if (isClinicMember) {
      fetchJoinRequests()
    }
  }, [])
  const [isDisableButton, setIsDisableButton] = useState(false)
  //Accept request from user
  const handleAcceptRequest = async (request_id: number) => {
    try {
      setIsDisableButton(true)
      const { error } = await client.rpc('handle_accept_request', {
        request_id
      })
      if (error) {
        console.error(error)
        showToast('Error al aceptar la solicitud',error.message,'error')
      }
      else {
        showToast('Solicitud aceptada','La solicitud ha sido aceptada','success')
        fetchJoinRequests()
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        showToast('Error al aceptar la solicitud',error.message,'error')
      } else {
        console.error('Unknown error:', error);
        showToast('Error','Error desconocido','error')
      }
    } finally {
      setIsDisableButton(false)
    }
  }
  //Reject join request
  const handleRejectRequest = async (request_id: number) => {
    const { error } = await client.rpc('reject_join_request', {
      request_id
    })
    if (error) {
      console.error(error)
      showToast('Error al rechazar la solicitud',error.message,'error')
    }
    else {
      showToast('Solicitud rechazada','La solicitud ha sido rechazada','success')
      fetchJoinRequests()
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  return (
    <div className={`h-full m-3 ${isDarkMode ? "bg-thirdBgDark" : "bg-white"} max-h-[calc(100vh-90px)] overflow-y-auto`}>
      <Toaster toasterId={toasterId} />
      <h1 className={`text-4xl font-bold font-roboto p-5 ${isDarkMode ? "text-white" : "text-blue-900"}`}>Configuraciones</h1>
      <div className="grid lg:grid-cols-2 grid-cols-1 ">
        <div className={`m-3 p-3 ${isDarkMode ? "bg-secondaryBgDark" : "bg-secondaryBgLight"} rounded-md ${!(isClinicMember && user?.role === 'admin') && 'col-span-full'}`}>
          <h2 className='my-3 font-roboto text-2xl'>Tema</h2>
          <Switch labelPosition="before" label={`${isDarkMode ? 'Modo oscuro' : 'Modo claro'}`} onChange={toggleDarkMode} checked={!isDarkMode} />
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
              <Button onClick={fetchJoinRequests} disabled={fetchingJoinRequests}>{fetchingJoinRequests ? "Recargando" : "Recargar"}</Button>
            </div>
            <div className="overflow-x-auto h-[calc(100vh-650px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell className="w-36">Usuario</TableHeaderCell>
                    <TableHeaderCell className="w-36">Fecha de solicitud</TableHeaderCell>
                    <TableHeaderCell className="w-36">Estado</TableHeaderCell>
                    <TableHeaderCell className="w-36">Acciones</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clinicRequestList.length > 0 ? (
                    clinicRequestList.map((request, index) => (
                      <TableRow key={index}>
                        <TableCell>{request.user_name}</TableCell>
                        <TableCell>{request.requested_date}</TableCell>
                        <TableCell>{request.status}</TableCell>
                        <TableCell>
                          {request.status === 'requested' ? <>
                            <Button onClick={() => handleAcceptRequest(request.id)} disabled={isDisableButton}>Aceptar</Button>
                            <Button onClick={() => handleRejectRequest(request.id)} disabled={isDisableButton}>Rechazar</Button>
                          </> : <div className="italic">{request.status}</div>}
                        </TableCell>
                      </TableRow>
                    ))
                  ):(<TableRow><TableCell colSpan={4}>No hay solicitudes</TableCell></TableRow>)}
                </TableBody>
              </Table>
            </div>

          </div>
        }
        {(isClinicMember && user?.role === 'admin') &&
          <div className={`m-3 p-3 ${isDarkMode ? "bg-secondaryBgDark" : "bg-secondaryBgLight"} rounded-md`}>
            <h2 className='my-3 font-roboto text-2xl'>Editar datos de consultorio</h2>
            <div >
              <CompanyDataChangeComponent fetchLogoUrl={fetchLogoUrl}/>
            </div>
          </div>
        }

      </div>

    </div>
  )
}
