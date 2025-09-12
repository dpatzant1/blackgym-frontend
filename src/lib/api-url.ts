// Helper para construir URLs de la API de forma segura
export const apiURL = (path: string) => {
  const base = (import.meta.env.VITE_API_URL || '').toString().trim();
  const cleanBase = base.replace(/\/+$/g, '');
  const cleanPath = path.replace(/^\/+/, '');

  if (cleanBase) {
    return `${cleanBase}/${cleanPath}`;
  }

  // Fallback: si no hay base definida, devolver ruta relativa para que el frontend intente el mismo host
  return `/${cleanPath}`;
};

export default apiURL;
