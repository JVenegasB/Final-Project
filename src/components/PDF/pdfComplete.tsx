import { Document, Page, Text, StyleSheet, View, Font, Image } from '@react-pdf/renderer';
import RobotoBold from '../../fonts/Roboto-Bold.ttf';
import RobotoRegular from '../../fonts/Roboto-Regular.ttf';
import { PatientSummary } from '../../types/types';

// Font Registration
Font.register({
    family: 'Roboto',
    fonts: [
        { src: RobotoRegular, fontWeight: 'normal' },
        { src: RobotoBold, fontWeight: 'bold' },
    ],
});

interface PDFCompleteProps {
    patientData: PatientSummary | null;
    clinicLogo: string | null;
}

// Styles
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

// PDF Component
export default function PDFComplete({ patientData, clinicLogo }: PDFCompleteProps) {
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
                <Text style={styles.subtitle}>Motivo de consulta</Text>
                <View style={styles.singleCol}>

                    <Text style={styles.value}><Text style={styles.label}>Motivo de consulta:</Text>{patientData?.motive || '---'}</Text>
                </View>
                <Text style={styles.subtitle}>Enfermedad actual</Text>
                <View style={styles.singleCol}>

                    <Text style={styles.value}><Text style={styles.label}>Enfermedad actual:</Text>{patientData?.current_illness || '---'}</Text>
                </View>
                <Text style={styles.subtitle}>Antecedentes personales</Text>
                <View style={styles.singleCol}>

                    <Text style={styles.value}><Text style={styles.label}>Patologicos:</Text>{patientData?.personal_background.pathological || '---'}</Text>
                </View>
                <View style={styles.singleCol}>

                    <Text style={styles.value}><Text style={styles.label}>Farmacologicos:</Text>{patientData?.personal_background.pharmacological || '---'}</Text>
                </View>
                <View style={styles.singleCol}>

                    <Text style={styles.value}><Text style={styles.label}>Quirurgicos:</Text>{patientData?.personal_background.surgical || '---'}</Text>
                </View>
                <View style={styles.singleCol}>

                    <Text style={styles.value}><Text style={styles.label}>Trauma:</Text>{patientData?.personal_background.trauma || '---'}</Text>
                </View>
                <View style={styles.singleCol}>

                    <Text style={styles.value}><Text style={styles.label}>Alergicos:</Text>{patientData?.personal_background.allergic || '---'}</Text>
                </View>
                <View style={styles.singleCol}>

                    <Text style={styles.value}><Text style={styles.label}>Toxicos:</Text>{patientData?.personal_background.toxic || '---'}</Text>
                </View>
                <View style={styles.singleCol}>

                    <Text style={styles.value}><Text style={styles.label}>Hospitalarios:</Text>{patientData?.personal_background.hospitalary || '---'}</Text>
                </View>
                {patientData?.personal_background.isGinecoObstetric && <View >
                    <Text style={styles.subtitle}>Formula obstetrica</Text>
                    <View style={styles.grid}>
                        <View style={styles.col3}>

                            <Text style={styles.value}><Text style={styles.label}>Gestaciones: </Text>{patientData?.personal_background.gestations || '---'}</Text>
                        </View>
                        <View style={styles.col3}>

                            <Text style={styles.value}><Text style={styles.label}>Partos: </Text>{patientData?.personal_background.births || '---'}</Text>
                        </View>
                        <View style={styles.col3}>

                            <Text style={styles.value}><Text style={styles.label}>Cesareas: </Text>{patientData?.personal_background.caesarean || '---'}</Text>
                        </View>
                        <View style={styles.col3}>

                            <Text style={styles.value}><Text style={styles.label}>Abortos: </Text>{patientData?.personal_background.abortions || '---'}</Text>
                        </View>
                    </View>
                    <View style={styles.singleCol}>

                        <Text style={styles.value}><Text style={styles.label}>Ultima menstruacion: </Text>{patientData?.personal_background.last_menstruation || '---'}</Text>
                    </View>
                    <View style={styles.singleCol}>

                        <Text style={styles.value}><Text style={styles.label}>Ciclos: </Text>{patientData?.personal_background.cycles || '---'}</Text>
                    </View>
                    <View style={styles.singleCol}>

                        <Text style={styles.value}><Text style={styles.label}>Menarquia: </Text>{patientData?.personal_background.menarche || '---'}</Text>
                    </View>
                    <View style={styles.singleCol}>

                        <Text style={styles.value}><Text style={styles.label}>Planificacion: </Text>{patientData?.personal_background.planification || '---'}</Text>
                    </View>
                    <View style={styles.singleCol}>

                        <Text style={styles.value}><Text style={styles.label}>Ultimo papanicolau: </Text>{patientData?.personal_background.pap_smear || '---'}</Text>
                    </View>
                    <View style={styles.singleCol}>

                        <Text style={styles.value}><Text style={styles.label}>Observaciones: </Text>{patientData?.personal_background.observations || '---'}</Text>
                    </View>
                </View>}
                <Text style={styles.subtitle}>Antecedentes familiares</Text>
                <View style={styles.singleCol}>

                    <Text style={styles.value}><Text style={styles.label}>Antecedentes familiares: </Text>{patientData?.family_background || '---'}</Text>
                </View>
                <Text style={styles.subtitle}>Revision por sistemas</Text>
                <View style={styles.grid}>
                    <View style={styles.col3}>

                        <Text style={styles.value}><Text style={styles.label}>Piel y fanera: </Text>{patientData?.system_review.skin || '---'}</Text>
                    </View>
                    <View style={styles.col3}>

                        <Text style={styles.value}><Text style={styles.label}>Genitourinario: </Text>{patientData?.system_review.genitourinary || '---'}</Text>
                    </View>
                    <View style={styles.col3}>

                        <Text style={styles.value}>
                            <Text style={styles.label}>Colageno: </Text> {patientData?.system_review.collagen || '---'}
                        </Text>
                    </View>
                    <View style={styles.col3}>

                        <Text style={styles.value}><Text style={styles.label}>Musculoesqueletico: </Text>{patientData?.system_review.musculoskeletal || '---'}</Text>
                    </View>
                    <View style={styles.col3}>

                        <Text style={styles.value}><Text style={styles.label}>Linfatico: </Text>{patientData?.system_review.lymphatic || '---'}</Text>
                    </View>
                    <View style={styles.col3}>

                        <Text style={styles.value}><Text style={styles.label}>Alimentacion: </Text>{patientData?.system_review.feeding || '---'}</Text>
                    </View>
                    <View style={styles.col3}>

                        <Text style={styles.value}><Text style={styles.label}>Cardiaco: </Text>{patientData?.system_review.cardiac || '---'}</Text>
                    </View>
                    <View style={styles.col3}>

                        <Text style={styles.value}><Text style={styles.label}>Sueño: </Text>{patientData?.system_review.sleep || '---'}</Text>
                    </View>
                    <View style={styles.col3}>

                        <Text style={styles.value}><Text style={styles.label}>Nervioso: </Text>{patientData?.system_review.nervous || '---'}</Text>
                    </View>
                    <View style={styles.col3}>

                        <Text style={styles.value}><Text style={styles.label}>Actividad fisica: </Text>{patientData?.system_review.physical_activity || '---'}</Text>
                    </View>
                    <View style={styles.col3}>

                        <Text style={styles.value}><Text style={styles.label}>Respiratorio: </Text>{patientData?.system_review.respiratory || '---'}</Text>
                    </View>
                    <View style={styles.col3}>

                        <Text style={styles.value}><Text style={styles.label}>Psicosocial: </Text>{patientData?.system_review.psychosocial || '---'}</Text>
                    </View>
                    <View style={styles.col3}>

                        <Text style={styles.value}><Text style={styles.label}>Digestivo: </Text>{patientData?.system_review.digestive || '---'}</Text>
                    </View>
                    <View style={styles.col3}>

                        <Text style={styles.value}><Text style={styles.label}>Sentidos: </Text>{patientData?.system_review.senses || '---'}</Text>
                    </View>
                    <View style={styles.col3}>

                        <Text style={styles.value}><Text style={styles.label}>Sangre: </Text>{patientData?.system_review.blood || '---'}</Text>
                    </View>
                </View>
                <Text style={styles.subtitle}>Familiograma</Text>
                <Text style={styles.value}>{patientData?.familiogram || '---'}</Text>
                <Text style={styles.subtitle}>Examen fisico</Text>
                <View style={styles.grid}>
                    <View style={styles.col3}>

                        <Text style={styles.value}><Text style={styles.label}>Frecuencia cardiaca: </Text>{patientData?.physical_exam.heart_rate || '---'} lpm</Text>
                    </View>
                    <View style={styles.col3}>

                        <Text style={styles.value}><Text style={styles.label}>Frecuencia respiratoria: </Text>{patientData?.physical_exam.respiratory_rate || '---'} rpm</Text>
                    </View>
                    <View style={styles.col3}>

                        <Text style={styles.value}><Text style={styles.label}>Tension arterial: </Text>{patientData?.physical_exam.blood_pressure || '---'} lpm</Text>
                    </View>
                    <View style={styles.col3}>

                        <Text style={styles.value}><Text style={styles.label}>Saturacion: </Text>{patientData?.physical_exam.saturation + " lpm" || '---'}</Text>
                    </View>
                    <View style={styles.col3}>

                        <Text style={styles.value}><Text style={styles.label}>Temperatura: </Text>{patientData?.physical_exam.temperature + ' C' || '---'}</Text>
                    </View>
                    <View style={styles.col3}>

                        <Text style={styles.value}><Text style={styles.label}>Peso: </Text>{patientData?.physical_exam.weight + "  kg" || '---'}</Text>
                    </View>
                    <View style={styles.col3}>

                        <Text style={styles.value}><Text style={styles.label}>Talla: </Text>{patientData?.physical_exam.size + " m" || '---'}</Text>
                    </View>
                    <View style={styles.col3}>

                        <Text style={styles.value}><Text style={styles.label}>IMC: </Text>{patientData?.physical_exam.imc || '---'}</Text>
                    </View>
                    <View style={styles.singleCol}>

                        <Text style={styles.value}><Text style={styles.label}>Examen Fisico: </Text>{patientData?.physical_exam.physical_exam || '---'}</Text>
                    </View>
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
                        <Text style={styles.subtitle}>Evolucion:</Text>
                        <View >
                            {patientData.evolution.map((evo, index) => {
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
                                                <Text style={styles.label}>Enfermedad terapia Alternativa </Text>{evo.therapy}
                                            </Text>

                                        </View>

                                    </View>
                                )
                            })}
                        </View>
                    </View>
                }

            </Page>
        </Document>
    );
}
