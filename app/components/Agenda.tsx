import { useState } from 'react';
import { ChevronLeft, ChevronRight } from './Icons';
import { mockConsultations } from '../data/mockData';

export function Agenda() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const getConsultationsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return mockConsultations.filter(c => c.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && 
                         currentDate.getFullYear() === today.getFullYear();

  return (
    <div className="p-12 max-w-350 mx-auto">
      <div className="mb-12">
        <h1 className="mb-4">Agenda</h1>
        <p className="text-gray-600 text-lg">Gerencie seus horários e consultas</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={previousMonth}
              className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center py-2 text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const consultations = getConsultationsForDay(day);
            const isToday = isCurrentMonth && day === today.getDate();
            const hasConsultations = consultations.length > 0;

            return (
              <div
                key={day}
                className={`aspect-square border rounded-lg p-2 transition-colors ${
                  isToday
                    ? 'border-[#2563EB] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="h-full flex flex-col">
                  <span className={`mb-1 ${isToday ? 'text-[#2563EB]' : 'text-gray-900'}`}>
                    {day}
                  </span>
                  {hasConsultations && (
                    <div className="flex-1 flex flex-col gap-1">
                      {consultations.slice(0, 2).map(consultation => (
                        <div
                          key={consultation.id}
                          className={`text-xs px-2 py-1 rounded ${
                            consultation.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : consultation.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {consultation.time}
                        </div>
                      ))}
                      {consultations.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{consultations.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 pt-8 border-t border-gray-200 flex gap-8">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-green-100 rounded border border-green-200" />
            <span className="text-gray-600 text-lg">Confirmada</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-yellow-100 rounded border border-yellow-200" />
            <span className="text-gray-600 text-lg">Pendente</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-red-100 rounded border border-red-200" />
            <span className="text-gray-600 text-lg">Cancelada</span>
          </div>
        </div>
      </div>
    </div>
  );
}