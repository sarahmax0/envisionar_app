import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsGrid1X2Fill, BsPeopleFill, BsCalendarEvent, BsBook, BsFileText, BsBarChartFill, BsGearFill, BsBellFill } from 'react-icons/bs';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

const DashboardPastor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [totalParticipantes, setTotalParticipantes] = useState(0);
  const [cicloAtual, setCicloAtual] = useState({ atual: 0, total: 0 });
  const [proximoEvento, setProximoEvento] = useState(null);
  const [eventosDoMes, setEventosDoMes] = useState([]);

  const [sidebarItems] = useState([
    { icon: BsGrid1X2Fill, text: 'Dashboard', active: true },
    { icon: BsPeopleFill, text: 'Grupos' },
    { icon: BsCalendarEvent, text: 'Calendário' },
    { icon: BsBook, text: 'Ciclos' },
    { icon: BsFileText, text: 'Materiais' },
    { icon: BsBarChartFill, text: 'Relatórios' },
    { icon: BsGearFill, text: 'Configurações' },
  ]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);

      // Buscar dados do usuário logado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
        return;
      }

      // Buscar dados completos do usuário
      const { data: usuarioData, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', user.email)
        .single();

      if (userError) throw userError;
      setUserData(usuarioData);

      // Buscar grupos
      const { data: gruposData, error: gruposError } = await supabase
        .from('grupos')
        .select('*, usuarios!grupos_lider_fkey(nome)');

      if (gruposError) throw gruposError;
      setGrupos(gruposData);

      // Buscar total de participantes
      const { count: participantesCount, error: participantesError } = await supabase
        .from('participantes')
        .select('*', { count: true });

      if (participantesError) throw participantesError;
      setTotalParticipantes(participantesCount);

      // Buscar ciclo atual
      const { data: ciclosData, error: ciclosError } = await supabase
        .from('ciclos')
        .select('numero, total_ciclos')
        .order('data_inicio', { ascending: false })
        .limit(1);

      if (ciclosError) throw ciclosError;
      if (ciclosData?.length > 0) {
        setCicloAtual({
          atual: ciclosData[0].numero,
          total: ciclosData[0].total_ciclos
        });
      }

      // Buscar próximo evento
      const dataAtual = new Date().toISOString();
      const { data: eventoData, error: eventoError } = await supabase
        .from('eventos')
        .select('*')
        .gte('data', dataAtual)
        .order('data', { ascending: true })
        .limit(1);

      if (eventoError) throw eventoError;
      if (eventoData?.length > 0) {
        setProximoEvento(eventoData[0]);
      }

      // Buscar eventos do mês atual
      const primeiroDiaMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const ultimoDiaMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString();

      const { data: eventosData, error: eventosError } = await supabase
        .from('eventos')
        .select('*')
        .gte('data', primeiroDiaMes)
        .lte('data', ultimoDiaMes);

      if (eventosError) throw eventosError;
      setEventosDoMes(eventosData || []);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Em dia': return 'bg-green-100 text-green-800';
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      case 'Atrasado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatarData = (dataISO) => {
    if (!dataISO) return '';
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
  };

  const calcularDiasRestantes = (dataEvento) => {
    if (!dataEvento) return '';
    const hoje = new Date();
    const dataFinal = new Date(dataEvento);
    const diferenca = Math.ceil((dataFinal - hoje) / (1000 * 60 * 60 * 24));
    return `Faltam ${diferenca} dias`;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

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
              <span className="text-gray-700">{userData?.nome}</span>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium">Grupos Ativos</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">{grupos.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium">Participantes</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">{totalParticipantes}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium">Ciclo Atual</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">{cicloAtual.atual} de {cicloAtual.total}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium">Próximo Evento</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">{proximoEvento ? formatarData(proximoEvento.data) : '-'}</p>
            </div>
          </div>

          {/* Evento e Calendário */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Evento */}
            {proximoEvento && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{proximoEvento.titulo}</h2>
                    <p className="text-gray-600 mt-1">{formatarData(proximoEvento.data)} • {proximoEvento.horario}</p>
                    <p className="text-gray-600">{proximoEvento.local}</p>
                  </div>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {calcularDiasRestantes(proximoEvento.data)}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-gray-700 mb-4">{proximoEvento.descricao}</p>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Ver Detalhes
                  </button>
                </div>
              </div>
            )}

            {/* Calendário */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Calendário - {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h2>
              <div className="grid grid-cols-7 gap-2 text-center mb-4">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
                  <div key={dia} className="text-gray-500 text-sm font-medium">{dia}</div>
                ))}
                {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }, (_, i) => {
                  const dia = i + 1;
                  const dataAtual = new Date(new Date().getFullYear(), new Date().getMonth(), dia).toISOString();
                  const temEvento = eventosDoMes.some(evento => new Date(evento.data).getDate() === dia);
                  return (
                    <div
                      key={dia}
                      className={`p-2 rounded-full ${temEvento ? 'bg-purple-100 text-purple-800' : 'text-gray-700'}`}
                    >
                      {dia}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="w-3 h-3 bg-purple-100 rounded-full"></span>
                  <span className="text-gray-600">Eventos Programados</span>
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
                  {grupos.map((grupo, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{grupo.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{grupo.usuarios?.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{grupo.total_membros}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{formatarData(grupo.proximo_encontro)}</td>
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