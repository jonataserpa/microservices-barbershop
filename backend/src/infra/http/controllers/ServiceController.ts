import { Request, Response } from "express";
import { serviceRepository } from "../../../infra/database";
import { calculateServicePriceUseCase } from "../../../domain/usecases/service";

export class ServiceController {
  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const services = await serviceRepository.findAll();
      return res.json(services);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const service = await serviceRepository.findById(id);
      
      if (!service) {
        return res.status(404).json({ error: "Serviço não encontrado" });
      }
      
      return res.json(service);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async findByName(req: Request, res: Response): Promise<Response> {
    try {
      const { name } = req.params;
      const services = await serviceRepository.findByName(name);
      
      return res.json(services);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, description, price, duration, type } = req.body;

      // Validação básica
      if (!name || !price || !duration) {
        return res.status(400).json({ error: "Nome, preço e duração são obrigatórios" });
      }

      // Verificar se o preço é um número positivo
      if (isNaN(Number(price)) || Number(price) <= 0) {
        return res.status(400).json({ error: "O preço deve ser um número positivo" });
      }

      // Verificar se a duração é um número inteiro positivo
      if (!Number.isInteger(Number(duration)) || Number(duration) <= 0) {
        return res.status(400).json({ error: "A duração deve ser um número inteiro positivo" });
      }

      // Criar serviço
      const service = await serviceRepository.create({
        name,
        description,
        price: Number(price),
        duration: Number(duration),
        type
      });

      return res.status(201).json(service);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, description, price, duration, type } = req.body;

      // Verificar se o serviço existe
      const service = await serviceRepository.findById(id);
      if (!service) {
        return res.status(404).json({ error: "Serviço não encontrado" });
      }

      // Validação de dados
      if (price !== undefined && (isNaN(Number(price)) || Number(price) <= 0)) {
        return res.status(400).json({ error: "O preço deve ser um número positivo" });
      }

      if (duration !== undefined && (!Number.isInteger(Number(duration)) || Number(duration) <= 0)) {
        return res.status(400).json({ error: "A duração deve ser um número inteiro positivo" });
      }

      // Preparar dados para atualização
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = Number(price);
      if (duration !== undefined) updateData.duration = Number(duration);
      if (type !== undefined) updateData.type = type;

      // Atualizar serviço
      const updatedService = await serviceRepository.update(id, updateData);

      return res.json(updatedService);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      // Verificar se o serviço existe
      const service = await serviceRepository.findById(id);
      if (!service) {
        return res.status(404).json({ error: "Serviço não encontrado" });
      }
      
      // Deletar serviço
      await serviceRepository.delete(id);
      
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async calculatePrice(req: Request, res: Response): Promise<Response> {
    try {
      const { serviceIds } = req.body;

      // Validação básica
      if (!serviceIds || !Array.isArray(serviceIds)) {
        return res.status(400).json({ error: "Lista de IDs de serviços é obrigatória" });
      }

      // Calcular preço total
      const totalPrice = await calculateServicePriceUseCase.execute(serviceIds);
      
      // Buscar detalhes dos serviços
      const services = await serviceRepository.findByIds(serviceIds);
      
      // Verificar se há desconto (caso do combo)
      const individualTotal = services.reduce((sum, service) => sum + service.price, 0);
      const hasDiscount = totalPrice < individualTotal;

      return res.json({
        totalPrice,
        services,
        hasDiscount
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
} 