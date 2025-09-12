import React from 'react';
import { useProducto } from '../../hooks/useProducto';

interface DynamicProductImageProps {
  productId: number;
  productName: string;
  fallbackImage?: string;
  className?: string;
  alt?: string;
}

const DynamicProductImage: React.FC<DynamicProductImageProps> = ({
  productId,
  productName,
  fallbackImage = '/equipos-gimnasio-profesionales.webp',
  className = '',
  alt
}) => {
  const { producto } = useProducto(productId);
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = fallbackImage;
  };

  // Usar la imagen del producto actualizada o la imagen de fallback
  const imageSource = producto?.imagen_url || fallbackImage;

  return (
    <img
      src={imageSource}
      alt={alt || productName}
      className={className}
      onError={handleImageError}
    />
  );
};

export default DynamicProductImage;
