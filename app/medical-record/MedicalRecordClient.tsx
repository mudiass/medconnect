"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockPatients } from '../data/mockData';

interface RecordData {
  patientId: string;
  name: string;
  age: string;
  allergies: string;
  medications: string;
  medicalHistory: string;
  emergencyContact: string;
}

export default function MedicalRecordClient({ initialPatientId, isPatient }: { initialPatientId?: string; isPatient?: boolean }) {
  const router = useRouter();
  const patientIdFromQuery = initialPatientId ?? '';
  // If rendered as patient mode, treat as patient flow
  const patientMode = Boolean(isPatient);

  const [patientId, setPatientId] = useState<string>(patientIdFromQuery || '');
  const [readOnly, setReadOnly] = useState<boolean>(!!patientIdFromQuery);
  const [tempName, setTempName] = useState<string>('');
  const [data, setData] = useState<RecordData>({
    patientId: patientId || '',
    name: '',
    age: '',
    allergies: '',
    medications: '',
    medicalHistory: '',
    emergencyContact: '',
  });

  useEffect(() => {
    if (patientId) {
      const stored = localStorage.getItem(`medical-record:${patientId}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as RecordData;
          // schedule state update to avoid synchronous setState inside effect
          setTimeout(() => setData(parsed), 0);
          return;
        } catch {
          // continue to load defaults
        }
      }

      const p = mockPatients.find((x) => x.id === patientId);
      if (p) {
        // Defer state update to avoid synchronous setState within effect
        setTimeout(() => {
          setData((d) => ({ ...d, patientId: p.id, name: p.name, age: String(p.age), medicalHistory: p.medicalHistory ?? '' }));
        }, 0);
      }
    }
  }, [patientId]);

  // Patient flow: create or claim a patient id by name
  const handlePatientStart = () => {
    if (!tempName.trim()) return alert('Informe seu nome');

    // check if name matches an existing mock patient
    const existing = mockPatients.find((p) => p.name.toLowerCase() === tempName.trim().toLowerCase());
    if (existing) {
      setPatientId(existing.id);
      setReadOnly(false);
      return;
    }

    // create a local patient id
    const newId = `patient-${Date.now()}`;
    setPatientId(newId);
    setData((d) => ({ ...d, patientId: newId, name: tempName.trim() }));
    setReadOnly(false);
  };

  const handleSave = () => {
    if (!patientId) return alert('Selecione um paciente');
    localStorage.setItem(`medical-record:${patientId}`, JSON.stringify({ ...data, patientId }));
    alert('Prontuário salvo com sucesso.');
    setReadOnly(true);
    router.push(`/medical-record?patientId=${patientId}`);
  };

  const handleChange = (field: keyof RecordData, value: string) => {
    setData((d) => ({ ...d, [field]: value }));
  };

  return (
    <div className="p-12 max-w-5xl mx-auto">
      {patientMode && !patientId ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-6">
          <h2 className="mb-4">Acessar como paciente</h2>
          <p className="text-sm text-gray-600 mb-4">Informe seu nome para criar ou acessar seu prontuário localmente.</p>
          <div className="flex gap-2 items-center">
            <input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Seu nome"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
            />
            <button onClick={handlePatientStart} className="px-4 py-3 bg-[#2563EB] text-white rounded-lg">Continuar</button>
          </div>
        </div>
      ) : null}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="mb-0">Prontuário Médico</h1>
        {!readOnly && (
          <div className="text-sm text-gray-600">Modo de edição — os dados ficam armazenados localmente</div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Paciente</label>
            {patientIdFromQuery ? (
              <select disabled className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100">
                <option>{mockPatients.find((p) => p.id === patientId)?.name ?? '—'}</option>
              </select>
            ) : (
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">Selecione o paciente</option>
                {mockPatients.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Nome</label>
            <input
              value={data.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={readOnly}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Idade</label>
            <input
              value={data.age}
              onChange={(e) => handleChange('age', e.target.value)}
              disabled={readOnly}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Alergias</label>
            <input
              value={data.allergies}
              onChange={(e) => handleChange('allergies', e.target.value)}
              disabled={readOnly}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Medicações</label>
            <input
              value={data.medications}
              onChange={(e) => handleChange('medications', e.target.value)}
              disabled={readOnly}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Histórico Médico</label>
          <textarea
            value={data.medicalHistory}
            onChange={(e) => handleChange('medicalHistory', e.target.value)}
            disabled={readOnly}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg h-32 resize-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Contato de Emergência</label>
          <input
            value={data.emergencyContact}
            onChange={(e) => handleChange('emergencyContact', e.target.value)}
            disabled={readOnly}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex items-center gap-4">
          {readOnly ? (
            <button
              onClick={() => setReadOnly(false)}
              className="cursor-pointer px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1E40AF] transition-colors"
            >
              Editar
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="cursor-pointer px-4 py-2 bg-[#16A34A] text-white rounded-lg hover:bg-[#15803D] transition-colors"
            >
              Salvar Prontuário
            </button>
          )}

          <button
            onClick={() => {
              // Clear demo session and return to login
              if (typeof window !== 'undefined') {
                localStorage.removeItem('medconnect:role');
                localStorage.removeItem('medconnect:patientName');
              }
              router.push('/login');
            }}
            className="cursor-pointer px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Voltar ao login
          </button>
        </div>
      </div>
    </div>
  );
}
