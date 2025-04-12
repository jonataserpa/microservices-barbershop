import { Request, Response } from "express";
import { userRepository } from "../../../infra/database";
import { UserRole } from "../../../domain/entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class UserController {
  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      // Verificação de permissão poderia estar em um middleware
      // Aqui colocamos direto no controller por simplicidade
      const users = await userRepository.findAll();
      
      // Remover a senha dos usuários na resposta
      const usersWithoutPassword = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      return res.json(usersWithoutPassword);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const user = await userRepository.findById(id);
      
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      
      // Remover a senha do usuário na resposta
      const { password, ...userWithoutPassword } = user;
      
      return res.json(userWithoutPassword);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async checkEmail(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.params;
      const user = await userRepository.findByEmail(email);
      
      return res.json({ exists: !!user });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password, role } = req.body;

      // Validação básica
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
      }

      // Verificar se o email já está em uso
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email já está em uso" });
      }

      // Hash da senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Criar usuário
      const user = await userRepository.create({
        name,
        email,
        password: hashedPassword,
        role: role as UserRole || UserRole.CUSTOMER
      });

      // Remover a senha do usuário na resposta
      const { password: _, ...userWithoutPassword } = user;

      return res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, email, password, role } = req.body;

      // Verificar se o usuário existe
      const user = await userRepository.findById(id);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Se estiver alterando o email, verificar se o novo email já está em uso
      if (email && email !== user.email) {
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
          return res.status(400).json({ error: "Email já está em uso" });
        }
      }

      // Preparar dados para atualização
      const updateData: any = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (role) updateData.role = role;

      // Se a senha for fornecida, fazer o hash
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }

      // Atualizar usuário
      const updatedUser = await userRepository.update(id, updateData);

      // Remover a senha do usuário na resposta
      const { password: _, ...userWithoutPassword } = updatedUser;

      return res.json(userWithoutPassword);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      // Verificar se o usuário existe
      const user = await userRepository.findById(id);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      
      // Deletar usuário
      await userRepository.delete(id);
      
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      // Validação básica
      if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
      }

      // Buscar usuário pelo email
      const user = await userRepository.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      // Verificar senha
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || "barber-shop-secret",
        { expiresIn: "1d" }
      );

      // Remover a senha do usuário na resposta
      const { password: _, ...userWithoutPassword } = user;

      return res.json({
        user: userWithoutPassword,
        token,
        expiresIn: "1d"
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      // O middleware de autenticação deve adicionar o usuário ao request
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "Não autorizado" });
      }
      
      const user = await userRepository.findById(userId);
      
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      
      // Remover a senha do usuário na resposta
      const { password, ...userWithoutPassword } = user;
      
      return res.json(userWithoutPassword);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
} 