import { Document, Text, Page } from '@react-pdf/renderer';
import { PatientSummary } from '../../types/types';

type PDFSummaryProps = {
    patientData: PatientSummary | null;
};

export default function PDFSummary({ patientData}: PDFSummaryProps) {

    return (
        <Document>
            <Page>
                {patientData ? (
                    <>
                        <Text>Nombre del paciente: {patientData?.personalData.name}</Text>
                    </>
                ) : (
                    <Text>No patient data available</Text>
                )}
            </Page>
        </Document>
    );

}