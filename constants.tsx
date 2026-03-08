
import { P4Type, P4Style } from './types';

// Fix: Updated keys to match the P4Type definition ('Predictive', 'Preventive', 'Personalized', 'Participatory')
export const P4_LOGIC: Record<P4Type, P4Style> = {
  Predictive: { 
    color: 'text-blue-500', 
    bg: 'bg-blue-500/10', 
    border: 'border-blue-500/20',
    glow: 'shadow-blue-500/20'
  },
  Preventive: { 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-500/10', 
    border: 'border-emerald-500/20',
    glow: 'shadow-emerald-500/20'
  },
  Personalized: { 
    color: 'text-orange-500', 
    bg: 'bg-orange-500/10', 
    border: 'border-orange-500/20',
    glow: 'shadow-orange-500/20'
  },
  Participatory: { 
    color: 'text-purple-500', 
    bg: 'bg-purple-500/10', 
    border: 'border-purple-500/20',
    glow: 'shadow-purple-500/20'
  }
};

export const DEFAULT_TREATMENTS = [
  { id: '1', name: 'Implante Unitario Premium', price: 1200, description: 'Reposición radicular con titanio grado 5.' },
  { id: '2', name: 'Corona Zirconio', price: 250, description: 'Prótesis estética de alta resistencia.' },
  { id: '3', name: 'Injerto Óseo', price: 450, description: 'Regeneración guiada para estabilidad a largo plazo.' }
];
