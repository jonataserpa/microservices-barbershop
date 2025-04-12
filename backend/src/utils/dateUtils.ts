// Lista de feriados nacionais fixos
const FIXED_HOLIDAYS = [
  { day: 1, month: 1 },   // Ano Novo
  { day: 21, month: 4 },  // Tiradentes
  { day: 1, month: 5 },   // Dia do Trabalho
  { day: 7, month: 9 },   // Independência
  { day: 12, month: 10 }, // Nossa Senhora Aparecida
  { day: 2, month: 11 },  // Finados
  { day: 15, month: 11 }, // Proclamação da República
  { day: 25, month: 12 }, // Natal
];

/**
 * Verifica se a data é um feriado nacional
 * 
 * Esta função verifica apenas os feriados fixos. Feriados móveis como
 * Carnaval, Sexta-feira Santa, etc. não estão incluídos e precisariam
 * de um cálculo adicional.
 */
export function isHoliday(date: Date): boolean {
  const day = date.getDate();
  const month = date.getMonth() + 1; // getMonth() retorna 0-11
  
  return FIXED_HOLIDAYS.some(holiday => holiday.day === day && holiday.month === month);
}

/**
 * Adiciona dias úteis a uma data
 * 
 * @param date Data inicial
 * @param days Número de dias úteis a adicionar
 * @returns Nova data após adicionar os dias úteis
 */
export function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let addedDays = 0;
  
  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    
    // Pula finais de semana e feriados
    const dayOfWeek = result.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday(result)) {
      addedDays++;
    }
  }
  
  return result;
}

/**
 * Formata uma data para o formato DD/MM/YYYY
 */
export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Formata uma data e hora para o formato DD/MM/YYYY HH:MM
 */
export function formatDateTime(date: Date): string {
  const formattedDate = formatDate(date);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${formattedDate} ${hours}:${minutes}`;
} 