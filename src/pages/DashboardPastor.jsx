import { useState } from 'react';
import { BsGrid1X2Fill, BsPeopleFill, BsCalendarEvent, BsBook, BsFileText, BsBarChartFill, BsGearFill, BsBellFill } from 'react-icons/bs';

const DashboardPastor = () => {
  const [sidebarItems] = useState([
    { icon: BsGrid1X2Fill, text: 'Dashboard', active: true },
    { icon: BsPeopleFill, text: 'Grupos' },
    { icon: BsCalendarEvent, text: 'Calendário' },
    { icon: BsBook, text: 'Ciclos' },
    { icon: BsFileText, text: 'Materiais' },
    { icon: BsBarChartFill, text: 'Relatórios' },
    { icon: BsGearFill, text: 'Configurações' },
  ]);

  const [gruposAtivos] = useState([
    { nome: 'Grupo Alpha', lider: 'Maria Silva', membros: 8, proximoEncontro: '17/04', status: 'Em dia' },
    { nome: 'Grupo Beta', lider: 'José Santos', membros: 12, proximoEncontro: '18/04', status: 'Pendente' },
    { nome: 'Grupo Omega', lider: 'Ana Oliveira', membros: 10, proximoEncontro: '19/04', status: 'Atrasado' },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Em dia': return 'bg-green-100 text-green-800';
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      case 'Atrasado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-4 text-2xl font-bold text-purple-600">Envisionar</div>
        <nav className="mt-8">
          {sidebarItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 ${item.active ? 'bg-purple-50 text-purple-600' : ''}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="ml-3">{item.text}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto">
        {/* Cabeçalho */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-8 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">Implementação de Programas</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-purple-600">
                <BsBellFill className="w-6 h-6" />
              </button>
              <span className="text-gray-700">Pastor João</span>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium">Grupos Ativos</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">12</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium">Participantes</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">87</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium">Ciclo Atual</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">3 de 4</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium">Próximo Evento</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">15/04</p>
            </div>
          </div>

          {/* Evento e Calendário */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Evento */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Encontro Presencial – Ciclo 3</h2>
                  <p className="text-gray-600 mt-1">Segunda-feira, 15 de Abril • 19h30</p>
                  <p className="text-gray-600">Igreja Central</p>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Faltam 12 dias</span>
              </div>
              <div className="mt-4">
                <p className="text-gray-700 mb-4">Material necessário: Apostila Ciclo 3, Bíblia</p>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Ver Detalhes
                </button>
              </div>
            </div>

            {/* Calendário */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Calendário - Abril 2023</h2>
              <div className="grid grid-cols-7 gap-2 text-center mb-4">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
                  <div key={dia} className="text-gray-500 text-sm font-medium">{dia}</div>
                ))}
                {Array.from({ length: 30 }, (_, i) => {
                  const dia = i + 1;
                  const isHighlighted = [3, 10, 17, 24].includes(dia);
                  return (
                    <div
                      key={dia}
                      className={`p-2 rounded-full ${isHighlighted ? 'bg-purple-100 text-purple-800' : 'text-gray-700'}`}
                    >
                      {dia}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="w-3 h-3 bg-purple-100 rounded-full"></span>
                  <span className="text-gray-600">Encontros Presenciais</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabela de Grupos */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Grupos Ativos</h2>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  + Novo Grupo
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome do Grupo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Líder</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Membros</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Próximo Encontro</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {gruposAtivos.map((grupo, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{grupo.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{grupo.lider}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{grupo.membros}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{grupo.proximoEncontro}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(grupo.status)}`}>
                          {grupo.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a href="#" className="text-purple-600 hover:text-purple-800">Ver detalhes</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPastor;