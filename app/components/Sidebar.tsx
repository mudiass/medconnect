import { LayoutDashboard, Calendar, Users, User, LogOut, Video } from './Icons';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'consultations', label: 'Consultas', icon: Video },
    { id: 'patients', label: 'Pacientes', icon: Users },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <aside className="w-80 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-10 border-b border-gray-200">
        <h2 className="text-[#2563EB]">MedConnect</h2>
      </div>
      
      <nav className="flex-1 p-8">
        <ul className="space-y-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`cursor-pointer w-full flex items-center gap-5 px-6 py-5 rounded-xl transition-colors text-lg ${
                    isActive
                      ? 'bg-[#2563EB] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-6 border-t border-gray-200">
        <div className="mb-4">
          <h4 className="text-sm text-gray-600 mb-2">Acessos Rápidos</h4>
          <div className="flex gap-2">
            <a href="/medical-record/me" className="text-sm px-3 py-2 bg-[#2563EB] text-white rounded-md hover:bg-[#1E40AF]">Paciente</a>
            <a href="/medical-record" className="text-sm px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50">Médico</a>
          </div>
        </div>
      </div>

      <div className="p-8 border-t border-gray-200">
        <a href="/login?logout=1" className="w-full flex items-center gap-5 px-6 py-5 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-lg">
          <LogOut className="w-6 h-6" />
          <span>Sair</span>
        </a>
      </div>
    </aside>
  );
}