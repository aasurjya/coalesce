import { Metadata } from 'next';
import RegisterClient from './RegisterClient';

export const metadata: Metadata = {
  title: 'Register | COALESCE 2026',
  description: 'Join the most prestigious college event. Secure your spot at COALESCE 2026.',
};

export default function RegisterPage() {
  return <RegisterClient />;
}


