import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plano de Chamada',
  description: 'Gerenciamento do plano de chamada para militares',
};

export default function PlanoChamadaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}