// Paleta de cores calma e relaxante para o Mente Leve
export const colors = {
  // Cores primárias - tons de azul suave e verde menta
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe', 
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Azul principal mais suave
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e'
  },

  // Cores secundárias - verde menta relaxante
  secondary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6', // Verde menta principal
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a'
  },

  // Cores de humor - tons suaves
  mood: {
    veryBad: '#fecaca',    // Vermelho suave
    bad: '#fed7aa',        // Laranja suave  
    neutral: '#e5e7eb',    // Cinza neutro
    good: '#bbf7d0',       // Verde suave
    veryGood: '#fef3c7'    // Amarelo suave
  },

  // Cores de estado - versões mais suaves
  success: '#10b981',      // Verde sucesso suave
  warning: '#f59e0b',      // Amarelo aviso suave
  error: '#ef4444',        // Vermelho erro suave
  info: '#3b82f6',         // Azul info suave

  // Tons neutros relaxantes
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717'
  },

  // Gradientes suaves
  gradients: {
    primary: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
    secondary: 'linear-gradient(135deg, #14b8a6 0%, #10b981 100%)',
    mood: 'linear-gradient(135deg, #bae6fd 0%, #ccfbf1 100%)',
    sunset: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)'
  },

  // Sombras suaves
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  }
};

// Classes CSS personalizadas para Tailwind
export const customClasses = {
  // Botões com estilo relaxante
  button: {
    primary: 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg',
    secondary: 'bg-white border-2 border-primary-200 text-primary-700 hover:bg-primary-50 font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md',
    mood: 'font-medium py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md'
  },

  // Cards com estilo suave
  card: 'bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-neutral-100',
  
  // Inputs com estilo relaxante
  input: 'w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white',
  
  // Containers principais
  container: 'min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50'
};

export default colors;

