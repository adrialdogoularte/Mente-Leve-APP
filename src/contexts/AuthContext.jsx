import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setAuthData = useCallback((userData, accessToken, refreshToken) => {
    if (accessToken) localStorage.setItem('access_token', accessToken);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
  }, []);

  const clearAuthData = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    // Apenas redireciona se não estiver na página de login para evitar loop
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor de resposta simplificado - não tenta refresh automático
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Se for erro 401 na rota de refresh, desloga
        if (error.response?.status === 401 && error.config?.url?.includes('/auth/refresh')) {
          clearAuthData();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [clearAuthData]);

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const accessToken = localStorage.getItem('access_token');
        if (storedUser && accessToken) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const atualizarUsuario = (novosDados) => {
    setUser(prevUser => ({
      ...prevUser,
      ...novosDados
    }));
    localStorage.setItem("user", JSON.stringify({
      ...JSON.parse(localStorage.getItem("user")),
      ...novosDados
    }));
  };

  const login = async (email, senha) => {
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { user: userData, access_token, refresh_token } = response.data;
      setAuthData(userData, access_token, refresh_token);
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao fazer login';
      return { success: false, message };
    }
  };

  const registrarAluno = async (dados) => {
    try {
      const { data } = await api.post('/auth/registro-aluno', dados);
      setAuthData(data.user, data.access_token, data.refresh_token);
      return { success: true, user: data.user };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao registrar aluno';
      return { success: false, message };
    }
  };

  const registrarPsicologo = async (dados) => {
    try {
      const { data } = await api.post('/auth/registro-psicologo', dados);
      setAuthData(data.user, data.access_token, data.refresh_token);
      return { success: true, user: data.user };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao registrar psicólogo';
      return { success: false, message };
    }
  };

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro no endpoint de logout, mas deslogando localmente:', error);
    } finally {
      clearAuthData();
    }
  }, [clearAuthData]);

  // Função para tentar renovar o token manualmente quando necessário
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      clearAuthData();
      return null;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/refresh`, { 
        refresh_token: refreshToken 
      });
      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token);
      return access_token;
    } catch (error) {
      console.error('Falha ao renovar token de acesso:', error);
      clearAuthData();
      return null;
    }
  };

  const atualizarPerfil = async (dadosAtualizados) => {
    try {
      // Primeira tentativa com o token atual
      const { data } = await api.put('/perfil', dadosAtualizados);
      const { user: userData } = data;
      
      // Atualiza o usuário no localStorage e no estado
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      // Se for erro 401, tenta renovar o token e fazer nova tentativa
      if (error.response?.status === 401) {
        console.log('Token expirado, tentando renovar...');
        
        const newToken = await refreshAccessToken();
        if (newToken) {
          try {
            // Segunda tentativa com o novo token
            const { data } = await api.put('/perfil', dadosAtualizados);
            const { user: userData } = data;
            
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            
            return { success: true, user: userData };
          } catch (retryError) {
            console.error("Erro na segunda tentativa:", retryError);
            const message = retryError.response?.data?.message || 'Erro ao atualizar perfil após renovação do token.';
            return { success: false, message };
          }
        } else {
          return { success: false, message: 'Sessão expirada. Faça login novamente.' };
        }
      }
      
      console.error("Erro ao atualizar perfil:", error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erro ao atualizar perfil. Verifique os dados e tente novamente.';
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    registrarAluno,
    registrarPsicologo,
    atualizarPerfil,
    atualizarUsuario,
    api,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};