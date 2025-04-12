import { Router } from "express";
import { serviceController } from "../controllers";

const serviceRoutes = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ServiceType:
 *       type: string
 *       enum:
 *         - HAIRCUT
 *         - BEARD
 *         - COMBO
 *         - OTHER
 *       description: Tipos de serviços oferecidos
 *     Service:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - duration
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do serviço
 *         name:
 *           type: string
 *           description: Nome do serviço
 *         description:
 *           type: string
 *           description: Descrição detalhada do serviço
 *         price:
 *           type: number
 *           format: float
 *           description: Preço do serviço em reais
 *         duration:
 *           type: integer
 *           description: Duração do serviço em minutos
 *         type:
 *           $ref: '#/components/schemas/ServiceType'
 *           description: Tipo do serviço
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *     ServiceInput:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - duration
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do serviço
 *         description:
 *           type: string
 *           description: Descrição detalhada do serviço
 *         price:
 *           type: number
 *           format: float
 *           description: Preço do serviço em reais
 *         duration:
 *           type: integer
 *           description: Duração do serviço em minutos
 *         type:
 *           $ref: '#/components/schemas/ServiceType'
 *           description: Tipo do serviço
 *     ServiceUpdateInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do serviço
 *         description:
 *           type: string
 *           description: Descrição detalhada do serviço
 *         price:
 *           type: number
 *           format: float
 *           description: Preço do serviço em reais
 *         duration:
 *           type: integer
 *           description: Duração do serviço em minutos
 *         type:
 *           $ref: '#/components/schemas/ServiceType'
 *           description: Tipo do serviço
 *     PriceCalculationInput:
 *       type: object
 *       required:
 *         - serviceIds
 *       properties:
 *         serviceIds:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de IDs dos serviços para cálculo de preço
 *     PriceCalculationResult:
 *       type: object
 *       properties:
 *         totalPrice:
 *           type: number
 *           format: float
 *           description: Preço total calculado
 *         services:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Service'
 *           description: Lista de serviços incluídos no cálculo
 *         hasDiscount:
 *           type: boolean
 *           description: Indica se foi aplicado desconto (como no caso de combo)
 */

/**
 * @swagger
 * tags:
 *   name: Serviços
 *   description: API de gerenciamento de serviços
 */

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Lista todos os serviços
 *     tags: [Serviços]
 *     responses:
 *       200:
 *         description: Lista de serviços
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *       500:
 *         description: Erro no servidor
 */
serviceRoutes.get("/", serviceController.findAll.bind(serviceController));

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Obtém um serviço pelo ID
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do serviço
 *     responses:
 *       200:
 *         description: Detalhes do serviço
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: Serviço não encontrado
 *       500:
 *         description: Erro no servidor
 */
serviceRoutes.get("/:id", serviceController.findById.bind(serviceController));

/**
 * @swagger
 * /services/name/{name}:
 *   get:
 *     summary: Busca serviços pelo nome
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome ou parte do nome do serviço
 *     responses:
 *       200:
 *         description: Lista de serviços encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *       500:
 *         description: Erro no servidor
 */
serviceRoutes.get("/name/:name", serviceController.findByName.bind(serviceController));

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Cria um novo serviço
 *     tags: [Serviços]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceInput'
 *     responses:
 *       201:
 *         description: Serviço criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro no servidor
 */
serviceRoutes.post("/", serviceController.create.bind(serviceController));

/**
 * @swagger
 * /services/{id}:
 *   put:
 *     summary: Atualiza um serviço
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do serviço
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceUpdateInput'
 *     responses:
 *       200:
 *         description: Serviço atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Serviço não encontrado
 *       500:
 *         description: Erro no servidor
 */
serviceRoutes.put("/:id", serviceController.update.bind(serviceController));

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Remove um serviço
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do serviço
 *     responses:
 *       204:
 *         description: Serviço removido com sucesso
 *       404:
 *         description: Serviço não encontrado
 *       500:
 *         description: Erro no servidor
 */
serviceRoutes.delete("/:id", serviceController.delete.bind(serviceController));

/**
 * @swagger
 * /services/calculate-price:
 *   post:
 *     summary: Calcula o preço total de um conjunto de serviços
 *     description: Calcula o preço total considerando descontos e combos (como corte + barba)
 *     tags: [Serviços]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PriceCalculationInput'
 *     responses:
 *       200:
 *         description: Cálculo de preço realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PriceCalculationResult'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro no servidor
 */
serviceRoutes.post("/calculate-price", serviceController.calculatePrice.bind(serviceController));

export { serviceRoutes }; 