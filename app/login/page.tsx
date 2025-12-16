"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Login } from '../../app/components/Login';

export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    // if logout flag present, clear stored session (read from window search to avoid useSearchParams SSR issue)
    try {
      const params = new URLSearchParams(window.location.search);
      const logout = params.get('logout');
      if (logout) {
        localStorage.removeItem('medconnect:role');
        localStorage.removeItem('medconnect:patientName');
      }
    } catch {
      // ignore in environments without window
    }
  }, []);

  const onLogin = (role: 'doctor' | 'patient', patientName?: string) => {
    // simple client-side session storage for demo
    localStorage.setItem('medconnect:role', role);
    if (role === 'patient' && patientName) {
      localStorage.setItem('medconnect:patientName', patientName);
    }
    if (role === 'doctor') router.push('/dashboard');
    else router.push('/patient');
  };

  const handleRegister = () => router.push('/register');
  const handleForgot = () => router.push('/forgot-password');

  return <Login onLogin={onLogin} onRegister={handleRegister} onForgotPassword={handleForgot} />;
}
