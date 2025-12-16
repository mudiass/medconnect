import { ArrowLeft, Calendar, FileText } from './Icons';
import { mockPatients, mockConsultations } from '../data/mockData';

interface HistoryProps {
  patientId: string;
  onNavigate: (page: string) => void;
}

export function History({ patientId, onNavigate }: HistoryProps) {
  const patient = mockPatients.find(p => p.id === patientId);
  const patientConsultations = mockConsultations.filter(
    c => c.patientId === patientId && c.status === 'completed'
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!patient) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Paciente não encontrado</p>
          <button
            onClick={() => onNavigate('patients')}
            className="cursor-pointer mt-4 text-[#2563EB] hover:underline"
          >
            Voltar para pacientes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-12 max-w-350 mx-auto">
      <button
        onClick={() => onNavigate('patients')}
        className="cursor-pointer flex items-center gap-3 text-gray-600 hover:text-gray-900 mb-10 transition-colors text-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar
      </button>

      {/* Patient Info */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 mb-10">
        <div className="flex items-start gap-6 mb-8">
          <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 text-2xl">
              {patient.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="mb-3">{patient.name}</h2>
            <div className="grid grid-cols-2 gap-6 text-gray-600 text-lg">
              <div>
                <p>Idade: {patient.age} anos</p>
                <p>Email: {patient.email}</p>
              </div>
              <div>
                <p>Telefone: {patient.phone}</p>
                <p>Última consulta: {patient.lastConsultation 
                  ? new Date(patient.lastConsultation).toLocaleDateString('pt-BR')
                  : '-'
                }</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <h3 className="mb-3">Histórico Médico</h3>
          <p className="text-gray-600 text-lg leading-relaxed">{patient.medicalHistory}</p>
        </div>
      </div>

      {/* Consultation History */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-10 border-b border-gray-200">
          <h2>Histórico de Consultas</h2>
        </div>
        <div className="p-10">
          {patientConsultations.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Nenhuma consulta realizada ainda</p>
            </div>
          ) : (
            <div className="space-y-8">
              {patientConsultations.map((consultation) => (
                <div key={consultation.id} className="border border-gray-200 rounded-xl p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Calendar className="w-7 h-7 text-[#2563EB]" />
                      </div>
                      <div>
                        <h3 className="text-gray-900 mb-2">
                          {new Date(consultation.date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </h3>
                        <p className="text-gray-600 text-lg">{consultation.time}</p>
                      </div>
                    </div>
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                      Concluída
                    </span>
                  </div>

                  {consultation.notes && (
                    <div className="mb-5">
                      <p className="text-gray-900 mb-2 text-lg">Observações:</p>
                      <p className="text-gray-600 text-lg leading-relaxed">{consultation.notes}</p>
                    </div>
                  )}

                  {consultation.diagnosis && (
                    <div className="mb-5">
                      <p className="text-gray-900 mb-2 text-lg">Diagnóstico:</p>
                      <p className="text-gray-600 text-lg leading-relaxed">{consultation.diagnosis}</p>
                    </div>
                  )}

                  {consultation.prescription && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <p className="text-gray-900 mb-2 text-lg">Prescrição:</p>
                      <p className="text-gray-600 text-lg leading-relaxed">{consultation.prescription}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}