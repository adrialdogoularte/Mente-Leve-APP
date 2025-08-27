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
} );

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setAuthData = useCallback((userData, accessToken, refreshToken) => {
    if (accessToken) localStorage.setItem('access_token', accessToken);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    if (userData) localStorage.setItem('user', JSON.stringify(userData));
    if (userData) setUser(userData);
  }, []);

  const clearAuthData = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const accessToken = localStorage.getItem('access_token');
        if (storedUser && accessToken) {
          setUser(JSON.parse(storedUser));
        } else {
          clearAuthData();
        }
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [clearAuthData]);

  // Interceptor para adicionar o token de acesso a todas as requisições
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        // Se o erro for 401 e não for a rota de login/refresh, e não for uma requisição já retentada
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          // Se o token de acesso expirou, mas não há refresh token ou o refresh falhou, desloga
          clearAuthData();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [clearAuthData]);

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

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      clearAuthData();
      window.location.href = '/login';
    }
  };

  const atualizarPerfil = async (dadosAtualizados) => {
    try {
      const { data } = await api.put('/perfil', dadosAtualizados);
      const { user: userData } = data;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao atualizar perfil';
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
    api,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
