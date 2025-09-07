import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Organograma Militar Dinâmico',
  description: 'Visualização dinâmica da estrutura organizacional militar',
};

export default function OrganogramaLayout({
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