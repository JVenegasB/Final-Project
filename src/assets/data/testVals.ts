import { PatientSummary } from "../../types/types";


export const patientList = [
  {
    personalData: {
      firstSession: "2024-08-12",
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
    annotations: "Paciente con antecedentes de hipertensión",
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
      saturation: "98%",
      temperature: "37°C",
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
        annotation: "Controlar dieta",
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
    annotations: "Paciente con antecedentes de diabetes tipo 2",
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
      saturation: "96%",
      temperature: "36.8°C",
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
        annotation: "Controlar presión arterial",
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
    annotations: "Paciente con antecedentes de artritis",
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
      saturation: "97%",
      temperature: "36.5°C",
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
        annotation: "Controlar dolor articular",
        alternative: {
          isAlternative: false,
          therapy: null,
        },
      },
    ],
  },
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
      patient.annotations === "" ||
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
