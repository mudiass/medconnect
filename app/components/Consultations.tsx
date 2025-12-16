import { Calendar, Clock, Video } from './Icons';
import { mockConsultations, mockPatients } from '../data/mockData';

interface ConsultationsProps {
  onNavigate: (page: string, consultationId?: string) => void;
}

export function Consultations({ onNavigate }: ConsultationsProps) {
  const upcomingConsultations = mockConsultations.filter(
    c => c.status !== 'completed' && c.status !== 'cancelled'
  ).sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`).getTime();
    const dateB = new Date(`${b.date} ${b.time}`).getTime();
    return dateA - dateB;
  });

  const completedConsultations = mockConsultations.filter(
    c => c.status === 'completed'
  ).sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`).getTime();
    const dateB = new Date(`${b.date} ${b.time}`).getTime();
    return dateB - dateA;
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'scheduled':
        return 'bg-yellow-50 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendente';
      case 'scheduled':
        return 'Agendada';
      case 'cancelled':
        return 'Cancelada';
      case 'completed':
        return 'Concluída';
      default:
        return '—';
    }
  };

  return (
    <div className="p-12 max-w-350 mx-auto">
      <div className="mb-12">
        <h1 className="mb-4">Consultas</h1>
        <p className="text-gray-600 text-lg">Gerencie suas consultas agendadas</p>
      </div>

      {/* Upcoming Consultations */}
      <div className="mb-12">
        <h2 className="mb-8">Próximas Consultas</h2>
        <div className="grid grid-cols-1 gap-6">
          {upcomingConsultations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">Nenhuma consulta agendada</p>
            </div>
          ) : (
            upcomingConsultations.map((consultation) => {
              const patient = mockPatients.find(p => p.id === consultation.patientId);
              
              return (
                <div
                  key={consultation.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 hover:border-[#2563EB] hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 flex-1">
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                        <span className="text-gray-600">
                          {consultation.patientName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-3">{consultation.patientName}</h3>
                        <div className="flex items-center gap-6 text-gray-600 text-lg">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <span>
                              {new Date(consultation.date).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            <span>{consultation.time}</span>
                          </div>
                          {patient && (
                            <span>{patient.age} anos</span>
                          )}
                        </div>
                        {consultation.notes && (
                          <p className="text-gray-600 mt-3 text-lg">{consultation.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-2 rounded-lg ${getStatusColor(consultation.status)}`}>
                        {getStatusText(consultation.status)}
                      </span>
                      <button
                        onClick={() => onNavigate('video-call', consultation.id)}
                        className="cursor-pointer flex items-center gap-3 bg-[#16A34A] text-white px-6 py-3 rounded-xl hover:bg-[#15803D] transition-colors text-lg"
                      >
                        <Video className="w-5 h-5" />
                        Iniciar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Completed Consultations */}
      <div>
        <h2 className="mb-8">Consultas Realizadas</h2>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {completedConsultations.length === 0 ? (
              <div className="p-16 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">Nenhuma consulta realizada ainda</p>
              </div>
            ) : (
              completedConsultations.map((consultation) => {
                
                return (
                  <div key={consultation.id} className="p-8 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-5 flex-1">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                          <span className="text-gray-600">
                            {consultation.patientName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-gray-900 mb-3">{consultation.patientName}</h3>
                          <div className="flex items-center gap-6 text-gray-600 mb-3 text-lg">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-5 h-5" />
                              <span>
                                {new Date(consultation.date).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-5 h-5" />
                              <span>{consultation.time}</span>
                            </div>
                          </div>
                          {consultation.diagnosis && (
                            <div className="mt-3">
                              <p className="text-gray-700 text-lg">Diagnóstico: {consultation.diagnosis}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-lg ${getStatusColor(consultation.status)}`}>
                        {getStatusText(consultation.status)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}