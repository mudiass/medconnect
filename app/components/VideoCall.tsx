"use client";

import { useState, useEffect, useRef } from 'react';
// next/image not needed anymore; we use <video> elements
import { Mic, MicOff, Video, VideoOff, Phone, MessageSquare, FileText, Download } from './Icons';
import { mockConsultations, mockPatients } from '../data/mockData';

interface VideoCallProps {
  consultationId: string;
  onNavigate: (page: string) => void;
}

export function VideoCall({ consultationId, onNavigate }: VideoCallProps) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState(0);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const consultation = mockConsultations.find(c => c.id === consultationId);
  const patient = consultation ? mockPatients.find(p => p.id === consultation.patientId) : null;

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Helper to toggle tracks (declared before any use)
  function setTracksEnabled(stream: MediaStream | null, opts: { audio?: boolean; video?: boolean }) {
    if (!stream) return;
    if (typeof opts.audio === 'boolean') {
      stream.getAudioTracks().forEach(t => (t.enabled = opts.audio!));
    }
    if (typeof opts.video === 'boolean') {
      stream.getVideoTracks().forEach(t => (t.enabled = opts.video!));
    }
  }

  // Request camera and microphone access and attach stream to video elements
  useEffect(() => {
    let cancelled = false;

    async function initMedia() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionError('Navegador não suporta acesso à câmera/microfone.');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cancelled) return;
        localStreamRef.current = stream;

        // Local preview (muted to avoid feedback)
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.muted = true;
          await localVideoRef.current.play().catch(() => {});
        }

        // For this demo we reuse the same stream as the remote stream. In a real app,
        // remote stream will come via WebRTC; keep remote empty until negotiated

        setPermissionError(null);
      } catch (err: unknown) {
        console.error('getUserMedia error', err);
        setPermissionError('Permissão para câmera/microfone foi negada ou houve erro.');
      }
    }

    initMedia();

    return () => {
      cancelled = true;
      // Stop all tracks on unmount
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
        localStreamRef.current = null;
      }
    };
  }, []);

  // --- WebRTC + Signaling logic ---
  useEffect(() => {
    let mounted = true;
    const role = typeof window !== 'undefined' ? (localStorage.getItem('medconnect:role') ?? 'doctor') : 'doctor';
    const room = consultationId;

    async function startSignaling() {
      if (!localStreamRef.current) return;
      try {
        const wsUrl = process.env.NEXT_PUBLIC_SIGNALING_URL ?? 'ws://localhost:4000';
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.addEventListener('open', () => {
          ws.send(JSON.stringify({ type: 'join', room }));
        });

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });
        pcRef.current = pc;

        // Add local tracks
        localStreamRef.current.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current!));

        pc.ontrack = (ev) => {
          if (!mounted) return;
          const [stream] = ev.streams;
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
            remoteVideoRef.current.play().catch(() => {});
            setIsCallConnected(true);
          }
        };

        pc.onicecandidate = (ev) => {
          if (ev.candidate && ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'signal', payload: { kind: 'ice', candidate: ev.candidate } }));
          }
        };

        ws.addEventListener('message', async (ev) => {
          try {
            const msg = JSON.parse(ev.data as string);
            if (msg.type === 'ready') {
              // both peers present - if doctor, be the caller
              if (role === 'doctor') {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                ws.send(JSON.stringify({ type: 'signal', payload: { kind: 'offer', sdp: offer.sdp } }));
              }
            }
            if (msg.type === 'signal') {
              const payload = msg.payload;
              if (payload.kind === 'offer') {
                await pc.setRemoteDescription({ type: 'offer', sdp: payload.sdp });
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                ws.send(JSON.stringify({ type: 'signal', payload: { kind: 'answer', sdp: answer.sdp } }));
              } else if (payload.kind === 'answer') {
                await pc.setRemoteDescription({ type: 'answer', sdp: payload.sdp });
              } else if (payload.kind === 'ice') {
                try {
                  await pc.addIceCandidate(payload.candidate);
                } catch (e) {
                  console.warn('addIceCandidate failed', e);
                }
              }
            }
          } catch (err) {
            console.warn('bad signaling message', err);
          }
        });
      } catch (err) {
        console.error('signaling error', err);
      }
    }

    // start as soon as we have a local stream
    if (localStreamRef.current) startSignaling();

    return () => {
      mounted = false;
      // cleanup
      wsRef.current?.close();
      pcRef.current?.close();
      wsRef.current = null;
      pcRef.current = null;
      setIsCallConnected(false);
    };
  }, [consultationId]);

  const requestPermissions = async () => {
    setPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.muted = true;
        await localVideoRef.current.play().catch(() => {});
      }

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
        await remoteVideoRef.current.play().catch(() => {});
      }

      setTracksEnabled(stream, { audio: isMicOn, video: isCameraOn });
      setPermissionError(null);
    } catch (err) {
      console.error('permission retry error', err);
      setPermissionError('Permissão para câmera/microfone foi negada ou houve erro.');
    }
  };

  // Helper to toggle tracks
  // (duplicate removed; using function declaration above)

  // When toggling mic/camera, update underlying tracks
  useEffect(() => {
    const s = localStreamRef.current;
    if (s) setTracksEnabled(s, { audio: isMicOn });
  }, [isMicOn]);

  useEffect(() => {
    const s = localStreamRef.current;
    if (s) setTracksEnabled(s, { video: isCameraOn });
  }, [isCameraOn]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    if (confirm('Deseja realmente encerrar a consulta?')) {
      onNavigate('dashboard');
    }
  };

  const generateSummary = () => {
    alert('Resumo da consulta gerado! Em uma implementação real, isso geraria um PDF ou documento com as anotações.');
  };

  if (!consultation || !patient) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Consulta não encontrada</p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-[#2563EB] hover:underline"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700">
        <div>
          <h3 className="text-white">{patient.name}</h3>
          <p className="text-gray-400">Consulta em andamento • {formatDuration(duration)}</p>
        </div>
        <div className="text-gray-400 flex items-center gap-4">
          <div>{consultation.time}</div>
          <div className={`text-sm ${isCallConnected ? 'text-green-400' : 'text-yellow-300'}`}>{isCallConnected ? 'Conectado' : 'Aguardando conexão'}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 relative p-4">
          {/* Patient Video (Main) */}
          <div className="w-full h-full bg-gray-800 rounded-xl overflow-hidden relative">
            <video
              ref={remoteVideoRef}
              className="w-full h-full object-cover"
              playsInline
              autoPlay
              muted // in this demo the "remote" video is a reused local stream; keep muted to avoid echo
            />
            {permissionError && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-6">
                <div className="bg-white rounded-lg p-6 text-center max-w-sm w-full">
                  <p className="text-gray-800 mb-4">{permissionError}</p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => requestPermissions()}
                      className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1E40AF] transition-colors"
                    >
                      Tentar novamente
                    </button>
                    <button
                      onClick={() => onNavigate('dashboard')}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Voltar
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
              <p className="text-white">{patient.name}</p>
            </div>
            {!isCameraOn && (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <VideoOff className="w-12 h-12 text-gray-500" />
              </div>
            )}
          </div>

          {/* Doctor Video (PiP) */}
          <div className="absolute bottom-8 right-4 w-32 h-24 sm:w-40 sm:h-28 lg:w-48 lg:h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white shadow-lg">
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover"
              playsInline
              autoPlay
            />
            <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
              <p className="text-white text-sm">Você</p>
            </div>
            {!isCameraOn && (
              <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center">
                <VideoOff className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 md:gap-4">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`cursor-pointer w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-colors ${
                isMicOn
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
              title={isMicOn ? 'Desativar microfone' : 'Ativar microfone'}
            >
              {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>

            <button
              onClick={() => setIsCameraOn(!isCameraOn)}
              className={`cursor-pointer w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-colors ${
                isCameraOn
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
              title={isCameraOn ? 'Desativar câmera' : 'Ativar câmera'}
            >
              {isCameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>

            <button
              onClick={handleEndCall}
              className="cursor-pointer w-12 h-12 md:w-14 md:h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
              title="Encerrar consulta"
            >
              <Phone className="w-6 h-6" />
            </button>

            <button
              onClick={() => setShowChat(!showChat)}
              className="cursor-pointer w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-colors"
              title="Chat"
            >
              <MessageSquare className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Side Panel (hidden on small screens) */}
        <div className="hidden lg:flex lg:w-96 bg-white border-l border-gray-200 flex-col">
          {/* Patient Info */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="mb-4">Dados do Paciente</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600">Nome</p>
                <p className="text-gray-900">{patient.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Idade</p>
                <p className="text-gray-900">{patient.age} anos</p>
              </div>
              <div>
                <p className="text-gray-600">Histórico</p>
                <p className="text-gray-900">{patient.medicalHistory}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="flex-1 p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-gray-600" />
              <h3>Anotações da Consulta</h3>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione suas observações sobre a consulta..."
              className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent resize-none"
            />
            <button
              onClick={generateSummary}
              className="cursor-pointer mt-4 w-full flex items-center justify-center gap-2 bg-[#16A34A] text-white px-4 py-3 rounded-lg hover:bg-[#15803D] transition-colors"
            >
              <Download className="w-4 h-4" />
              Gerar Resumo da Consulta
            </button>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 cursor-pointer" onClick={() => setShowChat(false)}>
          <div className="bg-white rounded-xl w-96 max-h-150 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3>Chat</h3>
              <button onClick={() => setShowChat(false)} className="cursor-pointer text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="text-center text-gray-500 py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhuma mensagem ainda</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Digite uma mensagem..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                />
                <button className="cursor-pointer px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1E40AF] transition-colors">
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
