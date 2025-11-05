/**
 * Formata um valor numérico como moeda brasileira (BRL)
 * @param value - Valor numérico a ser formatado
 * @returns String formatada como moeda (ex: R$ 1.234,56)
 * @example
 * ```ts
 * formatCurrency(1234.56) // "R$ 1.234,56"
 * ```
 */
export const formatCurrency = (value: number): string => new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
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
export const formatPercentage = (value: number, decimals = 2): string => `${value.toFixed(decimals).replace('.', ',')}%`;

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
export const formatCompactNumber = (value: number): string => new Intl.NumberFormat('pt-BR', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
