import { Request, Response } from "express";
import { barberRepository, userRepository } from "../../../infra/database";

export class BarberController {
  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const barbers = await barberRepository.findAll();
      return res.json(barbers);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const barber = await barberRepository.findById(id);
      
      if (!barber) {
        return res.status(404).json({ error: "Barbeiro não encontrado" });
      }
      
      return res.json(barber);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async findByUserId(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;
      const barber = await barberRepository.findByUserId(userId);
      
      if (!barber) {
        return res.status(404).json({ error: "Barbeiro não encontrado" });
      }
      
      return res.json(barber);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { userId, specialty } = req.body;

      // Validação básica
      if (!userId) {
        return res.status(400).json({ error: "ID do usuário é obrigatório" });
      }

      // Verificar se o usuário existe
      const user = await userRepository.findById(userId);
      if (!user) {
        return res.status(400).json({ error: "Usuário não encontrado" });
      }

      // Verificar se já existe um barbeiro para este usuário
      const existingBarber = await barberRepository.findByUserId(userId);
      if (existingBarber) {
        return res.status(400).json({ error: "Já existe um barbeiro para este usuário" });
      }

      // Criar barbeiro
      const barber = await barberRepository.create({
        userId,
        specialty
      });

      return res.status(201).json(barber);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { specialty } = req.body;

      // Verificar se o barbeiro existe
      const barber = await barberRepository.findById(id);
      if (!barber) {
        return res.status(404).json({ error: "Barbeiro não encontrado" });
      }

      // Preparar dados para atualização
      const updateData: any = {};
      if (specialty !== undefined) updateData.specialty = specialty;

      // Atualizar barbeiro
      const updatedBarber = await barberRepository.update(id, updateData);

      return res.json(updatedBarber);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      // Verificar se o barbeiro existe
      const barber = await barberRepository.findById(id);
      if (!barber) {
        return res.status(404).json({ error: "Barbeiro não encontrado" });
      }
      
      // Deletar barbeiro
      await barberRepository.delete(id);
      
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
} 