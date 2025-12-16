export interface Patient {
  id: string;
  name: string;
  age: number;
  email?: string;
  phone?: string;
  lastConsultation?: string; // ISO date string
  medicalHistory?: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status?: 'pending' | 'confirmed' | 'cancelled' | 'scheduled' | 'in_progress' | 'completed';
  diagnosis?: string;
  notes?: string;
  prescription?: string;
}

export const mockDoctor = {
  id: 'doc-1',
  name: 'Dr. João Silva',
  photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&h=400&fit=crop',
  specialty: 'Clínico Geral',
  crm: 'CRM-SP 12345',
  email: 'joao.silva@medconnect.com',
  phone: '+55 11 90000-0000',
};

export const mockPatients: Patient[] = [
  {
    id: 'p-1',
    name: 'Maria Oliveira',
    age: 28,
    email: 'maria.oliveira@example.com',
    phone: '+55 11 91234-5678',
    lastConsultation: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    medicalHistory: 'Alergia a penicilina',
  },
  {
    id: 'p-2',
    name: 'Carlos Pereira',
    age: 45,
    email: 'carlos.pereira@example.com',
    phone: '+55 11 99876-5432',
    lastConsultation: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    medicalHistory: 'Hipertensão controlada',
  },
  {
    id: 'p-3',
    name: 'Ana Costa',
    age: 34,
    email: 'ana.costa@example.com',
    phone: '+55 21 98765-4321',
    lastConsultation: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    medicalHistory: 'Diabetes tipo 2',
  },
];

const today = new Date().toISOString().split('T')[0];

export const mockConsultations: Consultation[] = [
  {
    id: 'c-1',
    patientId: 'p-1',
    patientName: 'Maria Oliveira',
    date: today,
    time: '09:30',
    status: 'scheduled',
    notes: 'Paciente relata dor de cabeça intermitente.',
    prescription: 'Paracetamol 500mg, 1 comprimido a cada 8 horas por 3 dias',
  },
  {
    id: 'c-2',
    patientId: 'p-2',
    patientName: 'Carlos Pereira',
    date: today,
    time: '11:00',
    status: 'scheduled',
    notes: 'Aferição de pressão arterial com resultados elevados.',
  },
  {
    id: 'c-3',
    patientId: 'p-3',
    patientName: 'Ana Costa',
    date: today,
    time: '14:30',
    status: 'scheduled',
    notes: 'Controle glicêmico e orientação sobre dieta.',
  },
];

// No default export needed; keep named exports for testability
