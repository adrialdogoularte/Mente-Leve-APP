// Utilitários de performance para o frontend

// Debounce para otimizar chamadas de API
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle para limitar frequência de execução
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

// Cache simples para o frontend
class FrontendCache {
  constructor(defaultTTL = 5 * 60 * 1000) { // 5 minutos por padrão
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  set(key, value, ttl = this.defaultTTL) {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }

  // Limpa entradas expiradas
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// Instância global do cache
export const cache = new FrontendCache();

// Limpar cache expirado a cada 5 minutos
setInterval(() => cache.cleanup(), 5 * 60 * 1000);

// Hook personalizado para cache de API
export const useCachedAPI = (apiCall, cacheKey, dependencies = [], ttl) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Verificar cache primeiro
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        setData(cachedData);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await apiCall();
        setData(result);
        cache.set(cacheKey, result, ttl);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
};

// Lazy loading para componentes
export const LazyComponent = ({ children, fallback = <div>Carregando...</div> }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  );
};

// Otimização de imagens
export const OptimizedImage = ({ src, alt, className, ...props }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...props}
      />
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500">
          Erro ao carregar imagem
        </div>
      )}
    </div>
  );
};

// Medição de performance
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    try {
      const result = await fn(...args);
      const end = performance.now();
      console.log(`${name} executado em ${end - start} ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      console.error(`${name} falhou em ${end - start} ms:`, error);
      throw error;
    }
  };
};

// Batch de requisições
export class RequestBatcher {
  constructor(batchSize = 5, delay = 100) {
    this.batchSize = batchSize;
    this.delay = delay;
    this.queue = [];
    this.processing = false;
  }

  add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.batchSize);
      
      try {
        const promises = batch.map(({ request }) => request());
        const results = await Promise.allSettled(promises);
        
        results.forEach((result, index) => {
          const { resolve, reject } = batch[index];
          if (result.status === 'fulfilled') {
            resolve(result.value);
          } else {
            reject(result.reason);
          }
        });
      } catch (error) {
        batch.forEach(({ reject }) => reject(error));
      }
      
      // Delay entre batches
      if (this.queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, this.delay));
      }
    }
    
    this.processing = false;
  }
}

// Instância global do batcher
export const requestBatcher = new RequestBatcher();

// Preload de recursos
export const preloadResource = (url, type = 'fetch') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  
  switch (type) {
    case 'image':
      link.as = 'image';
      break;
    case 'script':
      link.as = 'script';
      break;
    case 'style':
      link.as = 'style';
      break;
    default:
      link.as = 'fetch';
      link.crossOrigin = 'anonymous';
  }
  
  document.head.appendChild(link);
};

// Service Worker para cache offline
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registrado com sucesso:', registration);
        })
        .catch((registrationError) => {
          console.log('Falha no registro do SW:', registrationError);
        });
    });
  }
};

// Monitoramento de performance
export const performanceMonitor = {
  // Medir tempo de carregamento da página
  measurePageLoad() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      console.log('Tempo de carregamento:', navigation.loadEventEnd - navigation.fetchStart, 'ms');
    });
  },

  // Medir First Contentful Paint
  measureFCP() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          console.log('First Contentful Paint:', entry.startTime, 'ms');
        }
      }
    });
    observer.observe({ entryTypes: ['paint'] });
  },

  // Medir Largest Contentful Paint
  measureLCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('Largest Contentful Paint:', lastEntry.startTime, 'ms');
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  },

  // Inicializar todos os monitores
  init() {
    this.measurePageLoad();
    this.measureFCP();
    this.measureLCP();
  }
};

// Otimização de re-renders
export const memo = React.memo;
export const useMemo = React.useMemo;
export const useCallback = React.useCallback;

// Hook para detectar mudanças de rede
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

