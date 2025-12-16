"use client";

import { useState } from 'react';
import RescheduleModal from './RescheduleModal';

export default function RescheduleButton({ consultationId, currentDate, currentTime }: { consultationId: string; currentDate: string; currentTime: string }) {
  const [open, setOpen] = useState(false);

  const handleSave = (date: string, time: string) => {
    // dispatch a global event so pages can refresh their data
    try {
      window.dispatchEvent(new CustomEvent('consultation:rescheduled', { detail: { id: consultationId, date, time } }));
    } catch {
      // ignore
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Remarcar</button>
      {open && (
        <RescheduleModal
          consultationId={consultationId}
          currentDate={currentDate}
          currentTime={currentTime}
          onClose={() => setOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
