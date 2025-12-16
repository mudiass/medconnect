type Role = 'doctor' | 'patient';

interface User {
  name: string;
  email: string;
  password: string; // stored in plain text for demo only
  role: Role;
}

interface ResetToken {
  token: string;
  expiresAt: number;
}

const USERS_KEY = 'medconnect:users';
const RESET_PREFIX = 'medconnect:reset:';

export function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) as User[] : [];
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(u: User): { ok: boolean; error?: string } {
  if (findUserByEmail(u.email)) return { ok: false, error: 'E-mail já cadastrado' };
  const users = getUsers();
  users.push(u);
  saveUsers(users);
  return { ok: true };
}

export function authenticate(email: string, password: string, role?: Role): boolean {
  const user = findUserByEmail(email);
  if (!user) return false;
  if (role && user.role !== role) return false;
  return user.password === password;
}

export function setPassword(email: string, password: string) {
  const users = getUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) return false;
  users[idx].password = password;
  saveUsers(users);
  return true;
}

export function createResetToken(email: string): string | null {
  const user = findUserByEmail(email);
  if (!user) return null;
  const token = `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
  const payload: ResetToken = { token, expiresAt: Date.now() + 1000 * 60 * 60 }; // 1 hour
  localStorage.setItem(RESET_PREFIX + email.toLowerCase(), JSON.stringify(payload));
  return token;
}

export function verifyResetToken(email: string, token: string): boolean {
  try {
    const raw = localStorage.getItem(RESET_PREFIX + email.toLowerCase());
    if (!raw) return false;
    const payload = JSON.parse(raw) as ResetToken;
    if (payload.token !== token) return false;
    if (payload.expiresAt < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export function clearResetToken(email: string) {
  localStorage.removeItem(RESET_PREFIX + email.toLowerCase());
}
