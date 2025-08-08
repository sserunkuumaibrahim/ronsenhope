import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'primary', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg',
    xl: 'loading-xl'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <span className={`loading loading-spinner ${sizeClasses[size]} text-${color}`}></span>
      {text && <p className="mt-2 text-sm text-base-content/70">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;