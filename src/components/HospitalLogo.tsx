import React, { useState } from 'react';

interface HospitalLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const HospitalLogo: React.FC<HospitalLogoProps> = ({
  size = 'md',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  // Ukuran proporsional 1:1 (Aspect Ratio 1:1)
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`relative shrink-0 aspect-square ${sizeClasses[size]} ${className}`}>
      {!hasError ? (
        <img
          src="/logo.png"
          alt="Logo RSIA Bunda Asy-Syifa"
          onError={() => setHasError(true)}
          className="w-full h-full object-contain aspect-square select-none"
        />
      ) : (
        <div className="w-full h-full rounded bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 text-[10px] font-bold aspect-square">
          RSIA
        </div>
      )}
    </div>
  );
};
