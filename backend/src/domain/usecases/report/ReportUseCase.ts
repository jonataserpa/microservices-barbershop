import { IScheduleRepository } from '../../repositories/IScheduleRepository';
import { IReportUseCase, DailyReport, MonthlyReport } from './IReportUseCase';
import { ScheduleStatus } from '../../entities/Schedule';

export class ReportUseCase implements IReportUseCase {
  constructor(private scheduleRepository: IScheduleRepository) {}

  async getDailyReport(date: Date): Promise<DailyReport> {
    const schedules = await this.scheduleRepository.findByDate(date);

    const schedulesByStatus = schedules.reduce(
      (acc, schedule) => {
        acc[schedule.status] = (acc[schedule.status] || 0) + 1;
        return acc;
      },
      {} as Record<ScheduleStatus, number>,
    );

    const totalRevenue = schedules.reduce((total, schedule) => {
      if (schedule.status === ScheduleStatus.COMPLETED) {
        return (
          total +
          schedule.services.reduce((serviceTotal, scheduleService) => {
            return serviceTotal + Number(scheduleService.price);
          }, 0)
        );
      }
      return total;
    }, 0);

    return {
      date,
      totalSchedules: schedules.length,
      schedulesByStatus,
      totalRevenue,
    };
  }

  async getMonthlyReport(month: number, year: number): Promise<MonthlyReport> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const schedules = await this.scheduleRepository.findByDate(startDate);
    const filteredSchedules = schedules.filter(
      (schedule) => schedule.date >= startDate && schedule.date <= endDate,
    );

    const schedulesByStatus = filteredSchedules.reduce(
      (acc, schedule) => {
        acc[schedule.status] = (acc[schedule.status] || 0) + 1;
        return acc;
      },
      {} as Record<ScheduleStatus, number>,
    );

    const totalRevenue = filteredSchedules.reduce((total, schedule) => {
      if (schedule.status === ScheduleStatus.COMPLETED) {
        return (
          total +
          schedule.services.reduce((serviceTotal, scheduleService) => {
            return serviceTotal + Number(scheduleService.price);
          }, 0)
        );
      }
      return total;
    }, 0);

    // Calcular serviços mais populares
    const serviceStats = filteredSchedules.reduce((acc, schedule) => {
      schedule.services.forEach((scheduleService) => {
        const service = scheduleService.service!;
        if (!acc[service.id]) {
          acc[service.id] = {
            serviceId: service.id,
            serviceName: service.name,
            count: 0,
            revenue: 0,
          };
        }
        acc[service.id].count += 1;
        if (schedule.status === ScheduleStatus.COMPLETED) {
          acc[service.id].revenue += Number(scheduleService.price);
        }
      });
      return acc;
    }, {} as Record<string, { serviceId: string; serviceName: string; count: number; revenue: number }>);

    // Calcular barbeiros mais produtivos
    const barberStats = filteredSchedules.reduce((acc, schedule) => {
      const barber = schedule.barber!;
      if (!acc[barber.id]) {
        acc[barber.id] = {
          barberId: barber.id,
          barberName: barber.user!.name,
          completedSchedules: 0,
          revenue: 0,
        };
      }
      if (schedule.status === ScheduleStatus.COMPLETED) {
        acc[barber.id].completedSchedules += 1;
        acc[barber.id].revenue += schedule.services.reduce(
          (total, scheduleService) => total + Number(scheduleService.price),
          0,
        );
      }
      return acc;
    }, {} as Record<string, { barberId: string; barberName: string; completedSchedules: number; revenue: number }>);

    const daysInMonth = endDate.getDate();

    return {
      month,
      year,
      totalSchedules: filteredSchedules.length,
      schedulesByStatus,
      totalRevenue,
      averageDailySchedules: filteredSchedules.length / daysInMonth,
      topServices: Object.values(serviceStats)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5),
      topBarbers: Object.values(barberStats)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5),
    };
  }
} 