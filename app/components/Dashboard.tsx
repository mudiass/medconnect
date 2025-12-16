"use client";

import { Calendar, Users, Clock, Video } from './Icons';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RescheduleButton from './RescheduleButton';
import { mockDoctor, mockConsultations, mockPatients } from '../data/mockData';

interface DashboardProps {
  onNavigate: (page: string, consultationId?: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [, setTick] = useState(0);
  const router = useRouter();

  function handleLogout() {
    // Clear demo session and redirect to login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('medconnect:role');
      localStorage.removeItem('medconnect:patientName');
    }
    router.push('/login');
  }

  useEffect(() => {
    const onRes = () => setTick((t) => t + 1);
    window.addEventListener('consultation:rescheduled', onRes as EventListener);
    return () => window.removeEventListener('consultation:rescheduled', onRes as EventListener);
  }, []);
  const today = new Date().toISOString().split('T')[0];
  const todayConsultations = mockConsultations.filter(c => c.date === today && c.status !== 'completed');
  const nextConsultation = todayConsultations[0];
  
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Bom dia' : currentHour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className="p-12 max-w-350 mx-auto" data-tailwind-fixed>
      <div className="mb-12">
        <div className="flex items-center justify-between">
          <h1 className="mb-4">{greeting}, {mockDoctor.name.split(' ')[1]}</h1>
          <div className="flex items-center gap-4">
            <a href="/medical-record" className="cursor-pointer text-sm text-[#2563EB] hover:underline">Entrar como Médico</a>
            <button onClick={handleLogout} className="text-sm text-gray-600 hover:underline">Voltar ao login</button>
          </div>
        </div>
        <p className="text-gray-600 text-lg">Aqui está o resumo do seu dia</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
        <div className="bg-white rounded-2xl p-10 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-8 h-8 text-[#2563EB]" />
            </div>
          </div>
          <h3 className="text-gray-900 mb-2">{todayConsultations.length}</h3>
          <p className="text-gray-600 text-lg">Consultas de hoje</p>
        </div>

        <div className="bg-white rounded-2xl p-10 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
              <Clock className="w-8 h-8 text-[#16A34A]" />
            </div>
          </div>
          <h3 className="text-gray-900 mb-2">{nextConsultation?.time || '--:--'}</h3>
          <p className="text-gray-600 text-lg">Próxima consulta</p>
        </div>

        <div className="bg-white rounded-2xl p-10 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <h3 className="text-gray-900 mb-2">{mockPatients.length}</h3>
          <p className="text-gray-600 text-lg">Total de pacientes</p>
        </div>
      </div>

      {/* Upcoming Consultations */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200 flex items-center gap-4">
          <div className="flex-1">
            <h3 className="mb-1">Acessos Rápidos</h3>
            <p className="text-gray-600 text-sm">Escolha se deseja entrar como paciente ou médico.</p>
          </div>
          <div className="flex gap-3">
            <a href="/medical-record/me" className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1E40AF]">Paciente</a>
            <a href="/medical-record" className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Médico</a>
          </div>
        </div>
        <div className="p-10 border-b border-gray-200">
          <h2>Próximas Consultas</h2>
        </div>
        <div className="p-10">
          {todayConsultations.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Nenhuma consulta agendada para hoje</p>
            </div>
          ) : (
            <div className="space-y-6">
              {todayConsultations.map((consultation) => {
                const patient = mockPatients.find(p => p.id === consultation.patientId);
                const overrideRaw = typeof window !== 'undefined' ? localStorage.getItem(`consultation-override:${consultation.id}`) : null;
                const override = overrideRaw ? JSON.parse(overrideRaw) : null;
                const displayDate = override?.date ?? consultation.date;
                const displayTime = override?.time ?? consultation.time;
                
                return (
                  <div
                    key={consultation.id}
                    className="flex items-center justify-between p-8 border border-gray-200 rounded-xl hover:border-[#2563EB] hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-8">
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                        <span className="text-gray-600">
                          {consultation.patientName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-gray-900 mb-3">{consultation.patientName}</h3>
                        <div className="flex items-center gap-6 text-gray-600 text-lg">
                          <Clock className="w-5 h-5" />
                            <span>{displayTime}</span>
                          {patient && (
                            <>
                              <span>•</span>
                              <span>{patient.age} anos</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onNavigate('video-call', consultation.id)}
                          className="cursor-pointer flex items-center gap-3 bg-[#16A34A] text-white px-6 py-3 rounded-xl hover:bg-[#15803D] transition-colors text-lg"
                        >
                          <Video className="w-5 h-5" />
                          Entrar na consulta
                        </button>
                        <RescheduleButton consultationId={consultation.id} currentDate={displayDate} currentTime={displayTime} />
                      </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}