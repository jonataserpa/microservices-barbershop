import { z } from 'zod';

/**
 * Verifica se uma string é uma data válida no formato YYYY-MM-DD
 * @param dateStr String contendo a data
 * @returns boolean indicando se a data é válida
 */
const isValidDate = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Verifica se uma data está no passado
 * @param date Data a ser verificada
 * @returns boolean indicando se a data está no passado
 */
const isDateInPast = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

/**
 * Verifica se uma data é um domingo
 * @param date Data a ser verificada
 * @returns boolean indicando se a data é um domingo
 */
const isSunday = (date: Date): boolean => {
  return date.getDay() === 0;
};

/**
 * Schema para validação de relatórios diários
 * Requer uma data válida no formato YYYY-MM-DD
 * Não permite datas futuras
 */
export const dailyReportSchema = z.object({
  date: z.string()
    .refine((str) => isValidDate(str), {
      message: "Data inválida. Use o formato YYYY-MM-DD"
    })
    .transform((str) => {
      const date = new Date(str);
      date.setHours(0, 0, 0, 0);
      return date;
    })
    .refine((date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date <= today;
    }, {
      message: "Não é possível gerar relatório para datas futuras"
    })
});

/**
 * Schema para validação de relatórios mensais
 * Requer um mês (1-12) e um ano (2000-atual)
 * Não permite meses futuros
 */
export const monthlyReportSchema = z.object({
  month: z.number()
    .int("O mês deve ser um número inteiro")
    .min(1, "O mês deve ser entre 1 e 12")
    .max(12, "O mês deve ser entre 1 e 12"),
  year: z.number()
    .int("O ano deve ser um número inteiro")
    .min(2000, "O ano deve ser maior ou igual a 2000")
    .max(new Date().getFullYear(), "O ano não pode ser maior que o ano atual")
}).refine((data) => {
  const currentDate = new Date();
  const reportDate = new Date(data.year, data.month - 1);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  reportDate.setDate(1); // Primeiro dia do mês
  reportDate.setHours(0, 0, 0, 0);
  
  return reportDate <= today;
}, {
  message: "Não é possível gerar relatório para meses futuros",
  path: ["month"] // Indica que o erro está relacionado ao campo month
}); 