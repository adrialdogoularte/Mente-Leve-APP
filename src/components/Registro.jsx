import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Eye, EyeOff, User, Mail, Lock, GraduationCap, Building, Calendar, FileText, AlertCircle, Heart
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const Registro = () => {
  const [tipoUsuario, setTipoUsuario] = useState('aluno');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    // Campos para aluno
    universidade: '',
    curso: '',
    periodo: '',
    // Campos para psicólogo
    crp: '',
    especialidades: [],
    biografia: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { registrarAluno, registrarPsicologo } = useAuth();
  const navigate = useNavigate();

  const especialidadesDisponiveis = [
    'Ansiedade e Estresse',
    'Depressão',
    'Transtornos de Humor',
    'Terapia Cognitivo-Comportamental',
    'Psicologia Positiva',
    'Relacionamentos',
    'Autoestima',
    'Transtornos Alimentares',
    'Sono e Insônia',
    'Luto e Perda',
    'Trauma e PTSD',
    'Terapia de Casal',
    'Psicologia do Adolescente',
    'Mindfulness e Meditação'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleEspecialidadeChange = (especialidade) => {
    const especialidades = formData.especialidades.includes(especialidade)
      ? formData.especialidades.filter(e => e !== especialidade)
      : [...formData.especialidades, especialidade];
    
    setFormData({
      ...formData,
      especialidades
    });
    
    // Limpar erro quando especialidade for selecionada
    if (especialidades.length > 0) {
      setError('');
    }
  };

  const handleTipoUsuarioChange = (tipo) => {
    setTipoUsuario(tipo);
    // Limpar campos específicos ao mudar tipo
    setFormData({
      ...formData,
      universidade: '',
      curso: '',
      periodo: '',
      crp: '',
      especialidades: [],
      biografia: ''
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.nome || !formData.email || !formData.senha) {
      return 'Todos os campos obrigatórios devem ser preenchidos';
    }

    if (formData.senha !== formData.confirmarSenha) {
      return 'As senhas não coincidem';
    }

    if (formData.senha.length < 8) {
      return 'A senha deve ter pelo menos 8 caracteres';
    }

    if (tipoUsuario === 'aluno') {
      if (!formData.universidade || !formData.curso || !formData.periodo) {
        return 'Todos os campos de aluno são obrigatórios';
      }
    } else if (tipoUsuario === 'psicologo') {
      if (!formData.crp) {
        return 'CRP é obrigatório';
      }
      if (!formData.especialidades || formData.especialidades.length === 0) {
        return 'Pelo menos uma especialidade deve ser selecionada';
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    let result;
    if (tipoUsuario === 'aluno') {
      result = await registrarAluno({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        universidade: formData.universidade,
        curso: formData.curso,
        periodo: formData.periodo
      });
    } else {
      result = await registrarPsicologo({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        crp: formData.crp,
        especialidades: formData.especialidades,
        biografia: formData.biografia
      });
    }

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-3 rounded-full">
                <Heart className="h-8 w-8 text-white" fill="currentColor" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Criar sua conta
            </h1>
            <p className="text-gray-600">
              Junte-se à nossa plataforma de saúde mental
            </p>
          </div>

          {/* Tipo de Usuário */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Tipo de conta
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleTipoUsuarioChange('aluno')}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  tipoUsuario === 'aluno'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <GraduationCap className="h-6 w-6 text-blue-600 mb-2" />
                <h3 className="font-medium text-gray-900">Aluno</h3>
                <p className="text-sm text-gray-600">Acesso a ferramentas de autoavaliação</p>
              </button>
              
              <button
                type="button"
                onClick={() => handleTipoUsuarioChange('psicologo')}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  tipoUsuario === 'psicologo'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <User className="h-6 w-6 text-green-600 mb-2" />
                <h3 className="font-medium text-gray-900">Psicólogo</h3>
                <p className="text-sm text-gray-600">Receba avaliações de alunos</p>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campos Comuns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome */}
              <div className="md:col-span-2">
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome completo *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="senha"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirmar Senha */}
              <div>
                <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar senha *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmarSenha"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirme sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Campos Específicos para Aluno */}
            {tipoUsuario === 'aluno' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 border-t pt-6">
                  Informações Acadêmicas
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Universidade */}
                  <div>
                    <label htmlFor="universidade" className="block text-sm font-medium text-gray-700 mb-2">
                      Universidade *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="universidade"
                        name="universidade"
                        value={formData.universidade}
                        onChange={handleChange}
                        required={tipoUsuario === 'aluno'}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nome da universidade"
                      />
                    </div>
                  </div>

                  {/* Curso */}
                  <div>
                    <label htmlFor="curso" className="block text-sm font-medium text-gray-700 mb-2">
                      Curso *
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="curso"
                        name="curso"
                        value={formData.curso}
                        onChange={handleChange}
                        required={tipoUsuario === 'aluno'}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nome do curso"
                      />
                    </div>
                  </div>

                  {/* Período */}
                  <div className="md:col-span-2">
                    <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 mb-2">
                      Período *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        id="periodo"
                        name="periodo"
                        value={formData.periodo}
                        onChange={handleChange}
                        required={tipoUsuario === 'aluno'}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Selecione o período</option>
                        <option value="1º período">1º período</option>
                        <option value="2º período">2º período</option>
                        <option value="3º período">3º período</option>
                        <option value="4º período">4º período</option>
                        <option value="5º período">5º período</option>
                        <option value="6º período">6º período</option>
                        <option value="7º período">7º período</option>
                        <option value="8º período">8º período</option>
                        <option value="9º período">9º período</option>
                        <option value="10º período">10º período</option>
                        <option value="Pós-graduação">Pós-graduação</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Campos Específicos para Psicólogo */}
            {tipoUsuario === 'psicologo' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 border-t pt-6">
                  Informações Profissionais
                </h3>
                
                {/* CRP */}
                <div>
                  <label htmlFor="crp" className="block text-sm font-medium text-gray-700 mb-2">
                    CRP (Conselho Regional de Psicologia) *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="crp"
                      name="crp"
                      value={formData.crp}
                      onChange={handleChange}
                      required={tipoUsuario === 'psicologo'}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: 12/34567"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Formato: XX/XXXXX</p>
                </div>

                {/* Especialidades */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especialidades * (selecione pelo menos uma)
                  </label>
                  {formData.especialidades.length > 0 && (
                    <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700">
                        {formData.especialidades.length} especialidade(s) selecionada(s)
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {especialidadesDisponiveis.map((especialidade) => (
                      <label key={especialidade} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.especialidades.includes(especialidade)}
                          onChange={() => handleEspecialidadeChange(especialidade)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{especialidade}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Biografia */}
                <div>
                  <label htmlFor="biografia" className="block text-sm font-medium text-gray-700 mb-2">
                    Biografia (opcional)
                  </label>
                  <textarea
                    id="biografia"
                    name="biografia"
                    value={formData.biografia}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Conte um pouco sobre sua experiência e abordagem terapêutica..."
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Faça login aqui
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Registro;
