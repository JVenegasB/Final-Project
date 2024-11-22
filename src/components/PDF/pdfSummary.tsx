import { Document, Text, Page } from '@react-pdf/renderer';
import { PatientSummary } from '../../types/types';

type PDFSummaryProps = {
    patientData: PatientSummary | null;
    clinicLogo: string | null;
};

export default function PDFSummary({ patientData}: PDFSummaryProps) {

    return (
        <Document>
            <Page>
                {patientData ? (
                    <>
                        <Text>Resumen de historia</Text>
                        <Text>Nombre del paciente: {patientData?.name}</Text>
                    </>
                ) : (
                    <Text>No patient data available</Text>
                )}
            </Page>
        </Document>
    );

}