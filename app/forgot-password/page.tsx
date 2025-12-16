"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { findUserByEmail, createResetToken } from '../lib/auth';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sentLink, setSentLink] = useState<string | null>(null);

  function handleSend() {
    if (!email.trim()) return alert('Informe o e-mail');
    const user = findUserByEmail(email);
    if (!user) return alert('E-mail não encontrado');
    const token = createResetToken(email);
    if (!token) return alert('Erro ao criar token');
    const link = `${window.location.origin}/forgot-password/reset?email=${encodeURIComponent(email)}&token=${token}`;
    setSentLink(link);
  }

  return (
    <div className="p-12 max-w-2xl mx-auto">
      <h1 className="mb-4">Recuperar senha</h1>
      <p className="text-gray-600 mb-6">Informe seu e-mail e enviaremos instruções para recuperar sua senha.</p>
      <div className="grid grid-cols-1 gap-4">
        <input placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="px-4 py-3 border rounded-lg" />
        <div className="flex gap-2">
          <button onClick={handleSend} className="px-4 py-2 bg-[#2563EB] text-white rounded-lg">Enviar</button>
          <button onClick={() => router.push('/login')} className="px-4 py-2 border rounded-lg">Voltar ao login</button>
        </div>

        {sentLink && (
          <div className="mt-4 bg-green-50 border border-green-100 p-4 rounded">
            <p className="text-sm">Link de recuperação (demo):</p>
            <a className="text-blue-600 break-all" href={sentLink}>{sentLink}</a>
          </div>
        )}
      </div>
    </div>
  );
}
