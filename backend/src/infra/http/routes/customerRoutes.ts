import { Router } from "express";
import { customerController } from "../controllers";

const customerRoutes = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - userId
 *         - birthDate
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do cliente
 *         userId:
 *           type: string
 *           description: ID do usuário associado ao cliente
 *         birthDate:
 *           type: string
 *           format: date
 *           description: Data de nascimento do cliente
 *         hasAllergy:
 *           type: boolean
 *           description: Indica se o cliente possui alergia de pele
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *         user:
 *           $ref: '#/components/schemas/User'
 *     CustomerInput:
 *       type: object
 *       required:
 *         - userId
 *         - birthDate
 *       properties:
 *         userId:
 *           type: string
 *           description: ID do usuário associado ao cliente
 *         birthDate:
 *           type: string
 *           format: date
 *           description: Data de nascimento do cliente
 *         hasAllergy:
 *           type: boolean
 *           default: false
 *           description: Indica se o cliente possui alergia de pele
 *     CustomerUpdateInput:
 *       type: object
 *       properties:
 *         birthDate:
 *           type: string
 *           format: date
 *           description: Data de nascimento do cliente
 *         hasAllergy:
 *           type: boolean
 *           description: Indica se o cliente possui alergia de pele
 */

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: API de gerenciamento de clientes
 */

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Lista todos os clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Erro no servidor
 */
customerRoutes.get("/", customerController.findAll.bind(customerController));

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Obtém um cliente pelo ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Detalhes do cliente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro no servidor
 */
customerRoutes.get("/:id", customerController.findById.bind(customerController));

/**
 * @swagger
 * /customers/user/{userId}:
 *   get:
 *     summary: Obtém um cliente pelo ID do usuário
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Detalhes do cliente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro no servidor
 */
customerRoutes.get("/user/:userId", customerController.findByUserId.bind(customerController));

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerInput'
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro no servidor
 */
customerRoutes.post("/", customerController.create.bind(customerController));

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     summary: Atualiza um cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerUpdateInput'
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro no servidor
 */
customerRoutes.put("/:id", customerController.update.bind(customerController));

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: Remove um cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do cliente
 *     responses:
 *       204:
 *         description: Cliente removido com sucesso
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro no servidor
 */
customerRoutes.delete("/:id", customerController.delete.bind(customerController));

export { customerRoutes }; 