import MedicalRecordClient from './MedicalRecordClient';

export default async function Page({ searchParams }: { searchParams?: { patientId?: string | string[] } | Promise<{ patientId?: string | string[] }> }) {
  // `searchParams` may be a Promise in some dev environments — unwrap safely
  const resolved = searchParams && typeof (searchParams as { then?: unknown }).then === 'function' ? await searchParams : searchParams as { patientId?: string | string[] } | undefined;
  const raw = resolved?.patientId;
  const patientId = Array.isArray(raw) ? raw[0] : raw;
  return <MedicalRecordClient initialPatientId={patientId} />;
}
