import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina classes CSS usando clsx e tailwind-merge
 * @param inputs - Classes CSS a serem combinadas
 * @returns String com classes CSS combinadas
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
