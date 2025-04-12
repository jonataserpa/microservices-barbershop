import { Router } from "express";
import { scheduleController } from "../controllers";

const scheduleRoutes = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Schedule:
 *       type: object
 *       required:
 *         - customerId
 *         - barberId
 *         - date
 *         - serviceIds
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do agendamento
 *         customerId:
 *           type: string
 *           description: ID do cliente
 *         barberId:
 *           type: string
 *           description: ID do barbeiro
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do agendamento
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELED, COMPLETED]
 *           description: Status do agendamento
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *     ScheduleInput:
 *       type: object
 *       required:
 *         - customerId
 *         - barberId
 *         - date
 *         - serviceIds
 *       properties:
 *         customerId:
 *           type: string
 *           description: ID do cliente
 *         barberId:
 *           type: string
 *           description: ID do barbeiro
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do agendamento
 *         serviceIds:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de IDs dos serviços solicitados
 *     ScheduleUpdateInput:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELED, COMPLETED]
 *           description: Status do agendamento
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do agendamento
 *         serviceIds:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de IDs dos serviços solicitados
 */

/**
 * @swagger
 * tags:
 *   name: Agendamentos
 *   description: API de gerenciamento de agendamentos
 */

/**
 * @swagger
 * /scheduling:
 *   post:
 *     summary: Cria um novo agendamento
 *     tags: [Agendamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScheduleInput'
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       400:
 *         description: Dados inválidos ou regra de negócio violada
 *       500:
 *         description: Erro no servidor
 */
scheduleRoutes.post("/", scheduleController.create.bind(scheduleController));

/**
 * @swagger
 * /scheduling:
 *   get:
 *     summary: Lista todos os agendamentos
 *     tags: [Agendamentos]
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *       500:
 *         description: Erro no servidor
 */
scheduleRoutes.get("/", scheduleController.listAll.bind(scheduleController));

/**
 * @swagger
 * /scheduling/{id}:
 *   get:
 *     summary: Obtém um agendamento pelo ID
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Detalhes do agendamento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro no servidor
 */
scheduleRoutes.get("/:id", scheduleController.findById.bind(scheduleController));

/**
 * @swagger
 * /scheduling/{id}:
 *   put:
 *     summary: Atualiza um agendamento
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScheduleUpdateInput'
 *     responses:
 *       200:
 *         description: Agendamento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       400:
 *         description: Dados inválidos ou regra de negócio violada
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro no servidor
 */
scheduleRoutes.put("/:id", scheduleController.update.bind(scheduleController));

/**
 * @swagger
 * /scheduling/{id}:
 *   delete:
 *     summary: Remove um agendamento
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento
 *     responses:
 *       204:
 *         description: Agendamento removido com sucesso
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro no servidor
 */
scheduleRoutes.delete("/:id", scheduleController.delete.bind(scheduleController));

/**
 * @swagger
 * /scheduling/customer/{customerId}:
 *   get:
 *     summary: Lista agendamentos por cliente
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Lista de agendamentos do cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *       500:
 *         description: Erro no servidor
 */
scheduleRoutes.get("/customer/:customerId", scheduleController.findByCustomerId.bind(scheduleController));

/**
 * @swagger
 * /scheduling/barber/{barberId}:
 *   get:
 *     summary: Lista agendamentos por barbeiro
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: barberId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do barbeiro
 *     responses:
 *       200:
 *         description: Lista de agendamentos do barbeiro
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *       500:
 *         description: Erro no servidor
 */
scheduleRoutes.get("/barber/:barberId", scheduleController.findByBarberId.bind(scheduleController));

/**
 * @swagger
 * /scheduling/date:
 *   get:
 *     summary: Lista agendamentos por data
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Data no formato YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Lista de agendamentos na data especificada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *       400:
 *         description: Data não fornecida ou inválida
 *       500:
 *         description: Erro no servidor
 */
scheduleRoutes.get("/date", scheduleController.findByDate.bind(scheduleController));

export { scheduleRoutes }; 