"use client";

import { useState } from 'react';

interface Props {
  consultationId: string;
  currentDate: string;
  currentTime: string;
  onClose: () => void;
  onSave: (date: string, time: string) => void;
}

export default function RescheduleModal({ consultationId, currentDate, currentTime, onClose, onSave }: Props) {
  const [date, setDate] = useState(currentDate);
  const [time, setTime] = useState(currentTime);

  const handleSave = () => {
    // save override to localStorage
    try {
      localStorage.setItem(`consultation-override:${consultationId}`, JSON.stringify({ date, time }));
    } catch (e) {
      console.error('failed saving override', e);
    }
    onSave(date, time);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-96" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-4">Remarcar Consulta</h3>
        <label className="block text-sm text-gray-700 mb-2">Data</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 border rounded mb-4" />
        <label className="block text-sm text-gray-700 mb-2">Horário</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-3 py-2 border rounded mb-4" />

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 bg-[#2563EB] text-white rounded">Salvar</button>
        </div>
      </div>
    </div>
  );
}
