import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata uma data no formato brasileiro (dd/MM/yyyy)
 * @param date - Data (string ISO ou Date)
 * @returns String formatada no formato brasileiro
 * @example
 * ```ts
 * formatDate('2024-01-15') // "15/01/2024"
 * ```
 */
export const formatDate = (date: string | Date): string => {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '-';
    return format(parsedDate, 'dd/MM/yyyy', { locale: ptBR });
  } catch {
    return '-';
  }
};

/**
 * Formata uma data com hora no formato brasileiro
 * @param date - Data (string ISO ou Date)
 * @returns String formatada (dd/MM/yyyy HH:mm)
 * @example
 * ```ts
 * formatDateTime('2024-01-15T14:30:00') // "15/01/2024 14:30"
 * ```
 */
export const formatDateTime = (date: string | Date): string => {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '-';
    return format(parsedDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  } catch {
    return '-';
  }
};

/**
 * Formata uma data de forma relativa (ex: "há 2 dias")
 * @param date - Data (string ISO ou Date)
 * @returns String formatada de forma relativa
 * @example
 * ```ts
 * formatRelativeDate('2024-01-15') // "15 de janeiro de 2024"
 * ```
 */
export const formatRelativeDate = (date: string | Date): string => {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '-';
    return format(parsedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  } catch {
    return '-';
  }
};

/**
 * Formata apenas o mês e ano
 * @param date - Data (string ISO ou Date)
 * @returns String formatada (MMMM/yyyy)
 * @example
 * ```ts
 * formatMonthYear('2024-01-15') // "Janeiro/2024"
 * ```
 */
export const formatMonthYear = (date: string | Date): string => {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '-';
    return format(parsedDate, 'MMMM/yyyy', { locale: ptBR });
  } catch {
    return '-';
  }
};
