import { useState } from 'react';
import { Search, Eye } from './Icons';
import { mockPatients } from '../data/mockData';

interface PatientsProps {
  onNavigate: (page: string, patientId?: string) => void;
}

export function Patients({ onNavigate }: PatientsProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.email ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-12 max-w-350 mx-auto">
      <div className="mb-12">
        <h1 className="mb-4">Pacientes</h1>
        <p className="text-gray-600 text-lg">Gerencie seus pacientes</p>
      </div>

      {/* Search Bar */}
      <div className="mb-10">
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar paciente por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-8 py-6 text-gray-700 text-lg">Paciente</th>
                <th className="text-left px-8 py-6 text-gray-700 text-lg">Idade</th>
                <th className="text-left px-8 py-6 text-gray-700 text-lg">Contato</th>
                <th className="text-left px-8 py-6 text-gray-700 text-lg">Última Consulta</th>
                <th className="text-left px-8 py-6 text-gray-700 text-lg">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-gray-500 text-lg">
                    Nenhum paciente encontrado
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                          <span className="text-gray-600">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-gray-900 text-lg mb-1">{patient.name}</p>
                          <p className="text-gray-500">{patient.email ?? '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-gray-900 text-lg">{patient.age} anos</td>
                    <td className="px-8 py-6 text-gray-900 text-lg">{patient.phone ?? '-'}</td>
                    <td className="px-8 py-6 text-gray-900 text-lg">
                      {patient.lastConsultation
                        ? new Date(patient.lastConsultation).toLocaleDateString('pt-BR')
                        : '-'}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-3">
                        <button
                          onClick={() => onNavigate('history', patient.id)}
                          className="cursor-pointer flex items-center gap-2 text-[#2563EB] hover:text-[#1E40AF] transition-colors text-lg"
                        >
                          <Eye className="w-5 h-5" />
                          Ver histórico
                        </button>
                        <a
                          href={`/medical-record?patientId=${patient.id}`}
                          className="cursor-pointer flex items-center gap-2 text-[#2563EB] hover:text-[#1E40AF] transition-colors text-lg"
                        >
                          Ver prontuário
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}