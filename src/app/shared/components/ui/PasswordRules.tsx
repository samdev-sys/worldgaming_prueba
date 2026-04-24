import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordRulesProps {
  password: string;
  className?: string;
}

interface PasswordRule {
  id: string;
  text: string;
  validator: (password: string) => boolean;
}

const PasswordRules: React.FC<PasswordRulesProps> = ({ password, className = '' }) => {
  const rules: PasswordRule[] = [
    {
      id: 'length',
      text: 'Mínimo 8 caracteres',
      validator: (pwd) => pwd.length >= 8
    },
    {
      id: 'uppercase',
      text: 'Al menos una letra mayúscula',
      validator: (pwd) => /[A-Z]/.test(pwd)
    },
    {
      id: 'lowercase',
      text: 'Al menos una letra minúscula',
      validator: (pwd) => /[a-z]/.test(pwd)
    },
    {
      id: 'number',
      text: 'Al menos un número',
      validator: (pwd) => /\d/.test(pwd)
    },
    {
      id: 'special',
      text: 'Al menos un carácter especial (!@#$%^&*)',
      validator: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
    }
  ];

  const getPasswordStrength = (pwd: string): { level: string; color: string; percentage: number } => {
    const validRules = rules.filter(rule => rule.validator(pwd)).length;
    const percentage = (validRules / rules.length) * 100;

    if (percentage < 40) return { level: 'Débil', color: 'text-red-400', percentage };
    if (percentage < 80) return { level: 'Media', color: 'text-yellow-400', percentage };
    return { level: 'Fuerte', color: 'text-green-400', percentage };
  };

  const strength = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className={`mt-3 p-4 bg-white/5 border border-white/10 rounded-xl ${className}`}>
      {/* Indicador de fortaleza */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white/80">Fortaleza de la contraseña:</span>
          <span className={`text-sm font-semibold ${strength.color}`}>
            {strength.level}
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              strength.percentage < 40 ? 'bg-red-400' :
              strength.percentage < 80 ? 'bg-yellow-400' : 'bg-green-400'
            }`}
            style={{ width: `${strength.percentage}%` }}
          />
        </div>
      </div>

      {/* Reglas */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-white/90 mb-3">Requisitos de contraseña:</h4>
        {rules.map((rule) => {
          const isValid = rule.validator(password);
          return (
            <div key={rule.id} className="flex items-center space-x-3">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                isValid ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {isValid ? (
                  <Check size={12} className="text-green-400" />
                ) : (
                  <X size={12} className="text-red-400" />
                )}
              </div>
              <span className={`text-sm ${
                isValid ? 'text-green-400' : 'text-red-400'
              }`}>
                {rule.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordRules;
