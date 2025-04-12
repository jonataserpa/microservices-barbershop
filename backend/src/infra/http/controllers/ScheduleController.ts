import { Request, Response } from "express";
import { createScheduleUseCase } from "../../../domain/usecases/schedule";
import { ScheduleStatus } from "../../../domain/entities/Schedule";

export class ScheduleController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { customerId, barberId, date, serviceIds } = req.body;

      // Validação básica
      if (!customerId || !barberId || !date || !serviceIds || !Array.isArray(serviceIds)) {
        return res.status(400).json({ error: "Dados inválidos para o agendamento" });
      }

      const schedule = await createScheduleUseCase.execute({
        customerId,
        barberId,
        date: new Date(date),
        serviceIds
      });

      return res.status(201).json(schedule);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listAll(req: Request, res: Response): Promise<Response> {
    try {
      const schedules = await createScheduleUseCase.scheduleRepository.findAll();
      return res.json(schedules);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const schedule = await createScheduleUseCase.scheduleRepository.findById(id);
      
      if (!schedule) {
        return res.status(404).json({ error: "Agendamento não encontrado" });
      }
      
      return res.json(schedule);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { status, date, serviceIds } = req.body;

      // Validação básica
      if (!status && !date && !serviceIds) {
        return res.status(400).json({ error: "Nenhum dado fornecido para atualização" });
      }

      // Verifica se o status é válido
      if (status && !Object.values(ScheduleStatus).includes(status)) {
        return res.status(400).json({ error: "Status inválido" });
      }

      const schedule = await createScheduleUseCase.scheduleRepository.update(id, {
        status: status as ScheduleStatus,
        date: date ? new Date(date) : undefined,
        serviceIds
      });

      return res.json(schedule);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      await createScheduleUseCase.scheduleRepository.delete(id);
      
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async findByCustomerId(req: Request, res: Response): Promise<Response> {
    try {
      const { customerId } = req.params;
      const schedules = await createScheduleUseCase.scheduleRepository.findByCustomerId(customerId);
      
      return res.json(schedules);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async findByBarberId(req: Request, res: Response): Promise<Response> {
    try {
      const { barberId } = req.params;
      const schedules = await createScheduleUseCase.scheduleRepository.findByBarberId(barberId);
      
      return res.json(schedules);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async findByDate(req: Request, res: Response): Promise<Response> {
    try {
      const { date } = req.query;
      
      if (!date) {
        return res.status(400).json({ error: "Data não fornecida" });
      }
      
      const schedules = await createScheduleUseCase.scheduleRepository.findByDate(new Date(date as string));
      
      return res.json(schedules);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
} 