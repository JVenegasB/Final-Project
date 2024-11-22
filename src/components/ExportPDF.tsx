import PDFSummary from './PDF/pdfSummary';
import PDFComplete from './PDF/pdfComplete';
import { PatientSummary } from '../types/types';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { Button, Input, Spinner } from '@fluentui/react-components';
import { ArrowLeft24Regular } from '@fluentui/react-icons';
import { useClinicContext } from '../context/clinicContext';
import { client } from '../supabase/client';
import { useEffect, useState } from 'react';

type Props = {
    patientData: PatientSummary | null;
    exportType: string;
    setAddEvolutionComponent: (value: string) => void;
};

const DownloadButton: React.FC<{ loading: boolean }> = ({ loading }) => (
    <Button disabled={loading}>
        {loading ? 'Cargando...' : 'Descargar'}
    </Button>
);

export default function ExportPDF({ patientData, exportType, setAddEvolutionComponent }: Props) {
    const returnPage = () => {
        setAddEvolutionComponent("list");
    };

    const [clinicData] = useClinicContext();
    const [clinicLogo, setClinicLogo] = useState<string | null>(null);
    const [loadingLogo, setLoadingLogo] = useState(false);

    // Fetch clinic logo
    useEffect(() => {
        const fetchLogo = async () => {
            if (!clinicData?.logo_url) return;
            setLoadingLogo(true);
            const { data: signedUrlData, error: signedUrlError } = await client.storage.from('Clinic Logos').createSignedUrl(clinicData.logo_url, 60);
            if (signedUrlError) {
                console.error('Error getting signed URL:', signedUrlError);
            } else {
                setClinicLogo(signedUrlData?.signedUrl);
            }
            setLoadingLogo(false);
        };

        if (clinicData?.logo_url) fetchLogo();
    }, [clinicData]);

    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');
    const [dataToExport, setDataToExport] = useState<PatientSummary | null>(null);

    const filterData = () => {
        const normalizeDate = (date: Date) => {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        };
        if (!patientData) {
            setDataToExport(null);
            return;
        }
        if (dateFrom && dateTo) {
            const start = new Date(dateFrom);
            const end = new Date(dateTo);

            if (start > end) {
                console.warn("Invalid date range: 'From' date is later than 'To' date");
                setDataToExport(patientData);
                setFetchData(false);
                return;
            }

            if (patientData.evolution) {
                const filteredEvolutions = patientData.evolution.filter((evolution) => {
                    if (!evolution.attended_date) return false;

                    const evolutionDate = normalizeDate(new Date(evolution.attended_date.split('T')[0]));
                    const startDate = normalizeDate(start);
                    const endDate = normalizeDate(end);

                    return evolutionDate >= startDate && evolutionDate <= endDate;
                });

                setDataToExport({
                    ...patientData,
                    evolution: filteredEvolutions,
                });
                setFetchData(true);
                setEnableButton(true);
                return;
            }
        }

        setDataToExport(patientData);
        setFetchData(true);
        setEnableButton(true);
    }

    const [fetchData, setFetchData] = useState(false);
    const [enableButton, setEnableButton] = useState(false);
    useEffect(() => {
        if (dateFrom && dateTo) {
            setEnableButton(false);
        } else {
            setEnableButton(true);
        }
    }, [dateFrom, dateTo]);
    return (
        <div className="flex flex-col flex-grow h-full w-full px-5">
            <div className="flex flex-row items-center space-x-4 mb-5">
                <Button
                    onClick={returnPage}
                    icon={<ArrowLeft24Regular />}
                >
                    Volver
                </Button>
                {patientData && (
                    <PDFDownloadLink
                        document={
                            exportType === 'resumen' ? (
                                <PDFSummary patientData={dataToExport} clinicLogo={clinicLogo} />
                            ) : (
                                <PDFComplete patientData={patientData} clinicLogo={clinicLogo} />
                            )
                        }
                        fileName={`${patientData?.name} Historia clinica ${exportType}.pdf`}
                    >
                        {/* @ts-expect-error needed to use*/}
                        {({ loading }) => <DownloadButton loading={loading} />}
                    </PDFDownloadLink>
                )}
            </div>
            <div className="mb-5">
                <span className="font-roboto text-2xl">Exportar historia de {patientData?.name} a PDF ({exportType})</span>
            </div>
            <div className="flex flex-col items-center w-full">
                {exportType === "resumen" ? (
                    <div className="flex flex-col space-y-4 w-full">
                        <div className="grid md:grid-cols-3 grid-cols-1 md:space-x-4 ">
                            <Input
                                type="date"
                                id="date-from"
                                name="date-from"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="flex-grow"
                                max={dateTo}
                            />
                            <Input
                                type="date"
                                id="date-to"
                                name="date-to"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="flex-grow"
                                min={dateFrom}
                            />
                            <Button disabled={enableButton} onClick={filterData}>Buscar</Button>
                        </div>
                        {loadingLogo ? (
                            <Spinner label="Cargando logo..." />
                        ) : (
                            fetchData && (
                                <PDFViewer width="90%" className="min-h-[calc(100vh-370px)]">
                                    <PDFSummary patientData={dataToExport} clinicLogo={clinicLogo} />
                                </PDFViewer>
                            )
                        )}
                    </div>
                ) : (
                    <PDFViewer width="100%" className="min-h-[calc(100vh-370px)]">
                        <PDFComplete patientData={patientData} clinicLogo={clinicLogo} />
                    </PDFViewer>
                )}
            </div>
        </div>
    );
}
