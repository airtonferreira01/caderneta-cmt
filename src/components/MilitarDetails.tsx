'use client';

import { Militar } from '@/types/database.types';
import Image from 'next/image';

interface MilitarWithSetorNome extends Militar {
  setorNome?: string;
  data_nascimento?: string | null;
  data_praca?: string | null;
  observacoes?: string | null;
}

type MilitarDetailsProps = {
  militar: MilitarWithSetorNome | null;
  onClose: () => void;
};

const MilitarDetails = ({ militar, onClose }: MilitarDetailsProps) => {
  if (!militar) return null;
  
  const defaultImageUrl = '/placeholder-profile.svg';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Cabeçalho */}
        <div className="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-bold">Detalhes do Militar</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Conteúdo */}
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="relative w-24 h-24 mr-4 rounded-full overflow-hidden border-2 border-gray-300">
              <Image 
                src={militar.foto_url || defaultImageUrl} 
                alt={militar.nome_guerra || 'Militar'} 
                fill 
                className="object-cover"
              />
            </div>
            
            <div>
              <h3 className="text-xl font-bold">{militar.posto_grad} {militar.nome_guerra}</h3>
              <p className="text-gray-600">{militar.nome_completo}</p>
              <div className="mt-1 inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                {militar.setorNome || 'Sem setor'}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 mb-6">
            <InfoItem label="Função" value={militar.funcao || 'Não informada'} />
            <InfoItem label="Email" value={militar.email || 'Não informado'} />
            <InfoItem label="Telefone" value={militar.telefone || 'Não informado'} />
            <InfoItem label="Data de Nascimento" value={formatDate(militar.data_nascimento)} />
            <InfoItem label="Data de Praça" value={formatDate(militar.data_praca)} />
          </div>
          
          {militar.observacoes && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Observações</h4>
              <p className="text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
                {militar.observacoes}
              </p>
            </div>
          )}
          
          <button
            onClick={onClose}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-300 mt-4"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="font-medium text-gray-700">{label}:</span> 
    <span className="text-gray-600 ml-2">{value}</span>
  </div>
);

const formatDate = (dateString?: string | null) => {
  if (!dateString) return 'Não informada';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  } catch (error) {
    return 'Data inválida';
  }
};

export default MilitarDetails;