/**
 * Formata um valor numérico como moeda brasileira (BRL)
 * @param value - Valor numérico a ser formatado
 * @param decimals - Número de casas decimais (padrão: 2)
 * @returns String formatada como moeda (ex: R$ 1.234,56)
 * @example
 * ```ts
 * formatCurrency(1234.56) // "R$ 1.234,56"
 * formatCurrency(1234.56, 0) // "R$ 1.235"
 * ```
 */
export const formatCurrency = (value: number, decimals = 2): string =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

/**
 * Formata um número com separadores de milhar
 * @param value - Valor numérico a ser formatado
 * @returns String formatada com separadores (ex: 1.234)
 * @example
 * ```ts
 * formatNumber(1234) // "1.234"
 * ```
 */
export const formatNumber = (value: number): string => new Intl.NumberFormat('pt-BR').format(value);

/**
 * Formata um valor numérico como percentual
 * @param value - Valor numérico (0-100)
 * @param decimals - Número de casas decimais (padrão: 2)
 * @returns String formatada como percentual (ex: 25,50%)
 * @example
 * ```ts
 * formatPercentage(25.5) // "25,50%"
 * ```
 */
export const formatPercentage = (value: number, decimals = 2): string =>
  `${value.toFixed(decimals).replace('.', ',')}%`;

/**
 * Compacta números grandes (ex: 1.5K, 2.3M)
 * @param value - Valor numérico a ser compactado
 * @returns String formatada de forma compacta
 * @example
 * ```ts
 * formatCompactNumber(1500) // "1,5 mil"
 * formatCompactNumber(2300000) // "2,3 mi"
 * ```
 */
export const formatCompactNumber = (value: number): string =>
  new Intl.NumberFormat('pt-BR', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);

/**
 * Formata moeda de forma compacta para valores grandes
 * @param value - Valor numérico a ser formatado
 * @returns String formatada como moeda compacta (ex: R$ 1,5 mi)
 * @example
 * ```ts
 * formatCompactCurrency(1500000) // "R$ 1,5 mi"
 * formatCompactCurrency(2500) // "R$ 2,5 mil"
 * ```
 */
export const formatCompactCurrency = (value: number): string => {
  const compact = new Intl.NumberFormat('pt-BR', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
  return `R$ ${compact}`;
};

/**
 * Formata uma data no formato brasileiro (DD/MM/YYYY)
 * @param dateString - String de data no formato ISO ou Date object
 * @param includeTime - Se true, inclui horas e minutos (padrão: false)
 * @returns String formatada como data (ex: 05/11/2025)
 * @example
 * ```ts
 * formatDate('2025-11-05') // "05/11/2025"
 * formatDate('2025-11-05T14:30:00', true) // "05/11/2025 14:30"
 * ```
 */
export const formatDate = (dateString: string | Date, includeTime = false): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

  if (Number.isNaN(date.getTime())) {
    return 'Data inválida';
  }

  if (includeTime) {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};
