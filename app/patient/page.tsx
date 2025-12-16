"use client";

import { mockConsultations, type Consultation } from '../../app/data/mockData';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RescheduleButton from '../../app/components/RescheduleButton';

export default function PatientPage() {
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  const [, setTick] = useState(0);

  useEffect(() => {
    const role = localStorage.getItem('medconnect:role');
    const patientName = localStorage.getItem('medconnect:patientName');
    if (role !== 'patient') {
      // redirect to login if not patient
      router.push('/login');
      return;
    }
    // Defer state updates to avoid synchronous setState within effect and cascading renders
    setTimeout(() => {
      setName(patientName);
      if (patientName) {
        setConsultations(mockConsultations.filter(c => c.patientName.toLowerCase() === patientName.toLowerCase()));
      } else {
        setConsultations([]);
      }
    }, 0);
    const onRes = () => setTick((t) => t + 1);
    window.addEventListener('consultation:rescheduled', onRes as EventListener);
    return () => window.removeEventListener('consultation:rescheduled', onRes as EventListener);
  }, [router]);

  return (
    <div className="p-12 max-w-350 mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="mb-4">Bem-vindo, {name}</h1>
        <div className="text-sm text-gray-600">Área do Paciente</div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <h2 className="mb-4">Suas Consultas</h2>
        {consultations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Nenhuma consulta encontrada para o seu nome</div>
        ) : (
          <div className="space-y-4">
            {consultations.map((c) => {
              const overrideRaw = typeof window !== 'undefined' ? localStorage.getItem(`consultation-override:${c.id}`) : null;
              const override = overrideRaw ? JSON.parse(overrideRaw) : null;
              const displayDate = override?.date ?? c.date;
              const displayTime = override?.time ?? c.time;

              return (
                <div key={c.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="text-gray-900 font-medium">{c.patientName}</div>
                    <div className="text-gray-600">{displayDate} • {displayTime}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={`/video-call?consultationId=${c.id}`} className="px-4 py-2 bg-[#2563EB] text-white rounded-lg">Entrar na consulta</a>
                    <RescheduleButton consultationId={c.id} currentDate={c.date} currentTime={c.time} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
