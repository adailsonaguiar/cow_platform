import { clsx } from 'clsx';

export function cn(...inputs) {
  return clsx(inputs);
}

export const BLOCK_TYPES = [
  { value: 'quiz', label: 'Quiz', icon: '❓', description: 'Interactive quiz format' },
  { value: 'spinwheel', label: 'Spin Wheel', icon: '🎡', description: 'Spin to win rewards' },
  { value: 'scratch', label: 'Scratch Card', icon: '🎫', description: 'Scratch to reveal' },
  { value: 'countdown', label: 'Countdown', icon: '⏱️', description: 'Time-limited offers' },
  { value: 'gift', label: 'Gift Box', icon: '🎁', description: 'Surprise rewards' },
  { value: 'mysterybox', label: 'Caixa Surpresa', icon: '📦', description: 'Escolha uma caixa e ganhe prêmios' },
];

export const LANGUAGES = [
  { value: 'pt-BR', label: 'Português (BR)', flag: '🇧🇷' },
  { value: 'en-US', label: 'English (US)', flag: '🇺🇸' },
  { value: 'es-ES', label: 'Español', flag: '🇪🇸' },
  { value: 'fr-FR', label: 'Français', flag: '🇫🇷' },
  { value: 'de-DE', label: 'Deutsch', flag: '🇩🇪' },
];

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getBlockTypeInfo(type) {
  return BLOCK_TYPES.find(t => t.value === type) || BLOCK_TYPES[0];
}
