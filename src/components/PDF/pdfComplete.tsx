import { Document, Text, Page } from '@react-pdf/renderer';
import { PatientSummary } from '../../types/types';

type PDFComplete = {
    patientData: PatientSummary | null;
};

export default function PDFComplete({ patientData}: PDFComplete) {

    return (
        <Document>
            <Page>
                {patientData ? (
                    <>  
                        <Text>Historia clinica</Text>
                        <Text>Nombre del paciente: {patientData?.personalData.name}</Text>
                    </>
                ) : (
                    <Text>No patient data available</Text>
                )}
            </Page>
        </Document>
    );

}