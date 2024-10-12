import PDFSummary from './PDF/pdfSummary';
import PDFComplete from './PDF/pdfComplete';
import { PatientSummary } from '../types/types';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from '@fluentui/react-components';
import { ArrowLeft24Regular } from '@fluentui/react-icons';

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

    return (
        <div className='flex flex-col flex-grow h-full w-full'>
            <div className='flex flex-row'>
                <Button
                    onClick={returnPage}
                    icon={<ArrowLeft24Regular />}
                >
                    Volver
                </Button>
                <PDFDownloadLink
                    document={patientData ? <PDFSummary patientData={patientData} /> : null}
                    fileName={`${patientData?.personalData.name}${exportType}.pdf`}
                >
                    {({ loading }) => <DownloadButton loading={loading} />}
                </PDFDownloadLink>
            </div>
            <div className='my-5'>
                <span className="font-roboto text-2xl mt-5">Exportar historia de {patientData?.personalData.name} a PDF ({exportType})</span>
            </div>
            <div className='flex items-center justify-center w-full'>
                {exportType === "resumen" ? (
                    <PDFViewer width="100%" height="100%" className="border-2 border-gray-300">
                        <PDFSummary patientData={patientData} />
                    </PDFViewer>
                ) : (
                    <PDFViewer width="100%" height="100%" className="border-2 border-gray-300">
                        <PDFComplete patientData={patientData} />
                    </PDFViewer>
                )}

            </div>
        </div>
    )
}
