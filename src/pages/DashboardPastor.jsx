// DashboardPastor.jsx (corrigido e limpo)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BsGrid1X2Fill, BsPeopleFill, BsCalendarEvent, BsBook,
  BsFileText, BsBarChartFill, BsGearFill, BsBellFill,
  BsPersonFill, BsEnvelopeFill, BsTelephoneFill
} from 'react-icons/bs';
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
  const [participantes, setParticipantes] = useState([]);

  const sidebarItems = [
    { icon: BsGrid1X2Fill, text: 'Dashboard', active: true },
    { icon: BsPeopleFill, text: 'Grupos' },
    { icon: BsCalendarEvent, text: 'Calendário' },
    { icon: BsBook, text: 'Ciclos' },
    { icon: BsFileText, text: 'Materiais' },
    { icon: BsBarChartFill, text: 'Relatórios' },
    { icon: BsGearFill, text: 'Configurações' },
  ];

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate('/');

      const { data: usuarioData, error: userError } = await supabase
        .from('usuarios').select('*').eq('email', user.email).single();
      if (userError) throw userError;
      setUserData(usuarioData);

      const { data: gruposData, error: gruposError } = await supabase
        .from('grupos')
        .select('*, usuarios!grupos_lider_fkey(nome)');
      if (gruposError) throw gruposError;
      setGrupos(gruposData);

      const { count: participantesCount, error: countError } = await supabase
        .from('participantes')
        .select('*', { count: 'exact' });
      if (countError) throw countError;
      setTotalParticipantes(participantesCount);

      const { data: ciclosData, error: ciclosError } = await supabase
        .from('ciclos')
        .select('numero, total_ciclos')
        .order('data_inicio', { ascending: false })
        .limit(1);
      if (ciclosError) throw ciclosError;
      if (ciclosData?.length > 0) setCicloAtual({ atual: ciclosData[0].numero, total: ciclosData[0].total_ciclos });

      const dataAtual = new Date().toISOString();
      const { data: eventoData, error: eventoError } = await supabase
        .from('eventos')
        .select('*')
        .gte('data', dataAtual)
        .order('data')
        .limit(1);
      if (eventoError) throw eventoError;
      if (eventoData?.length > 0) setProximoEvento(eventoData[0]);

      const primeiroDia = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const ultimoDia = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString();
      const { data: eventosMes, error: eventosError } = await supabase
        .from('eventos')
        .select('*')
        .gte('data', primeiroDia)
        .lte('data', ultimoDia);
      if (eventosError) throw eventosError;
      setEventosDoMes(eventosMes || []);

      const { data: participantesData, error: participantesFetchError } = await supabase
        .from('participantes')
        .select('*, usuarios:usuario_id(*), grupos:grupo_id(*)');
      if (participantesFetchError) throw participantesFetchError;
      setParticipantes(participantesData || []);

    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getTipoColor = (tipo) => tipo === 'pastor'
    ? 'bg-purple-100 text-purple-800'
    : 'bg-blue-100 text-blue-800';

  const formatarData = (iso) => iso ? new Date(iso).toLocaleDateString('pt-BR') : '';
  const calcularDiasRestantes = (iso) => {
    if (!iso) return '';
    const hoje = new Date();
    const evento = new Date(iso);
    const dias = Math.ceil((evento - hoje) / (1000 * 60 * 60 * 24));
    return `Faltam ${dias} dias`;
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
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-4 text-2xl font-bold text-purple-600">Envisionar</div>
        <nav className="mt-8">
          {sidebarItems.map((item, index) => (
            <a key={index} href="#" className={`flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 ${item.active ? 'bg-purple-50 text-purple-600' : ''}`}>
              <item.icon className="w-5 h-5" />
              <span className="ml-3">{item.text}</span>
            </a>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        {/* Participantes */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Participantes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {participantes.map((p, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <BsPersonFill className="w-5 h-5 text-gray-500 mr-2" />
                  <div>
                    <h3 className="font-medium text-gray-800">{p.usuarios?.nome}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getTipoColor(p.usuarios?.tipo)}`}>{p.usuarios?.tipo}</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 flex items-center"><BsPeopleFill className="w-4 h-4 mr-2" />{p.grupos?.nome}</p>
                  <p className="text-gray-600 flex items-center"><BsEnvelopeFill className="w-4 h-4 mr-2" />{p.email}</p>
                  <p className="text-gray-600 flex items-center"><BsTelephoneFill className="w-4 h-4 mr-2" />{p.telefone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPastor;