import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0a3866] to-[#001e40]">
      {/* Header */}
      <header className="w-full py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-blue-900 font-bold text-lg">EB</span>
          </div>
          <h1 className="text-white font-bold text-xl md:text-2xl">Caderneta CMT</h1>
        </div>
        <nav>
          <ul className="flex space-x-6 text-white">
            <li className="hidden md:block hover:text-yellow-400 transition-colors"><a href="#recursos">Recursos</a></li>
            <li className="hidden md:block hover:text-yellow-400 transition-colors"><a href="#sobre">Sobre</a></li>
            <li className="hidden md:block hover:text-yellow-400 transition-colors"><a href="#contato">Contato</a></li>
            <li>
              <Link href="/login" className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-2 px-4 rounded-lg transition-colors">
                Acessar Sistema
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-16 md:py-24">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Sistema de Organograma Militar Dinâmico
          </h2>
          <p className="text-blue-100 text-lg md:text-xl mb-8 max-w-xl">
            Gerencie e visualize a estrutura organizacional de Unidades Militares do Exército Brasileiro com eficiência e praticidade.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/cadastro" className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-3 px-6 rounded-lg text-center transition-colors">
              Começar Agora
            </Link>
            <a href="#demonstracao" className="bg-transparent border-2 border-white hover:border-yellow-400 text-white hover:text-yellow-400 font-bold py-3 px-6 rounded-lg text-center transition-colors">
              Ver Demonstração
            </a>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md h-80 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-10 bg-white/20 rounded-t-lg flex items-center px-4">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-white/70 text-sm ml-2">Organograma OM</span>
            </div>
            <div className="mt-12 flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-700 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold">CMT</span>
              </div>
              <div className="w-full flex justify-center space-x-8 mb-4">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S1</span>
                </div>
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S2</span>
                </div>
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S3</span>
                </div>
              </div>
              <div className="w-full flex justify-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">1ª Cia</span>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">2ª Cia</span>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">3ª Cia</span>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">4ª Cia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Recursos Principais</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Organograma Dinâmico</h3>
              <p className="text-gray-700">
                Visualize a estrutura organizacional em árvore hierárquica expansível e retrátil. Arraste e solte cards para reorganizar setores e funções.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Gestão de Pessoal</h3>
              <p className="text-gray-700">
                Gerencie dados completos dos militares, incluindo informações pessoais, funções, setores e relações hierárquicas.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Plano de Chamada Georreferenciado</h3>
              <p className="text-gray-700">
                Visualize a distribuição geográfica dos militares em mapa interativo para otimizar o plano de chamada e mobilização.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Controle de Acesso Hierárquico</h3>
              <p className="text-gray-700">
                Sistema de permissões baseado na hierarquia militar, garantindo que cada usuário tenha acesso apenas às informações pertinentes à sua função.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Personalização por Tipo de OM</h3>
              <p className="text-gray-700">
                Adapte o sistema conforme o tipo de Organização Militar (Infantaria, Engenharia, Intendência, etc.) com distintivos e estruturas específicas.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Responsivo e Multiplataforma</h3>
              <p className="text-gray-700">
                Acesse o sistema de qualquer dispositivo, seja desktop, tablet ou smartphone, com interface adaptativa e otimizada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-16 px-6 md:px-12 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Sobre o Sistema</h2>
          
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
              <h3 className="text-2xl font-bold text-blue-800 mb-4">Desenvolvido para o Exército Brasileiro</h3>
              <p className="text-gray-700 mb-4">
                O Sistema de Organograma Militar Dinâmico foi projetado especificamente para atender às necessidades de gestão organizacional das Unidades Militares do Exército Brasileiro.
              </p>
              <p className="text-gray-700 mb-4">
                Utilizando tecnologias modernas como Next.js, PostgreSQL e React Flow, o sistema oferece uma experiência fluida e eficiente para todos os usuários, independentemente de seu nível hierárquico.
              </p>
              <p className="text-gray-700">
                A arquitetura do sistema foi pensada para garantir segurança, desempenho e escalabilidade, permitindo que as OMs gerenciem sua estrutura organizacional de forma intuitiva e eficaz.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h4 className="text-xl font-bold text-blue-900 mb-4">Tecnologias Utilizadas</h4>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-xs">N</span>
                    </div>
                    <span className="text-gray-700">Next.js (App Router, SSR/SSG, otimização de rotas)</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-xs">P</span>
                    </div>
                    <span className="text-gray-700">PostgreSQL com Prisma ORM</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-xs">A</span>
                    </div>
                    <span className="text-gray-700">NextAuth.js para autenticação</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-xs">T</span>
                    </div>
                    <span className="text-gray-700">TailwindCSS e shadcn/ui para interface</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-xs">R</span>
                    </div>
                    <span className="text-gray-700">React Flow para organogramas interativos</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-xs">G</span>
                    </div>
                    <span className="text-gray-700">Google Maps API para georreferenciamento</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demonstracao" className="py-16 px-6 md:px-12 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Veja o Sistema em Ação</h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Assista à demonstração para conhecer as funcionalidades e entender como o Sistema de Organograma Militar Dinâmico pode beneficiar sua Unidade Militar.
          </p>
          
          <div className="bg-black/30 w-full max-w-4xl mx-auto aspect-video rounded-lg flex items-center justify-center">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-blue-100">Clique para assistir à demonstração</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 md:px-12 bg-yellow-500">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">Pronto para Começar?</h2>
          <p className="text-xl text-blue-900 mb-8 max-w-3xl mx-auto">
            Implemente o Sistema de Organograma Militar Dinâmico em sua Unidade Militar e otimize a gestão organizacional.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/cadastro" className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
              Solicitar Acesso
            </Link>
            <a href="#contato" className="bg-transparent border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
              Falar com um Especialista
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Entre em Contato</h2>
          
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nome Completo</label>
                  <input type="text" id="name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">E-mail</label>
                  <input type="email" id="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                </div>
                <div>
                  <label htmlFor="om" className="block text-gray-700 font-medium mb-2">Organização Militar</label>
                  <input type="text" id="om" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Mensagem</label>
                  <textarea id="message" rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"></textarea>
                </div>
                <button type="submit" className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-colors w-full">
                  Enviar Mensagem
                </button>
              </form>
            </div>
            <div className="md:w-1/2">
              <div className="bg-blue-50 p-6 rounded-lg h-full">
                <h3 className="text-xl font-bold text-blue-900 mb-6">Informações de Contato</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900 mb-1">Telefone</h4>
                      <p className="text-gray-700">(61) 3415-5555</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900 mb-1">E-mail</h4>
                      <p className="text-gray-700">contato@caderneta-cmt.eb.mil.br</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900 mb-1">Endereço</h4>
                      <p className="text-gray-700">Quartel-General do Exército, Bloco A, 3º Andar<br />SMU, Brasília - DF, 70630-901</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900 mb-1">Horário de Atendimento</h4>
                      <p className="text-gray-700">Segunda a Sexta: 09:00 - 17:00<br />Finais de Semana: Fechado</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-blue-900 font-bold text-sm">EB</span>
                </div>
                <h3 className="text-white font-bold text-lg">Caderneta CMT</h3>
              </div>
              <p className="text-blue-200 max-w-xs">
                Sistema de Organograma Militar Dinâmico para gerenciamento eficiente da estrutura organizacional das Unidades Militares.
              </p>
            </div>
            
            {/* Resto do footer aqui */}
          </div>
          
          <div className="pt-8 border-t border-blue-800 text-center md:flex md:justify-between md:items-center">
            <p className="text-blue-300 mb-4 md:mb-0">&copy; 2024 Exército Brasileiro. Todos os direitos reservados.</p>
            <div className="flex justify-center space-x-4">
              <a href="#" className="text-blue-300 hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" className="text-blue-300 hover:text-white transition-colors">Política de Privacidade</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
