'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import Image from 'next/image';
import { Militar } from '@/types/database.types';

interface MilitarNodeData extends Partial<Militar> {
  id: string;
  nome?: string;
  nome_guerra: string;
  posto?: string;
  posto_grad?: string;
  setorNome: string;
  setores?: Array<{ nome: string }>;
}

// Função para determinar a cor de fundo baseada no posto/graduação
const getBackgroundColor = (postoGrad: string) => {
  // Oficiais
  if (postoGrad.includes('Gen') || postoGrad.includes('Cel') || postoGrad.includes('Ten Cel') || 
      postoGrad.includes('Maj') || postoGrad.includes('Cap') || postoGrad.includes('Ten')) {
    return 'bg-blue-50 border-blue-500';
  }
  // Subtenentes e Sargentos
  else if (postoGrad.includes('S Ten') || postoGrad.includes('1º Sgt') || 
           postoGrad.includes('2º Sgt') || postoGrad.includes('3º Sgt')) {
    return 'bg-green-50 border-green-500';
  }
  // Cabos e Soldados
  else if (postoGrad.includes('Cb') || postoGrad.includes('Sd')) {
    return 'bg-yellow-50 border-yellow-500';
  }
  // Padrão
  return 'bg-gray-50 border-gray-500';
};

const MilitarNode = ({ data }: NodeProps<MilitarNodeData>) => {
  const defaultImageUrl = '/placeholder-profile.svg';
  const nodeColorClass = getBackgroundColor(data.posto_grad || '');
  
  return (
    <div className={`border-2 rounded-lg p-3 shadow-md w-64 ${nodeColorClass}`}>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-gray-700" 
      />
      
      <div className="flex items-center mb-2">
        <div className="relative w-16 h-16 mr-3 rounded-full overflow-hidden border-2 border-gray-300 bg-white">
          <Image 
            src={data.foto_url || defaultImageUrl} 
            alt={data.nome_guerra || 'Militar'} 
            fill 
            className="object-cover"
          />
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="font-bold text-lg truncate">{data.posto_grad} {data.nome_guerra}</div>
          <div className="text-sm text-gray-700 truncate">{data.funcao || 'Sem função'}</div>
          <div className="text-xs font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full inline-block mt-1">
            {data.setorNome}
          </div>
        </div>
      </div>
      
      {data.email && (
        <div className="text-xs text-gray-600 truncate mb-1">
          <span className="font-medium">Email:</span> {data.email}
        </div>
      )}
      
      {data.telefone && (
        <div className="text-xs text-gray-600 truncate">
          <span className="font-medium">Tel:</span> {data.telefone}
        </div>
      )}
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-gray-700" 
      />
    </div>
  );
};

export default memo(MilitarNode);