import type { HTMLAttributes } from 'react';

type SpanProps = { className?: string } & HTMLAttributes<HTMLSpanElement>;

export function Calendar({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="calendar" {...props}>📅</span>;
}

export function Users({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="users" {...props}>👥</span>;
}

export function Clock({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="clock" {...props}>⏰</span>;
}

export function Video({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="video" {...props}>🎥</span>;
}

export function ChevronLeft({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="chevron left" {...props}>◀️</span>;
}

export function ChevronRight({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="chevron right" {...props}>▶️</span>;
}

export function X({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="x" {...props}>✖️</span>;
}

export function ArrowLeft({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="arrow left" {...props}>⬅️</span>;
}

export function Mail({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="mail" {...props}>✉️</span>;
}

export function Lock({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="lock" {...props}>🔒</span>;
}

export function Heart({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="heart" {...props}>❤️</span>;
}

export function Search({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="search" {...props}>🔍</span>;
}

export function Eye({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="eye" {...props}>👁️</span>;
}

export function Camera({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="camera" {...props}>📷</span>;
}

export function MapPin({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="map pin" {...props}>📍</span>;
}

export function Edit({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="edit" {...props}>✏️</span>;
}

export function LayoutDashboard({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="dashboard" {...props}>📊</span>;
}

export function User({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="user" {...props}>👤</span>;
}

export function LogOut({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="logout" {...props}>🔓</span>;
}

export function Mic({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="microphone" {...props}>🎙️</span>;
}

export function MicOff({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="mic off" {...props}>🔇</span>;
}

export function VideoOff({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="video off" {...props}>📷❌</span>;
}

export function Phone({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="phone" {...props}>📞</span>;
}

export function MessageSquare({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="message" {...props}>💬</span>;
}

export function FileText({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="file" {...props}>📄</span>;
}

export function Download({ className, ...props }: SpanProps) {
  return <span className={className} role="img" aria-label="download" {...props}>⬇️</span>;
}

