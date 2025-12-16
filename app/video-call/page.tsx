import VideoCallClient from './VideoCallClient';
import Link from 'next/link';

export default async function Page({ searchParams }: { searchParams?: { consultationId?: string | string[] } | Promise<{ consultationId?: string | string[] }> }) {
  const resolved = searchParams && typeof (searchParams as { then?: unknown }).then === 'function' ? await searchParams : searchParams as { consultationId?: string | string[] } | undefined;
  const raw = resolved?.consultationId;
  const consultationId = Array.isArray(raw) ? raw[0] : (raw ?? '');

  if (!consultationId) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Consulta inválida</p>
          <Link href="/" className="text-[#2563EB] hover:underline">Voltar</Link>
        </div>
      </div>
    );
  }

  return <VideoCallClient consultationId={consultationId} />;
}

