export interface PatientSummary {
  id: number;
  address: string;
  age: number;
  clinic_id: number;
  current_illness: string;
  date_of_birth: string;
  diagnosis: {
    id?: number;
    description: string;
    code: string;
  }[];
  doctor: string;
  email: string;
  familiogram: string;
  family_background: string;
  first_session: string;
  identification: string;
  is_finish_later: boolean;
  last_session: string;
  marital_status: string;
  motive: string;
  name: string;
  occupation: string;
  personal_background: {
    id?: number;
    pathological: string;
    pharmacological: string;
    surgical: string;
    trauma: string;
    allergic: string;
    toxic: string;
    hospitalary: string;
    gestations?: number;
    births?: number;
    caesarean?: number;
    abortions?: number;
    last_menstruation?: string;
    planification?: string;
    menarche?: string;
    cycles?: string;
    pap_smear?: string;
    observations?: string;
    isGinecoObstetric: boolean;
  };
  phone: string;
  physical_exam: {
    id?: number;
    heart_rate: number;
    respiratory_rate: number;
    blood_pressure: string;
    saturation: number;
    temperature: number;
    weight: number;
    size: number;
    imc: number;
    physical_exam: string;
  };
  religious_belief: string;
  system_review: {
    id?: number;
    skin: string;
    collagen: string;
    lymphatic: string;
    auditory: string;
    visual: string;
    respiratory: string;
    digestive: string;
    genitourinary: string;
    musculoskeletal: string;
    feeding: string;
    sleep: string;
    physical_activity: string;
    psychosocial: string;
  };
  treatment: {
    id?: number;
    description: string;
  }[];
  evolution?: EvolutionType[];
}
export interface PatientMainData {
  name: string;
  id: string;
  last_session: string;
  first_session: string;
  patient_id: number;
  is_finish_later: boolean;
}

export interface EvolutionType{
  evolution_id?: number;
  attended_date: string;
  current_illness: string;
  diagnosis: string;
  is_alternative: boolean;
  is_finish_later: boolean;
  motive: string;
  patient_id: number;
  physical_exam: string;
  plan: string;
  therapy: string;
  annotations?: {
    id?: number;
    description: string,
    evolution_id: number,
    created_at: string,
  }[];
}
export interface EvolutionToComplete {
  id: number;
  patient_id: number;
  attended_date: string;
  motive: string;
  current_illness: string;
  physical_exam: string;
  diagnosis: string;
  plan: string;
  is_finish_later: boolean;
  is_alternative: boolean;
  therapy: string;
  patient_name: string;
}

export interface user {
  id: number;
  name: string;
  email: string;
  role: string;
  nickName: string;
  code: string;
}
