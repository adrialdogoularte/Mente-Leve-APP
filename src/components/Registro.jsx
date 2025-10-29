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
    modalidades_atendimento: [],
    // Campos de consentimento (NOVOS CAMPOS)
    consentimentoTermos: false,
    consentimentoPolitica: false
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

  const modalidadesDisponiveis = [
    { id: 'online', label: 'Online', description: 'Atendimento por videochamada' },
    { id: 'presencial', label: 'Presencial', description: 'Atendimento no consultório' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
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

  const handleModalidadeChange = (modalidade) => {
    const modalidades = formData.modalidades_atendimento.includes(modalidade)
      ? formData.modalidades_atendimento.filter(m => m !== modalidade)
      : [...formData.modalidades_atendimento, modalidade];
    
    setFormData({
      ...formData,
      modalidades_atendimento: modalidades
    });
    
    // Limpar erro quando modalidade for selecionada
    if (modalidades.length > 0) {
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
      modalidades_atendimento: [],
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
    }

    if (tipoUsuario === 'psicologo') {
      if (!formData.crp) {
        return 'CRP é obrigatório';
      }
      if (!formData.especialidades || formData.especialidades.length === 0) {
        return 'Pelo menos uma especialidade deve ser selecionada';
      }
      if (!formData.modalidades_atendimento || formData.modalidades_atendimento.length === 0) {
        return 'Pelo menos uma modalidade de atendimento deve ser selecionada';
      }
    }

    // Validação de Consentimento (NOVA VALIDAÇÃO)
    if (!formData.consentimentoTermos || !formData.consentimentoPolitica) {
      return 'Você deve concordar com os Termos de Uso e a Política de Privacidade para se registrar.';
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
    const commonData = {
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      // Dados de Consentimento (ENVIADOS AO BACKEND)
      consentimentoTermos: formData.consentimentoTermos,
      consentimentoPolitica: formData.consentimentoPolitica,
      versaoTermos: '1.0', // Versão atual dos Termos de Uso
      versaoPolitica: '1.0' // Versão atual da Política de Privacidade
    };

    if (tipoUsuario === 'aluno') {
      result = await registrarAluno({
        ...commonData,
        universidade: formData.universidade,
        curso: formData.curso,
        periodo: formData.periodo
      });
    } else {
      result = await registrarPsicologo({
        ...commonData,
        crp: formData.crp,
        especialidades: formData.especialidades,
        modalidades_atendimento: formData.modalidades_atendimento
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
                    placeholder="seu.email@exemplo.com"
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
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  Confirmar Senha *
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
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Repita sua senha"
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
              <div className="space-y-6 border-t pt-6 mt-6 border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Dados do Aluno</h2>
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
              <div className="space-y-6 border-t pt-6 mt-6 border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Dados do Psicólogo</h2>
                
                {/* CRP */}
                <div>
                  <label htmlFor="crp" className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Registro no CRP *
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
                      placeholder="Ex: 00/123456"
                    />
                  </div>
                </div>

                {/* Especialidades */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especialidades (Mínimo 1) *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {especialidadesDisponiveis.map((especialidade) => (
                      <button
                        key={especialidade}
                        type="button"
                        onClick={() => handleEspecialidadeChange(especialidade)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          formData.especialidades.includes(especialidade)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {especialidade}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Modalidades de Atendimento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modalidades de Atendimento (Mínimo 1) *
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {modalidadesDisponiveis.map((modalidade) => (
                      <div 
                        key={modalidade.id} 
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                          formData.modalidades_atendimento.includes(modalidade.id)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handleModalidadeChange(modalidade.id)}
                      >
                        <input
                          type="checkbox"
                          id={modalidade.id}
                          name="modalidades_atendimento"
                          value={modalidade.id}
                          checked={formData.modalidades_atendimento.includes(modalidade.id)}
                          onChange={() => handleModalidadeChange(modalidade.id)}
                          className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          style={{ display: 'none' }} // Esconde o checkbox nativo
                        />
                        <span className={`h-4 w-4 rounded-full border mr-2 flex items-center justify-center ${
                          formData.modalidades_atendimento.includes(modalidade.id)
                            ? 'bg-green-600 border-green-600'
                            : 'bg-white border-gray-400'
                        }`}>
                          {formData.modalidades_atendimento.includes(modalidade.id) && (
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{modalidade.label}</p>
                          <p className="text-xs text-gray-500">{modalidade.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bloco de Consentimento (NOVO BLOCO) */}
            <div className="space-y-4 border-t pt-6 mt-6 border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Consentimento Legal *</h2>
                <p className="text-sm text-gray-600">Para continuar, você deve ler e concordar com os documentos legais.</p>

                {/* Checkbox Termos de Uso */}
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="consentimentoTermos"
                            name="consentimentoTermos"
                            type="checkbox"
                            checked={formData.consentimentoTermos}
                            onChange={handleChange}
                            required
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="consentimentoTermos" className="font-medium text-gray-700">
                            Eu li e concordo com os <Link to="/termos-uso" target="_blank" className="text-blue-600 hover:text-blue-700 underline">Termos de Uso</Link> (v1.0).
                        </label>
                    </div>
                </div>

                {/* Checkbox Política de Privacidade */}
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="consentimentoPolitica"
                            name="consentimentoPolitica"
                            type="checkbox"
                            checked={formData.consentimentoPolitica}
                            onChange={handleChange}
                            required
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="consentimentoPolitica" className="font-medium text-gray-700">
                            Eu li e concordo com a <Link to="/politica-privacidade" target="_blank" className="text-blue-600 hover:text-blue-700 underline">Política de Privacidade</Link> (v1.0).
                        </label>
                    </div>
                </div>
            </div>

            {/* Botão de Submit */}
            <div>
              <button
                type="submit"
                disabled={loading || !formData.consentimentoTermos || !formData.consentimentoPolitica}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors ${
                  loading || !formData.consentimentoTermos || !formData.consentimentoPolitica
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {loading ? 'Registrando...' : 'Registrar'}
              </button>
            </div>

            {/* Link para Login */}
            <p className="mt-4 text-center text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Faça login
              </Link>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Registro;