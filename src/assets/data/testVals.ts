// import { findIndex } from "@fluentui/react";
import { PatientSummary } from "../../types/types";


export const patientList = [
  {
    personalData: {
      firstSession: "2024-08-12",
      lastSession: "2024-09-10",
      name: "Juan Carlos Rivas",
      age: 45,
      dateOfBirth: "1979-05-12",
      occupation: "Ingeniero Civil",
      maritalStatus: "Casado",
      identification: "1234567890",
      address: "Av. Las Américas, Quito, Ecuador",
      phone: "0991234567",
      mail: "juan.rivas@gmail.com",
      religiousBelief: "Católico",
    },
    finishLatter: false,
    motive: "Dolor abdominal",
    personalBackground: {
      pathological: "Hipertensión",
      farmacological: "Losartán",
      quirurgical: "Apendicectomía",
      trauma: "Accidente automovilístico a los 20 años",
      alergic: "Penicilina",
      toxic: "No fumador",
      ginecoObstetric: null,
      hospitalary: "Ninguna",
    },
    familyBackground: "Padre con diabetes",
    currentIllness: "Dolor abdominal de 3 días",
    systemReview: {
      skin: "Normal",
      collagen: "Normal",
      lymphatic: "Normal",
      auditive: "Normal",
      visual: "Usa lentes",
      respiratory: "Normal",
      digestive: "Dolor abdominal",
      genitourinary: "Normal",
      musculoskeletal: "Normal",
      feeding: "Dieta balanceada",
      sleep: "Sueño normal",
      physicalActivity: "Actividad física regular",
      psychosocial: "Sin problemas",
    },
    familyogram: "No especificado",
    physicalExam: {
      heartRate: 72,
      respiratoryRate: 18,
      bloodPressure: "120/80",
      saturation: 98,
      temperature: 37,
      weight: 80,
      size: 175,
      IMC: 20,
      physicalExam: "Dolor a la palpación en hemiabdomen inferior",
    },
    diagnostic: [
      {
        description: "Gastritis aguda",
      },
    ],
    treatment: [
      {
        description: "Omeprazol",
      },
    ],
    doctor: "Dr. Manuel Sánchez",
    evolution: [
      {
        attendedDate: "2024-09-10",
        motive: "Seguimiento de gastritis",
        currentIllness: "Mejora notable",
        physicalExam: "Normal",
        diagnosis: "Gastritis en resolución",
        plan: "Continuar tratamiento",
        finishLater: false,
        alternative: {
          isAlternative: false,
          therapy: null,
        },
      },
      {
        attendedDate: "2024-10-10",
        motive: "Seguimiento de colitis",
        currentIllness: "Mejora considerablemente notable",
        physicalExam: "todo positivo",
        diagnosis: "Colitis en resolucion",
        plan: "Continuar tratamiento",
        finishLater: false,
        alternative: {
          isAlternative: false,
          therapy: null,
        },
      },
    ],
  },
  {
    personalData: {
      firstSession: "2024-08-20",
      lastSession: "2024-09-15",
      name: "José Pérez",
      age: 40,
      dateOfBirth: "1984-10-25",
      occupation: "Contador",
      maritalStatus: "Casado",
      identification: "1098765432",
      address: "Calle Bolívar, Cuenca, Ecuador",
      phone: "0998764321",
      mail: "jose.perez@gmail.com",
      religiousBelief: "Católico",
    },
    finishLatter: true,
    motive: "Dolor torácico",
    personalBackground: {
      pathological: "Diabetes tipo 2",
      farmacological: "Metformina",
      quirurgical: "Ninguno",
      trauma: "Ninguno",
      alergic: "Ninguno",
      toxic: "Exfumador",
      ginecoObstetric: {
        OS: {
          gestations: 3,
          births: 3,
          Caesarean: 0,
          abortions: 0,
        },
        lastMenstruation: "",
        planification: "No",
        menarche: "12 años",
        cycles: "Irregulares antes de menopausia",
        papSmear: "2021-05",
        observations: " Observaciones 123",
      },
      hospitalary: "Ninguna",
    },
    familyBackground: "Padre con hipertensión",
    currentIllness: "Dolor torácico de 1 semana",
    systemReview: {
      skin: "Normal",
      collagen: "Normal",
      lymphatic: "Normal",
      auditive: "Normal",
      visual: "Normal",
      respiratory: "Leve dificultad respiratoria",
      digestive: "Normal",
      genitourinary: "Normal",
      musculoskeletal: "Dolor en el pecho",
      feeding: "Dieta desbalanceada",
      sleep: "Problemas de sueño",
      physicalActivity: "Poca actividad física",
      psychosocial: "Estrés laboral",
    },
    familyogram: "No especificado",
    physicalExam: {
      heartRate: 80,
      respiratoryRate: 20,
      bloodPressure: "140/90",
      saturation: 96,
      temperature: 36.8,
      weight: 85,
      size: 175,
      IMC: 27,
      physicalExam: "Dolor a la palpación en hemitórax izquierdo",
    },
    diagnostic: [
      {
        description: "Angina estable",
      },
    ],
    treatment: [
      {
        description: "Nitroglicerina",
      },
    ],
    doctor: "Dra. Ana Ruiz",
    evolution: [
      {
        attendedDate: "2024-09-12",
        motive: "Revisión de angina",
        currentIllness: "Angina estable, sin cambios",
        physicalExam: "Normal",
        diagnosis: "Angina en control",
        plan: "Continuar con nitroglicerina",
        finishLater: true,
        alternative: {
          isAlternative: false,
          therapy: null,
        },
      },
    ],
  },
  {
    personalData: {
      firstSession: "2024-08-30",
      lastSession: "2024-09-25",
      name: "Luisa Gómez",
      age: 55,
      dateOfBirth: "1969-05-16",
      occupation: "Ama de casa",
      maritalStatus: "Viuda",
      identification: "1234509876",
      address: "Barrio San Juan, Loja, Ecuador",
      phone: "0987654322",
      mail: "luisa.gomez@gmail.com",
      religiousBelief: "Cristiana",
    },
    finishLatter: true,
    motive: "Fatiga y dolor en articulaciones",
    personalBackground: {
      pathological: "Artritis",
      farmacological: "Ibuprofeno",
      quirurgical: "Colecistectomía",
      trauma: "Fractura de cadera a los 50 años",
      alergic: "Ninguno",
      toxic: "No fumadora",
      hospitalary: "Ninguna",
      ginecoObstetric: {
        OS: {
          gestations: 3,
          births: 3,
          Caesarean: 0,
          abortions: 0,
        },
        lastMenstruation: "40 años",
        planification: "No",
        menarche: "12 años",
        cycles: "Irregulares antes de menopausia",
        papSmear: "2021-05",
        observations: " Observaciones 123",
      },
    },
    familyBackground: "Madre con osteoporosis",
    currentIllness:
      "Fatiga y dolor en las articulaciones de 3 meses de evolución",
    systemReview: {
      skin: "Resequedad",
      collagen: "Dolor en articulaciones",
      lymphatic: "Sin problemas",
      auditive: "Normal",
      visual: "Normal",
      respiratory: "Normal",
      digestive: "Sin alteraciones",
      genitourinary: "Normal",
      musculoskeletal: "Dolor articular en rodillas",
      feeding: "Dieta baja en proteínas",
      sleep: "Problemas para conciliar el sueño",
      physicalActivity: "Baja actividad física",
      psychosocial: "Ansiedad por la muerte del esposo",
    },
    familyogram: "No especificado",
    physicalExam: {
      heartRate: 78,
      respiratoryRate: 18,
      bloodPressure: "130/85",
      saturation: 97,
      temperature: 36.5,
      weight: 70,
      size: 160,
      IMC: 27,
      physicalExam: "Dolor a la palpación en rodillas",
    },
    diagnostic: [
      {
        description: "Artritis reumatoide",
      },
      {
        description: "Osteoporosis",

      },
    ],
    treatment: [
      {
        description: "Metotrexato",
      },
      {
        description: "Calcio",
      }
    ],
    doctor: "Dr. Santiago Castro",
    evolution: [
      {
        attendedDate: "2024-09-25",
        motive: "Control de artritis",
        currentIllness: "Mejora parcial en dolor articular",
        physicalExam: "Sin cambios",
        diagnosis: "Artritis en tratamiento",
        plan: "Continuar con metotrexato",
        finishLater: true,
        alternative: {
          isAlternative: false,
          therapy: null,
        },
      },
    ],
  },
  {
    personalData: {
      firstSession: "2024-09-05",
      lastSession: "2024-10-15",
      name: "María Fernanda Torres",
      age: 32,
      dateOfBirth: "1992-03-18",
      occupation: "Profesora",
      maritalStatus: "Soltera",
      identification: "1765432109",
      address: "Calle Orellana, Guayaquil, Ecuador",
      phone: "0987654321",
      mail: "maria.torres@gmail.com",
      religiousBelief: "Agnóstica",
    },
    finishLatter: true,
    motive: "Dolor de cabeza frecuente",
    personalBackground: {
      pathological: "Migraña",
      farmacological: "Sumatriptán",
      quirurgical: "Ninguno",
      trauma: "Ninguno",
      alergic: "Polvo",
      toxic: "No fumadora, consumo social de alcohol",
      ginecoObstetric: {
        OS: {
          gestations: 1,
          births: 0,
          Caesarean: 1,
          abortions: 0,
        },
        lastMenstruation: "2024-10-01",
        planification: "Sí, anticonceptivos orales",
        menarche: "13 años",
        cycles: "Regulares",
        papSmear: "2024-02",
        observations: "Sin complicaciones en el embarazo previo",
      },
      hospitalary: "Cesárea en 2020",
    },
    familyBackground: "Madre con migraña, padre con hipertensión",
    currentIllness: "Dolor de cabeza intenso y frecuente en los últimos 2 meses",
    systemReview: {
      skin: "Normal",
      collagen: "Normal",
      lymphatic: "Normal",
      auditive: "Normal",
      visual: "Fotofobia durante episodios de migraña",
      respiratory: "Normal",
      digestive: "Náuseas ocasionales",
      genitourinary: "Normal",
      musculoskeletal: "Tensión en cuello y hombros",
      feeding: "Dieta variada, evita alimentos desencadenantes",
      sleep: "Insomnio ocasional",
      physicalActivity: "Yoga 3 veces por semana",
      psychosocial: "Estrés laboral moderado",
    },
    familyogram: "No especificado",
    physicalExam: {
      heartRate: 68,
      respiratoryRate: 16,
      bloodPressure: "110/70",
      saturation: 99,
      temperature: 36.7,
      weight: 60,
      size: 165,
      IMC: 22,
      physicalExam: "Sin hallazgos significativos, leve tensión muscular en cuello",
    },
    diagnostic: [
      {
        description: "Migraña crónica",
      },
    ],
    treatment: [
      {
        description: "Topiramato 50mg diarios",
      },
      {
        description: "Sumatriptán 50mg en caso de crisis",
      },
    ],
    doctor: "Dra. Carla Mendoza",
    evolution: [
      {
        attendedDate: "2024-10-15",
        motive: "Seguimiento de migraña",
        currentIllness: "Disminución en frecuencia de episodios",
        physicalExam: "Sin cambios significativos",
        diagnosis: "Migraña en tratamiento, mejoría parcial",
        plan: "Continuar con medicación actual, considerar terapia de relajación",
        finishLater: true,
        alternative: {
          isAlternative: true,
          therapy: "Acupuntura",
        },
      },
    ],
  }
];

const listHistoriesWithEmptyComponents = (patientList: PatientSummary[]) => {
  return getHistoriesWithEmptyComponents(patientList);
}

const getHistoriesWithEmptyComponents = (patientList: PatientSummary[]) => {
  return patientList.filter(patient => {
    const isPersonalDataEmpty = Object.values(patient.personalData).some(value => value === "" || value == null);
    const isPersonalBackgroundEmpty = Object.values(patient.personalBackground).some(value => value === "" || value == null);
    const isSystemReviewEmpty = Object.values(patient.systemReview).some(value => value === "" || value == null);
    const isPhysicalExamEmpty = Object.values(patient.physicalExam).some(value => value === "" || value == null);
    const isDiagnosticEmpty = patient.diagnostic.some(diag => diag.description === "" || diag.description == null);
    const isTreatmentEmpty = patient.treatment.some(treat => treat.description === "" || treat.description == null);
    const isEvolutionEmpty = patient.evolution.some(evo =>
      Object.values(evo).includes("") || Object.values(evo).some(value => value == null) ||
      (evo.alternative && evo.alternative.therapy === "")
    );

    return (
      isPersonalDataEmpty ||
      patient.motive === "" ||
      isPersonalBackgroundEmpty ||
      patient.familyBackground === "" ||
      patient.currentIllness === "" ||
      isSystemReviewEmpty ||
      patient.familyogram === "" ||
      isPhysicalExamEmpty ||
      isDiagnosticEmpty ||
      isTreatmentEmpty ||
      isEvolutionEmpty
    );
  });
};

export const historiesWithEmptyComponents = getHistoriesWithEmptyComponents(patientList);
export const evolutionsWithEmptyComponents = listHistoriesWithEmptyComponents(patientList);
