import React, { useState } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DeleteAccountModal = ({ isOpen, onClose }) => {
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { api, logout } = useAuth();
  const confirmationWord = 'EXCLUIR'; // Palavra de confirmação para evitar exclusões acidentais

  if (!isOpen) return null;

  const handleDeleteAccount = async () => {
    if (confirmText !== confirmationWord) {
      setError(`Você deve digitar "${confirmationWord}" para confirmar.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Endpoint para exclusão de conta
      const response = await api.delete('/auth/delete-account');

      if (response.status === 200) {
        // Se a exclusão for bem-sucedida, desloga o usuário
        alert('Sua conta foi excluída com sucesso. Você será redirecionado para a página inicial.');
        logout(); // Redireciona para a página inicial
      } else {
        setError(response.data?.message || 'Erro desconhecido ao excluir a conta.');
      }
    } catch (err) {
      console.error('Erro ao excluir conta:', err);
      setError(err.response?.data?.message || 'Falha na comunicação com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 transform transition-all">
        
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-bold text-red-600">
            <AlertTriangle className="inline h-6 w-6 mr-2" />
            Direito ao Esquecimento
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700">
            Ao solicitar o **Direito ao Esquecimento**, todos os seus dados pessoais serão **permanentemente excluídos** de nossa plataforma, conforme a Lei Geral de Proteção de Dados (LGPD).
          </p>
          <p className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            Esta ação é irreversível. Você perderá todo o seu histórico e acesso à plataforma.
          </p>

          <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mt-4">
            Para confirmar a exclusão, digite a palavra **{confirmationWord}** abaixo:
          </label>
          <input
            id="confirm"
            type="text"
            value={confirmText}
            onChange={(e) => {
              setConfirmText(e.target.value);
              setError('');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            placeholder={confirmationWord}
          />

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={loading || confirmText !== confirmationWord}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Excluindo...</span>
                </>
              ) : (
                <span>Confirmar Exclusão</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
