"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { verifyResetToken, setPassword, clearResetToken } from '../../lib/auth';

export default function ResetPage({ searchParams }: { searchParams?: { email?: string; token?: string } }) {
  const router = useRouter();
  const [valid, setValid] = useState<boolean | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const email = searchParams?.email ?? '';
  const token = searchParams?.token ?? '';

  useEffect(() => {
    // verify token on mount
    let timer: number | undefined;
    try {
      if (!email || !token) {
        // defer state update to avoid synchronous setState within effect
        timer = window.setTimeout(() => setValid(false), 0);
        return;
      }
      const ok = verifyResetToken(email, token);
      timer = window.setTimeout(() => setValid(ok), 0);
    } catch {
      timer = window.setTimeout(() => setValid(false), 0);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [email, token]);

  const handleSet = () => {
    if (!newPassword) return alert('Informe a nova senha');
    const ok = setPassword(email, newPassword);
    if (!ok) return alert('Erro ao atualizar senha');
    clearResetToken(email);
    router.push('/login?msg=password_reset');
  };

  if (valid === null) return <div className="p-12">Verificando...</div>;
  if (!valid) return <div className="p-12">Link inválido ou expirado.</div>;

  return (
    <div className="p-12 max-w-2xl mx-auto">
      <h1 className="mb-4">Redefinir senha</h1>
      <p className="text-gray-600 mb-6">Informe a nova senha para sua conta.</p>
      <div className="grid grid-cols-1 gap-4">
        <input placeholder="Nova senha" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="px-4 py-3 border rounded-lg" />
        <div className="flex gap-2">
          <button onClick={handleSet} className="px-4 py-2 bg-[#2563EB] text-white rounded-lg">Alterar senha</button>
          <button onClick={() => router.push('/login')} className="px-4 py-2 border rounded-lg">Voltar ao login</button>
        </div>
      </div>
    </div>
  );
}
