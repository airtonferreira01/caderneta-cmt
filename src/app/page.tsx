import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/organograma');
  
  // Este código não será executado devido ao redirecionamento
  return null;
}
