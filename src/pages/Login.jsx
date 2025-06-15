import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Verificar primeiro se o usuário existe na tabela 'usuarios'
      const { data: usuarios, error: queryError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email);
      
      if (queryError) {
        console.error('Erro ao buscar usuário:', queryError);
        throw new Error('Erro ao verificar usuário');
      }
      
      if (!usuarios || usuarios.length === 0) {
        throw new Error('Usuário não encontrado na base de dados');
      }

      const usuario = usuarios[0];

      // Tentar fazer login apenas se o usuário existir
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Mostrar mensagem de boas-vindas
      toast.success(`Bem-vindo, ${usuario.nome} – ${usuario.igreja} – ${usuario.programa}`);

      // Redirecionar baseado no tipo de usuário
      if (usuario.tipo === 'pastor') {
        navigate('/dashboard-pastor');
      } else if (usuario.tipo === 'membro') {
        navigate('/dashboard-membro');
      }
    } catch (error) {
      console.error('Erro completo:', error);
      toast.error(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center space-y-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-gray-900">Envisionar App</h1>
        
        <form onSubmit={handleLogin} className="space-y-6 mt-8">
          <div className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu e-mail"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default Login;