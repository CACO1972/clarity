
export interface DentalinkTreatment {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  p4_suggestion: 'Predictive' | 'Preventive' | 'Personalized' | 'Participatory';
}

const MOCK_DENTALINK_DB: DentalinkTreatment[] = [
  { 
    id: 'DL001', 
    name: 'Implante de Titanio Grado 5', 
    price: 1200, 
    category: 'Implantología', 
    description: 'Implante de alta biocompatibilidad para reposición de piezas perdidas.',
    p4_suggestion: 'Predictive' 
  },
  { 
    id: 'DL002', 
    name: 'Corona sobre Implante Zirconio', 
    price: 350, 
    category: 'Rehabilitación', 
    description: 'Prótesis fija de alta estética y resistencia sobre pilar de implante.',
    p4_suggestion: 'Personalized' 
  },
  { 
    id: 'DL003', 
    name: 'Limpieza Profunda Ultrasónica', 
    price: 80, 
    category: 'Prevención', 
    description: 'Eliminación de sarro y placa bacteriana mediante tecnología de ultrasonido.',
    p4_suggestion: 'Preventive' 
  },
  { 
    id: 'DL004', 
    name: 'Endodoncia Pieza unirradicular', 
    price: 150, 
    category: 'Endodoncia', 
    description: 'Tratamiento de conductos para salvar piezas con compromiso pulpar.',
    p4_suggestion: 'Predictive' 
  },
  { 
    id: 'DL005', 
    name: 'Injerto Óseo (Hueso Bovino 0.5g)', 
    price: 450, 
    category: 'Cirugía', 
    description: 'Regeneración ósea guiada para preparar el sitio del implante.',
    p4_suggestion: 'Preventive' 
  },
  { 
    id: 'DL006', 
    name: 'Blanqueamiento Dental LED', 
    price: 200, 
    category: 'Estética', 
    description: 'Aclaramiento dental profesional mediante activación por luz LED.',
    p4_suggestion: 'Participatory' 
  },
  { 
    id: 'DL007', 
    name: 'Férula de Relajación Miorrelajante', 
    price: 180, 
    category: 'Oclusión', 
    description: 'Dispositivo intraoral para tratamiento de bruxismo y tensión muscular.',
    p4_suggestion: 'Preventive' 
  },
  { 
    id: 'DL008', 
    name: 'Carilla de Disilicato de Litio', 
    price: 400, 
    category: 'Estética', 
    description: 'Lámina cerámica ultrafina para corrección estética de dientes anteriores.',
    p4_suggestion: 'Personalized' 
  },
];

export const fetchDentalinkTreatments = async (searchTerm: string): Promise<DentalinkTreatment[]> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!searchTerm) return [];
  
  const query = searchTerm.toLowerCase();
  return MOCK_DENTALINK_DB.filter(item => 
    item.name.toLowerCase().includes(query) || 
    item.category.toLowerCase().includes(query)
  );
};
