export interface PatientSummary {
    personalData: {
      firstSession: string;
      lastSession: string;
      name: string;
      age: number;
      dateOfBirth: string;
      occupation: string;
      maritalStatus: string;
      identification: string;
      address: string;
      phone: string;
      mail: string;
      religiousBelief: string;
    };
    finishLatter: boolean;
    motive: string;
    personalBackground: {
      pathological: string;
      farmacological: string;
      quirurgical: string;
      trauma: string;
      alergic: string;
      toxic: string;
      hospitalary: string;
      ginecoObstetric?: {
        OS: {
          gestations: number;
          births: number;
          Caesarean: number;
          abortions: number;
        };
        lastMenstruation: string;
        planification: string;
        menarche: string;
        cycles: string;
        papSmear: string;
        observations: string;
      } | null;
    };
    familyBackground: string;
    currentIllness: string;
    systemReview: {
      skin: string;
      collagen: string;
      lymphatic: string;
      auditive: string;
      visual: string;
      respiratory: string;
      digestive: string;
      genitourinary: string;
      musculoskeletal: string;
      feeding: string;
      sleep: string;
      physicalActivity: string;
      psychosocial: string;
    };
    familyogram: string;
    physicalExam: {
      heartRate: number;
      respiratoryRate: number;
      bloodPressure: string;
      saturation: number;
      temperature: number;
      weight: number;
      size: number;
      IMC: number;
      physicalExam: string;
    };
    diagnostic: {
      description: string;
    }[];
    treatment: {
      description: string;
    }[];
    doctor: string;
    evolution: {
      attendedDate: string;
      motive: string;
      currentIllness: string;
      physicalExam: string;
      diagnosis: string;
      plan: string;
      finishLater: boolean;
      alternative: {
        isAlternative: boolean;
        therapy: string | null;
      };
    }[];
    // annotations: {
    //   description: string
    // }[];
  }
  

export interface user {
    id: number,
    name: string,
    email: string,
    role: string,
    nickName: string,
    code: string,
}