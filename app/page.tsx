import { redirect } from 'next/navigation';

export default function Page() {
  // Start app on login screen
  redirect('/login');
}
