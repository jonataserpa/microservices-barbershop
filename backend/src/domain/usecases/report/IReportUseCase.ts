import { ScheduleStatus } from '../../entities/Schedule';

export interface DailyReport {
  date: Date;
  totalSchedules: number;
  schedulesByStatus: Record<ScheduleStatus, number>;
  totalRevenue: number;
}

export interface MonthlyReport {
  month: number;
  year: number;
  totalSchedules: number;
  schedulesByStatus: Record<ScheduleStatus, number>;
  totalRevenue: number;
  averageDailySchedules: number;
  topServices: Array<{
    serviceId: string;
    serviceName: string;
    count: number;
    revenue: number;
  }>;
  topBarbers: Array<{
    barberId: string;
    barberName: string;
    completedSchedules: number;
    revenue: number;
  }>;
}

export interface IReportUseCase {
  getDailyReport(date: Date): Promise<DailyReport>;
  getMonthlyReport(month: number, year: number): Promise<MonthlyReport>;
} 