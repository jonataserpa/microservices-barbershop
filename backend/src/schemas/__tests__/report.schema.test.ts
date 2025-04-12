import { describe, it, expect } from 'vitest';
import { dailyReportSchema, monthlyReportSchema } from '../report.schema';

describe('Report Schemas', () => {
  describe('dailyReportSchema', () => {
    it('deve validar uma data válida no passado', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateStr = yesterday.toISOString().split('T')[0];

      const result = dailyReportSchema.parse({ date: dateStr });
      expect(result.date).toBeInstanceOf(Date);
    });

    it('deve validar a data atual', () => {
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];

      const result = dailyReportSchema.parse({ date: dateStr });
      expect(result.date).toBeInstanceOf(Date);
    });

    it('deve rejeitar uma data inválida', () => {
      expect(() => {
        dailyReportSchema.parse({ date: 'data-invalida' });
      }).toThrow('Data inválida');
    });

    it('deve rejeitar uma data futura', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];

      expect(() => {
        dailyReportSchema.parse({ date: dateStr });
      }).toThrow('Não é possível gerar relatório para datas futuras');
    });
  });

  describe('monthlyReportSchema', () => {
    it('deve validar um mês passado do ano atual', () => {
      const currentDate = new Date();
      const lastMonth = currentDate.getMonth(); // 0-based
      if (lastMonth > 0) {
        const result = monthlyReportSchema.parse({
          month: lastMonth,
          year: currentDate.getFullYear()
        });
        
        expect(result.month).toBe(lastMonth);
        expect(result.year).toBe(currentDate.getFullYear());
      }
    });

    it('deve validar um mês do ano passado', () => {
      const currentDate = new Date();
      const result = monthlyReportSchema.parse({
        month: 12,
        year: currentDate.getFullYear() - 1
      });
      
      expect(result.month).toBe(12);
      expect(result.year).toBe(currentDate.getFullYear() - 1);
    });

    it('deve rejeitar um mês inválido', () => {
      expect(() => {
        monthlyReportSchema.parse({ month: 13, year: 2024 });
      }).toThrow('O mês deve ser entre 1 e 12');
    });

    it('deve rejeitar um ano inválido abaixo do mínimo', () => {
      expect(() => {
        monthlyReportSchema.parse({ month: 1, year: 1999 });
      }).toThrow('O ano deve ser maior ou igual a 2000');
    });

    it('deve rejeitar um ano inválido acima do máximo', () => {
      const nextYear = new Date().getFullYear() + 1;
      expect(() => {
        monthlyReportSchema.parse({ month: 1, year: nextYear });
      }).toThrow('O ano não pode ser maior que o ano atual');
    });

    it('deve rejeitar um mês futuro', () => {
      const currentDate = new Date();
      const nextMonth = (currentDate.getMonth() + 2) % 12 || 12; // Garante um mês válido
      const year = nextMonth === 1 ? currentDate.getFullYear() + 1 : currentDate.getFullYear();
      
      expect(() => {
        monthlyReportSchema.parse({
          month: nextMonth,
          year: year
        });
      }).toThrow('Não é possível gerar relatório para meses futuros');
    });
  });
}); 