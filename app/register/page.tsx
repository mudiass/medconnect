"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createUser, findUserByEmail } from '../lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'doctor' | 'patient'>('patient');

  function handleRegister() {
    if (!name.trim() || !email.trim() || !password) return alert('Preencha todos os campos');
    if (findUserByEmail(email)) return alert('E-mail já cadastrado');
    const res = createUser({ name: name.trim(), email: email.trim(), password, role });
    if (!res.ok) return alert(res.error ?? 'Erro');
    // redirect to login and prefill email
    router.push(`/login?email=${encodeURIComponent(email)}&msg=registered`);
  }

  return (
    <div className="p-12 max-w-2xl mx-auto">
      <h1 className="mb-4">Criar conta</h1>
      <p className="text-gray-600 mb-6">Cadastre-se para usar o MedConnect. (demo local)</p>
      <div className="grid grid-cols-1 gap-4">
        <input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} className="px-4 py-3 border rounded-lg" />
        <input placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="px-4 py-3 border rounded-lg" />
        <input placeholder="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="px-4 py-3 border rounded-lg" />
        <div className="flex gap-2 items-center">
          <label className={`px-3 py-2 rounded-lg cursor-pointer ${role === 'patient' ? 'bg-[#2563EB] text-white' : 'bg-gray-100 text-gray-700'}`}>
            <input className="hidden" type="radio" name="role" value="patient" checked={role === 'patient'} onChange={() => setRole('patient')} />
            Paciente
          </label>
          <label className={`px-3 py-2 rounded-lg cursor-pointer ${role === 'doctor' ? 'bg-[#2563EB] text-white' : 'bg-gray-100 text-gray-700'}`}>
            <input className="hidden" type="radio" name="role" value="doctor" checked={role === 'doctor'} onChange={() => setRole('doctor')} />
            Médico
          </label>
        </div>
        <div className="flex gap-2">
          <button onClick={handleRegister} className="px-4 py-2 bg-[#2563EB] text-white rounded-lg">Cadastrar</button>
          <button onClick={() => router.push('/login')} className="px-4 py-2 border rounded-lg">Voltar ao login</button>
        </div>
      </div>
    </div>
  );
}
