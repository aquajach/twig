import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/LoginForm';
import { readSessionValid } from '@/utils/session/readSessionValid';

export default async function LoginPage() {
  if (await readSessionValid()) {
    redirect('/');
  }
  return <LoginForm />;
}
