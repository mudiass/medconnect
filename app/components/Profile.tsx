import Image from 'next/image';
import { Camera, Mail, Phone, Edit } from './Icons';
import { mockDoctor } from '../data/mockData';

export function Profile() {
  return (
    <div className="p-12 max-w-5xl mx-auto">
      <div className="mb-12">
        <h1 className="mb-4">Perfil</h1>
        <p className="text-gray-600 text-lg">Gerencie suas informações pessoais</p>
      </div>

      <div>
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-10">
          <div className="h-40 bg-linear-to-r from-[#2563EB] to-[#16A34A]" />
          <div className="px-10 pb-10">
            <div className="flex items-end justify-between -mt-20 mb-8">
              <div className="relative">
                <Image
                  src={mockDoctor.photo}
                  alt={mockDoctor.name}
                  width={160}
                  height={160}
                  className="w-40 h-40 rounded-full border-4 border-white object-cover"
                />
                  <button className="cursor-pointer absolute bottom-3 right-3 w-12 h-12 bg-[#2563EB] text-white rounded-full flex items-center justify-center hover:bg-[#1E40AF] transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <button className="cursor-pointer flex items-center gap-3 px-6 py-3 bg-[#2563EB] text-white rounded-xl hover:bg-[#1E40AF] transition-colors text-lg">
                <Edit className="w-5 h-5" />
                Editar Perfil
              </button>
            </div>

            <div className="mb-8">
              <h2 className="mb-2">{mockDoctor.name}</h2>
              <p className="text-gray-600 text-lg mb-1">{mockDoctor.specialty}</p>
              <p className="text-gray-600 text-lg">{mockDoctor.crm}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-[#2563EB]" />
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Email</p>
                  <p className="text-gray-900 text-lg">{mockDoctor.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-[#16A34A]" />
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Telefone</p>
                  <p className="text-gray-900 text-lg">(11) 98765-4321</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10">
          <h3 className="mb-6">Informações Profissionais</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-3 text-lg">Especialidade</label>
              <input
                type="text"
                value={mockDoctor.specialty}
                readOnly
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-3 text-lg">CRM</label>
              <input
                type="text"
                value={mockDoctor.crm}
                readOnly
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-3 text-lg">Sobre</label>
              <textarea
                rows={5}
                placeholder="Adicione uma breve descrição sobre você..."
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}