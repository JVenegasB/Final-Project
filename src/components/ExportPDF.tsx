import PDFSummary from './PDF/pdfSummary';
import PDFComplete from './PDF/pdfComplete';
import { PatientSummary } from '../types/types';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from '@fluentui/react-components';
import { ArrowLeft24Regular } from '@fluentui/react-icons';
import { useClinicContext } from '../context/clinicContext';
import { client } from '../supabase/client';
import { useEffect, useState } from 'react';

type Props = {
    patientData: PatientSummary | null,
    exportType: string,
    setAddEvolutionComponent: (value: string) => void;
}

const DownloadButton: React.FC<{ loading: boolean }> = ({ loading }) => (
    <Button disabled={loading}>
        {loading ? 'Cargando...' : 'Descargar'}
    </Button>
);

export default function ExportPDF({ patientData, exportType, setAddEvolutionComponent }: Props) {
    const returnPage = () => {
        setAddEvolutionComponent("list");
    }
    const [clinicData] = useClinicContext();
    const [clinicLogo, setClinicLogo] = useState<string | null>(null);
    const fetchLogo = async () => {
        if(!clinicData?.logo_url) return
        const { data: signedUrlData, error: signedUrlError } = await client.storage.from('Clinic Logos').createSignedUrl(clinicData?.logo_url,60)
        if(signedUrlError){
            console.error('Error getting signed url',signedUrlError)
            return
        }
        setClinicLogo(signedUrlData?.signedUrl)
    }
    useEffect(() => {
        if(clinicData?.logo_url !== '' && clinicData?.logo_url) fetchLogo()
    }, [clinicData])

    return (
        <div className='flex flex-col flex-grow h-full w-full px-5'>
            <div className='flex flex-row'>
                <Button
                    onClick={returnPage}
                    icon={<ArrowLeft24Regular />}
                >
                    Volver
                </Button>
                {patientData && <PDFDownloadLink
                    document={exportType === 'resumen' ? <PDFSummary patientData={patientData} clinicLogo={clinicLogo}/> : <PDFComplete patientData={patientData} clinicLogo={clinicLogo}/>}
                    fileName={`${patientData?.name} Historia clinica ${exportType}.pdf`}
                >
                    {({ loading }) => <DownloadButton loading={loading} />}
                </PDFDownloadLink> }
                
            </div>
            <div className='my-5'>
                <span className="font-roboto text-2xl mt-5">Exportar historia de {patientData?.name} a PDF ({exportType})</span>
            </div>
            <div className='flex items-center justify-center w-full'>
                {exportType === "resumen" ? (
                    <PDFViewer width="90%" className="min-h-[calc(100vh-370px)]">
                        <PDFSummary patientData={patientData} clinicLogo={clinicLogo}/>
                    </PDFViewer>
                ) : (
                    <PDFViewer width="100%" className="min-h-[calc(100vh-370px)]">
                        <PDFComplete patientData={patientData} clinicLogo={clinicLogo}/>  
                    </PDFViewer>
                )}

            </div>
        </div>
    )
}
