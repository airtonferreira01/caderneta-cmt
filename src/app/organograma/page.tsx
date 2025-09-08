'use client';

import { useEffect, useState, useCallback } from 'react';
import ReactFlow, { Background, Controls, MiniMap, Node, Edge, useReactFlow, NodeMouseHandler } from 'reactflow';
import 'reactflow/dist/style.css';
import { createBrowserClient } from '@/lib/auth-helpers';
import { Militar, Setor } from '@/types/database.types';
import MilitarNode from '@/components/MilitarNode';
import MilitarDetails from '@/components/MilitarDetails';
import { useRouter } from 'next/navigation';
import { SupabaseClient } from '@supabase/supabase-js';

// Registrando o nó personalizado
const nodeTypes = {
  militar: MilitarNode,
};

export default function Organograma() {
  const [nodes, setNodes] = useState<Node<MilitarWithSetorNome>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  interface MilitarWithSetorNome extends Militar {
    setorNome: string;
  }
  
  const [selectedMilitar, setSelectedMilitar] = useState<MilitarWithSetorNome | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Usar tipagem explícita para o cliente Supabase
        const supabaseClient: SupabaseClient = createBrowserClient();
        
        // Buscar militares
        const { data: militaresData, error: militaresError } = await supabaseClient
          .from('militares')
          .select('*');
          
        if (militaresError) throw militaresError;
        
        // Buscar setores
        const { data: setoresData, error: setoresError } = await supabaseClient
          .from('setores')
          .select('*');
          
        if (setoresError) throw setoresError;
        
        // Transformar dados em nós e arestas para o ReactFlow
        const flowNodes: Node<MilitarWithSetorNome>[] = [];
        const flowEdges: Edge[] = [];
        
        // Criar nós para cada militar
        militaresData.forEach((militar: Militar) => {
          // Encontrar o setor do militar
          const setor = setoresData.find((s: Setor) => s.id === militar.setor_id);
          
          flowNodes.push({
            id: militar.id,
            type: 'militar',
            position: { x: 0, y: 0 }, // Posição será calculada depois
            data: {
              ...militar,
              setorNome: setor?.nome || 'Sem setor',
            },
          });
          
          // Se tiver superior, criar uma aresta
          if (militar.superior_id) {
            flowEdges.push({
              id: `${militar.superior_id}-${militar.id}`,
              source: militar.superior_id,
              target: militar.id,
              type: 'smoothstep',
            });
          }
        });
        
        // Organizar os nós em uma estrutura hierárquica
        organizeHierarchy(flowNodes, flowEdges);
        
        setNodes(flowNodes);
        setEdges(flowEdges);
      } catch (err: unknown) {
        console.error('Erro ao carregar dados:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar o organograma');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Configurar listener para atualizações em tempo real
    const supabaseClient: SupabaseClient = createBrowserClient();
    
    const militaresSubscription = supabaseClient
      .channel('militares-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'militares' }, () => {
        // Recarregar dados quando houver mudanças
        fetchData();
      })
      .subscribe();
      
    const setoresSubscription = supabaseClient
      .channel('setores-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'setores' }, () => {
        // Recarregar dados quando houver mudanças
        fetchData();
      })
      .subscribe();
    
    return () => {
      // Limpar inscrições ao desmontar o componente
      militaresSubscription.unsubscribe();
      setoresSubscription.unsubscribe();
    };
  }, []);
  
  // Função para organizar os nós em uma estrutura hierárquica
  const organizeHierarchy = (nodes: Node<MilitarWithSetorNome>[], edges: Edge[]) => {
    // Encontrar nós raiz (sem superior)
    const rootNodes = nodes.filter(node => {
      return !edges.some(edge => edge.target === node.id);
    });
    
    // Posicionar nós raiz no topo
    rootNodes.forEach((node, index) => {
      node.position = { x: index * 300, y: 0 };
    });
    
    // Função recursiva para posicionar nós filhos
    const positionChildren = (parentId: string, level: number, horizontalOffset: number) => {
      // Encontrar todos os nós filhos deste pai
      const childEdges = edges.filter(edge => edge.source === parentId);
      const childIds = childEdges.map(edge => edge.target);
      const childNodes = nodes.filter(node => childIds.includes(node.id));
      
      // Posicionar cada filho
      childNodes.forEach((childNode, index) => {
        const x = horizontalOffset + index * 200;
        const y = level * 150;
        
        childNode.position = { x, y };
        
        // Posicionar recursivamente os filhos deste nó
        positionChildren(childNode.id, level + 1, x - 100);
      });
    };
    
    // Iniciar posicionamento a partir dos nós raiz
    rootNodes.forEach((rootNode, index) => {
      positionChildren(rootNode.id, 1, index * 300 - 100);
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Carregando organograma...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 mb-4 text-center text-5xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Erro ao carregar o organograma</h2>
          <p className="text-gray-600 mb-6 text-center">{error}</p>
          <button 
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition duration-300"
            onClick={() => router.refresh()}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }
  
  // Função para lidar com o clique em um nó
  const onNodeClick: NodeMouseHandler = (event, node) => {
    // Encontrar o militar correspondente ao nó clicado
    const militar = node.data as MilitarWithSetorNome;
    setSelectedMilitar(militar);
  };
  
  // Função para filtrar nós com base na pesquisa
  const filteredNodes = searchTerm.trim() === '' 
    ? nodes 
    : nodes.filter(node => {
        const data = node.data;
        const searchLower = searchTerm.toLowerCase();
        return (
          data.nome_completo?.toLowerCase().includes(searchLower) ||
          data.nome_guerra?.toLowerCase().includes(searchLower) ||
          data.posto_grad?.toLowerCase().includes(searchLower) ||
          data.funcao?.toLowerCase().includes(searchLower) ||
          data.setorNome?.toLowerCase().includes(searchLower)
        );
      });
  
  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col">
      <div className="p-4 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Organograma Militar</h1>
            <p className="text-sm text-gray-600">Visualização hierárquica da organização militar</p>
          </div>
          
          {/* Barra de pesquisa */}
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Pesquisar militar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Contador de resultados da pesquisa */}
        {searchTerm.trim() !== '' && (
          <div className="text-sm text-gray-600 mt-1">
            Encontrados: <span className="font-medium">{filteredNodes.length}</span> militares
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <ReactFlow
          nodes={filteredNodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          className="bg-gray-100"
          defaultEdgeOptions={{
            type: 'smoothstep',
            style: { stroke: '#64748b', strokeWidth: 2 },
            animated: true
          }}
        >
          <Background color="#e5e7eb" gap={16} size={1} />
          <Controls 
            position="bottom-right"
            showInteractive={false}
            className="bg-white shadow-md rounded-md"
          />
          <MiniMap 
            nodeStrokeColor="#374151"
            nodeColor="#10b981"
            nodeBorderRadius={2}
            maskColor="rgba(229, 231, 235, 0.7)"
            className="bg-white shadow-md rounded-md"
          />
        </ReactFlow>
      </div>
      
      {/* Modal de detalhes do militar */}
      {selectedMilitar && (
        <MilitarDetails 
          militar={selectedMilitar} 
          onClose={() => setSelectedMilitar(null)} 
        />
      )}
    </div>
  );
}