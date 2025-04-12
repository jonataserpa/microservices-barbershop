import { Request, Response } from "express";
import { customerRepository, userRepository } from "../../../infra/database";

export class CustomerController {
  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const customers = await customerRepository.findAll();
      return res.json(customers);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const customer = await customerRepository.findById(id);
      
      if (!customer) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }
      
      return res.json(customer);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async findByUserId(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;
      const customer = await customerRepository.findByUserId(userId);
      
      if (!customer) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }
      
      return res.json(customer);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { userId, birthDate, hasAllergy } = req.body;

      // Validação básica
      if (!userId || !birthDate) {
        return res.status(400).json({ error: "ID do usuário e data de nascimento são obrigatórios" });
      }

      // Verificar se o usuário existe
      const user = await userRepository.findById(userId);
      if (!user) {
        return res.status(400).json({ error: "Usuário não encontrado" });
      }

      // Verificar se já existe um cliente para este usuário
      const existingCustomer = await customerRepository.findByUserId(userId);
      if (existingCustomer) {
        return res.status(400).json({ error: "Já existe um cliente para este usuário" });
      }

      // Criar cliente
      const customer = await customerRepository.create({
        userId,
        birthDate: new Date(birthDate),
        hasAllergy: hasAllergy || false
      });

      return res.status(201).json(customer);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { birthDate, hasAllergy } = req.body;

      // Verificar se o cliente existe
      const customer = await customerRepository.findById(id);
      if (!customer) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }

      // Preparar dados para atualização
      const updateData: any = {};
      if (birthDate) updateData.birthDate = new Date(birthDate);
      if (hasAllergy !== undefined) updateData.hasAllergy = hasAllergy;

      // Atualizar cliente
      const updatedCustomer = await customerRepository.update(id, updateData);

      return res.json(updatedCustomer);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      // Verificar se o cliente existe
      const customer = await customerRepository.findById(id);
      if (!customer) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }
      
      // Deletar cliente
      await customerRepository.delete(id);
      
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
} 