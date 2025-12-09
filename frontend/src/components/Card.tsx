import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({ 
  children, 
  title, 
  className = '',
  onClick,
  hover = false 
}: CardProps) {
  const hoverStyle = hover ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer' : '';
  
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl shadow-md p-6 transition-all duration-200 ${hoverStyle} ${className}`}
    >
      {title && (
        <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b-2 border-gray-100">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}