import { Button, InfoLabel,useId, useToastController, Toast, ToastTitle, ToastBody,Toaster, ToastIntent} from "@fluentui/react-components";
import InputFieldWithIcon from "./InputFieldWithIcon";
import { useEffect, useState } from "react";
import { client } from "../supabase/client";
import { Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

interface ClinicSendJoinRequestProps {
    userSession: Session | null;
    userName: string | undefined;
    fetchUserJoinRequests?: (session: Session) => void;
}

export default function ClinicSendJoinRequest({ userSession, userName, fetchUserJoinRequests }: ClinicSendJoinRequestProps) {
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
    const navigate = useNavigate();
    // Data to store join request code
    const [joinRequestCode, setJoinRequestCode] = useState('')
    //Send join request
    const sendJoinRequest = async () => {
        if (userSession?.user.id === null || userSession?.user.id === undefined || userName === null || userName === undefined) {
            console.error('Error setting user. Unable to create consultory');
            return
        }
        const { error } = await client.rpc('create_join_request', {
            join_request_code: joinRequestCode,
            user_id: userSession?.user.id,
            user_name: userName
        })
        if (error) { 
            console.error('Error creating join request', error) 
            showToast('Error', `Error al enviar solicitud: ${error.message}`, 'error')
        }
        else {
            showToast('Solicitud enviada', 'Se ha enviado la solicitud exitosamente', 'success')
            navigate('/mainPage');
            if (fetchUserJoinRequests) {
                fetchUserJoinRequests(userSession);
            }
        }
    }
    const handleJoinRequestCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJoinRequestCode(e.target.value)
    }
    const [disableSendButton, setDisableSendButton] = useState(true);
    useEffect(() => {
        if(joinRequestCode !== ''){
            setDisableSendButton(false)
        }else{
            setDisableSendButton(true)
        }
    }, [joinRequestCode])
    return (
        <div className='flex flex-col'>
              <Toaster toasterId={toasterId} />
            <div className='flex flex-col mb-5'>
                <InfoLabel info={
                    <>
                        <p>Solicite al administrador de la empresa el codigo de identificacion.</p>
                        <p>Este se encuentra en la esquina superior derecha de la pantalla de inicio.</p>
                    </>
                } className="mb-2">
                    Ingrese el codigo identificador de la empresa
                </InfoLabel>
                <InputFieldWithIcon id='companyCode' placeholder='Codigo de empresa' value={joinRequestCode} handleDatachange={handleJoinRequestCodeChange} />
            </div>
            <Button onClick={sendJoinRequest} disabled={disableSendButton}>Solicitar unirme</Button>
        </div>
    )
}
