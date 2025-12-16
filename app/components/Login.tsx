"use client";

import { useState, FormEvent, useEffect } from 'react';
import { Mail, Lock, Heart } from './Icons';
import { authenticate } from '../lib/auth';

interface LoginProps {
  onLogin: (role: 'doctor' | 'patient', patientName?: string) => void;
  onRegister?: () => void;
  onForgotPassword?: () => void;
}

export function Login({ onLogin, onRegister, onForgotPassword }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'doctor' | 'patient'>('doctor');
  const [patientName, setPatientName] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (role === 'patient' && !patientName.trim()) {
      alert('Informe seu nome para continuar como paciente');
      return;
    }
    // For doctors, require email+password authentication
    if (role === 'doctor') {
      if (!email || !password) {
        alert('Informe e-mail e senha');
        return;
      }
      const ok = authenticate(email, password, 'doctor');
      if (!ok) {
        alert('Credenciais inválidas para médico');
        return;
      }
      onLogin(role);
      return;
    }

    onLogin(role, role === 'patient' ? patientName.trim() : undefined);
  };

  useEffect(() => {
    // Pre-fill email if provided via query (e.g., after register)
    let timer: number | undefined;
    try {
      const params = new URLSearchParams(window.location.search);
      const pref = params.get('email');
      if (pref) timer = window.setTimeout(() => setEmail(pref), 0);
      const msg = params.get('msg');
      if (msg === 'registered') window.setTimeout(() => alert('Cadastro realizado. Faça login.'), 0);
      if (msg === 'password_reset') window.setTimeout(() => alert('Senha alterada com sucesso. Faça login.'), 0);
    } catch {
      // ignore
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#2563EB] to-[#16A34A] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-[#2563EB]">MedConnect</h2>
          </div>

          <div className="mb-8">
            <h1 className="mb-2">Bem-vindo de volta</h1>
            <p className="text-gray-600">Faça login para acessar sua conta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4">
              <label className={`px-3 py-2 rounded-lg cursor-pointer ${role === 'doctor' ? 'bg-[#2563EB] text-white' : 'bg-gray-100 text-gray-700'}`}>
                <input className="hidden" type="radio" name="role" value="doctor" checked={role === 'doctor'} onChange={() => setRole('doctor')} />
                Médico
              </label>
              <label className={`px-3 py-2 rounded-lg cursor-pointer ${role === 'patient' ? 'bg-[#2563EB] text-white' : 'bg-gray-100 text-gray-700'}`}>
                <input className="hidden" type="radio" name="role" value="patient" checked={role === 'patient'} onChange={() => setRole('patient')} />
                Paciente
              </label>
            </div>

            {role === 'patient' && (
              <div>
                <label htmlFor="patientName" className="block text-gray-700 mb-2">Nome do paciente</label>
                <input
                  id="patientName"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#2563EB] border-gray-300 rounded focus:ring-[#2563EB]"
                />
                <span>Lembrar-me</span>
              </label>
                <button type="button" onClick={() => onForgotPassword ? onForgotPassword() : alert('Enviar instruções de recuperação (mock)')} className="cursor-pointer text-[#2563EB] hover:underline">
                Esqueci minha senha
              </button>
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full bg-[#2563EB] text-white py-3 rounded-lg hover:bg-[#1E40AF] transition-colors"
            >
              Entrar
            </button>

            <div className="text-center">
              <span className="text-gray-600">Não tem uma conta? </span>
                <button type="button" onClick={() => onRegister ? onRegister() : alert('Abrir cadastro (mock)')} className="cursor-pointer text-[#2563EB] hover:underline">
                Criar conta
              </button>
            </div>
          </form>
        </div>

        {/* Right side - Illustration */}
        <div className="hidden md:block md:w-1/2 bg-linear-to-br from-[#2563EB] to-[#16A34A] p-12 text-white">
          <div className="h-full flex flex-col justify-center">
            <h2 className="mb-4 text-white">Cuidando da sua saúde onde você estiver</h2>
            <p className="mb-8 text-blue-100">
              Conecte-se com profissionais de saúde qualificados através de videochamadas seguras e práticas.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <p>Atendimento humanizado</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <p>Segurança e privacidade</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
