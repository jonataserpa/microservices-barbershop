/**
 * @swagger
 * tags:
 *   name: Barbers
 *   description: Gerenciamento de barbeiros
 */

/**
 * @swagger
 * /barbers:
 *   get:
 *     summary: Lista todos os barbeiros
 *     tags: [Barbers]
 *     responses:
 *       200:
 *         description: Lista de barbeiros obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Barber'
 *       500:
 *         description: Erro no servidor
 */

/**
 * @swagger
 * /barbers/{id}:
 *   get:
 *     summary: Obtém um barbeiro pelo ID
 *     tags: [Barbers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do barbeiro
 *     responses:
 *       200:
 *         description: Barbeiro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Barber'
 *       404:
 *         description: Barbeiro não encontrado
 *       500:
 *         description: Erro no servidor
 */

/**
 * @swagger
 * /barbers/user/{userId}:
 *   get:
 *     summary: Obtém um barbeiro pelo ID do usuário
 *     tags: [Barbers]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário associado ao barbeiro
 *     responses:
 *       200:
 *         description: Barbeiro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Barber'
 *       404:
 *         description: Barbeiro não encontrado
 *       500:
 *         description: Erro no servidor
 */

/**
 * @swagger
 * /barbers:
 *   post:
 *     summary: Cria um novo barbeiro
 *     tags: [Barbers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID do usuário associado ao barbeiro
 *               specialty:
 *                 type: string
 *                 description: Especialidade do barbeiro (opcional)
 *     responses:
 *       201:
 *         description: Barbeiro criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Barber'
 *       400:
 *         description: Dados inválidos ou usuário já associado a um barbeiro
 *       500:
 *         description: Erro no servidor
 */

/**
 * @swagger
 * /barbers/{id}:
 *   put:
 *     summary: Atualiza um barbeiro existente
 *     tags: [Barbers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do barbeiro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specialty:
 *                 type: string
 *                 description: Nova especialidade do barbeiro
 *     responses:
 *       200:
 *         description: Barbeiro atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Barber'
 *       404:
 *         description: Barbeiro não encontrado
 *       500:
 *         description: Erro no servidor
 */

/**
 * @swagger
 * /barbers/{id}:
 *   delete:
 *     summary: Remove um barbeiro
 *     tags: [Barbers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do barbeiro
 *     responses:
 *       204:
 *         description: Barbeiro removido com sucesso
 *       404:
 *         description: Barbeiro não encontrado
 *       500:
 *         description: Erro no servidor
 */

export {}; // Exportação vazia para que o arquivo seja considerado um módulo 