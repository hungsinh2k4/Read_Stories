import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  color: 'purple' | 'pink' | 'blue' | 'green';
  suffix?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, value, label, color, suffix = '' }) => {
  const colorClasses = {
    purple: {
      bg: 'bg-gradient-to-br from-purple-100 to-purple-200',
      icon: 'text-purple-600',
      value: 'text-purple-600'
    },
    pink: {
      bg: 'bg-gradient-to-br from-pink-100 to-pink-200',
      icon: 'text-pink-600',
      value: 'text-pink-600'
    },
    blue: {
      bg: 'bg-gradient-to-br from-blue-100 to-blue-200',
      icon: 'text-blue-600',
      value: 'text-blue-600'
    },
    green: {
      bg: 'bg-gradient-to-br from-green-100 to-green-200',
      icon: 'text-green-600',
      value: 'text-green-600'
    }
  };

  const currentColor = colorClasses[color];

  return (
    <div className={`${currentColor.bg} p-4 rounded-2xl text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
      <div className="flex items-center justify-center mb-2">
        <Icon className={`${currentColor.icon} mr-2`} size={24} />
      </div>
      <div className={`text-3xl font-bold ${currentColor.value}`}>
        {value}{suffix}
      </div>
      <div className="text-sm text-gray-600 font-medium">{label}</div>
    </div>
  );
};

export default StatsCard;
