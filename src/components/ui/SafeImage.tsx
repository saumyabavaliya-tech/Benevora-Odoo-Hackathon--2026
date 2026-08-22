import React, { useState } from 'react';

export const FALLBACK_TRAVEL_IMAGES = [
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80', // scenic road trip
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80', // travel map & camera
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // coastal tropical beach
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80', // Taj Mahal / India heritage
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', // Goa palm beach
  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', // Ahmedabad Adalaj Stepwell heritage
  'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80', // Mumbai Gateway
  'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80', // Jaipur palace
];

export const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'Travel photo',
  className = '',
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  onError,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState<boolean>(false);

  // Sync if src prop changes
  React.useEffect(() => {
    if (src) {
      setImgSrc(src);
      setHasError(false);
    } else {
      setImgSrc(fallbackSrc);
    }
  }, [src, fallbackSrc]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
    if (onError) {
      onError(e);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={handleError}
      className={className}
      loading={props.loading || 'lazy'}
      {...props}
    />
  );
};
