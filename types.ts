
export enum ViewMode {
  CLINICAL = 'clinical',
  PATIENT = 'patient',
  AUTHORING = 'authoring'
}

export type P4Type = 'Predictive' | 'Preventive' | 'Personalized' | 'Participatory';

export interface P4Style {
  color: string;
  bg: string;
  border: string;
  glow: string;
}

export interface Marker {
  id: number;
  x: string;
  y: string;
  treatment: string;
  price: number;
  p4_category: P4Type;
  description: string;
  detailedDescription: string;
  durationEstimate: string;
  followUpCareInstructions: string;
  type: 'critical' | 'warning';
}

export interface TreatmentItem {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface ClinicalEvidence {
  id: string;
  name: string;
  type: 'xray' | 'photo' | 'scan';
  url: string;
  timestamp: string;
  status: 'syncing' | 'completed' | 'failed';
  analysis?: any;
}
