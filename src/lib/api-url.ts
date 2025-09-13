// Helper para construir URLs de la API de forma segura y consistente con api-client
export const apiURL = (path: string) => {
  const buildBase = (import.meta.env.VITE_API_URL || '').toString().trim().replace(/\/+$/g, '');

  let resolvedBase: string | undefined = undefined;
  if (buildBase) resolvedBase = buildBase;

  // Intentar override runtime inyectado (window.__ENV__)
  if (!resolvedBase && typeof window !== 'undefined') {
    try {
      const winAny = window as any;
      if (winAny.__ENV__ && winAny.__ENV__.VITE_API_URL) {
        resolvedBase = String(winAny.__ENV__.VITE_API_URL).trim().replace(/\/+$/g, '');
      }
    } catch (e) {
      // ignore
    }
  }

  // Intentar inferir api.<host> si estamos en cliente y no hay base
  if (!resolvedBase && typeof window !== 'undefined') {
    try {
      const host = window.location.hostname.replace(/^www\./, '');

      //Descomentar para producción
      resolvedBase = host.startsWith('api.') ? `${window.location.protocol}//${host}` : `${window.location.protocol}//api.${host}`;
      
      //Comentar para producción
      //resolvedBase = `http://localhost:3000`;
    } catch (e) {
      // ignore
    }
  }

  const cleanPath = path.replace(/^\/+/, '');

  if (resolvedBase) {
    return `${resolvedBase}/${cleanPath}`;
  }

  // Fallback: ruta relativa
  return `/${cleanPath}`;
};

export default apiURL;
