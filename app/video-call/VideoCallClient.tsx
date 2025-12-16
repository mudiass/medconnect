"use client";

import { VideoCall } from '../../app/components/VideoCall';
import { useRouter } from 'next/navigation';

export default function VideoCallClient({ consultationId }: { consultationId: string }) {
  const router = useRouter();
  return <VideoCall consultationId={consultationId} onNavigate={(page) => page === 'dashboard' ? router.push('/') : router.push('/')} />;
}
