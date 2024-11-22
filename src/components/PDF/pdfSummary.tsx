import { Document, Page, Text, StyleSheet, View, Font, Image } from '@react-pdf/renderer';
import { PatientSummary } from '../../types/types';
import RobotoBold from '../../fonts/Roboto-Bold.ttf';
import RobotoRegular from '../../fonts/Roboto-Regular.ttf';

type PDFSummaryProps = {
    patientData: PatientSummary | null;
    clinicLogo: string | null;
};

Font.register({
    family: 'Roboto',
    fonts: [
        { src: RobotoRegular, fontWeight: 'normal' },
        { src: RobotoBold, fontWeight: 'bold' },
    ],
});

const styles = StyleSheet.create({
    page: {
        padding: 30,
        marginHorizontal: 20,
        fontFamily: 'Roboto',
    },
    header: {
        fontSize: 18,
        marginBottom: 20,
        marginTop: 15,
        textAlign: 'center',
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    grid: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    col: {
        width: '43%',
        marginBottom: 10,
        flexDirection: 'row',
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 10,
    },
    value: {
        fontSize: 12,
        flexShrink: 1,
        flexWrap: 'wrap',
        overflow: 'hidden',
        marginBottom: 5,
        lineHeight: 1.5,
    }, evolutionValue: {
        fontSize: 12,
        flexShrink: 1,
        flexWrap: 'wrap',
        overflow: 'hidden',
        marginLeft: 10,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    singleCol: {
        marginBottom: 10,
        flexDirection: 'row',
    },
    col3: {
        width: '30%',
        marginBottom: 10,
        flexDirection: 'row',
    },
    evolutionView: {
        marginBottom: 10,
        marginTop: 5,
    },
    evolutiondescription: {
        marginTop: 5,
        marginLeft: 10,
    },
    image: {
        position: 'absolute',
        top: 10,
        right: 20,
        width: 95,
        height: 47,
        marginRight: 10
    }
});

export default function PDFSummary({ patientData, clinicLogo }: PDFSummaryProps) {
    return (
        <Document>
            <Page style={styles.page}>
                {clinicLogo && <Image src={clinicLogo} style={styles.image} />}

                <Text style={styles.header}>Historia Clínica</Text>
                <Text style={styles.subtitle}>Datos personales</Text>
                <View style={styles.grid}>
                    <View style={styles.singleCol}>
                        <Text style={styles.value}><Text style={styles.label}>Nombre del paciente: </Text>{patientData?.name || '---'}</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.value}><Text style={styles.label}>Edad:</Text>{patientData?.age || '---'}</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.value}><Text style={styles.label}>Fecha de nacimiento</Text>{patientData?.date_of_birth || '---'}</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.value}><Text style={styles.label}>Ocupacion: </Text>{patientData?.occupation || '---'}</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.value}><Text style={styles.label}>Estado civil:</Text>{patientData?.marital_status || '---'}</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.value}><Text style={styles.label}>Cedula:</Text>{patientData?.identification || '---'}</Text>
                    </View>
                </View>
                <View style={styles.singleCol}>
                    <Text style={styles.value}><Text style={styles.label}>Direccion:</Text>{patientData?.address || '---'}</Text>
                </View>
                <View style={styles.singleCol}>
                    <Text style={styles.value}><Text style={styles.label}>Numero telefonico:</Text>{patientData?.phone || '---'}</Text>
                </View>
                <View style={styles.singleCol}>

                    <Text style={styles.value}><Text style={styles.label}>Correo electronico:</Text>{patientData?.email || '---'}</Text>
                </View>
                <View style={styles.singleCol}>

                    <Text style={styles.value}><Text style={styles.label}>Creencia religiosa:</Text>{patientData?.religious_belief || '---'}</Text>
                </View>
                <View style={styles.singleCol}>

                    <Text style={styles.value}><Text style={styles.label}>Motivo de primera consulta:</Text>{patientData?.motive || '---'}</Text>
                </View>
                {(patientData?.diagnosis !== null && patientData?.diagnosis !== undefined && patientData?.diagnosis.length > 0) &&
                    <View>
                        <Text style={styles.subtitle}>Diagnostico</Text>
                        {patientData?.diagnosis.map((diag, index) => {
                            return (
                                <View style={styles.singleCol} key={index}>
                                    <Text style={styles.value}>{diag.description + " - " + diag.code || '---'}</Text>
                                </View>
                            )
                        })}
                    </View>
                }
                {(patientData?.treatment !== null && patientData?.treatment !== undefined && patientData?.treatment.length > 0) &&
                    <View>
                        <Text style={styles.subtitle}>Tratamiento</Text>
                        {patientData?.treatment.map((treat, index) => {
                            return (
                                <View style={styles.singleCol} key={index}>
                                    <Text style={styles.value}>
                                        <Text style={styles.label}>{index + 1}</Text>
                                        {treat.description || '---'}</Text>
                                </View>
                            )
                        })}
                    </View>
                }
                {(patientData?.evolution !== null && patientData?.evolution !== undefined && patientData?.evolution?.length > 0) &&
                    <View>
                        <Text>Evolucion</Text>
                        {patientData?.evolution.map((evo, index) => {
                            return (
                                <View style={styles.evolutionView} key={index}>
                                    <Text style={styles.value}>{(index + 1) + ". " + evo.attended_date.split("T")[0]}</Text>
                                    <View style={styles.evolutiondescription}>
                                        <Text style={styles.value}><Text style={styles.label}>Motivo de consulta: </Text>{evo.motive}</Text>
                                        <Text style={styles.value}>
                                            <Text style={styles.label}>Enfermedad actual: </Text>{evo.current_illness}
                                        </Text>
                                        <Text style={styles.value}>
                                            <Text style={styles.label}>Examen físico: </Text>{evo.physical_exam}
                                        </Text>
                                        <Text style={styles.value}>
                                            <Text style={styles.label}>Diagnóstico: </Text>{evo.diagnosis}
                                        </Text>
                                        <Text style={styles.value}>
                                            <Text style={styles.label}>Plan: </Text>{evo.plan}
                                        </Text>
                                        <Text style={styles.value}>
                                            <Text style={styles.label}>Enfermedad actual: </Text>{evo.current_illness}
                                        </Text>

                                    </View>
                                </View>
                            )
                        })}
                    </View>
                }
            </Page>
        </Document>
    );
}
