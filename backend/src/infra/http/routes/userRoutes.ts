import { Router } from "express";
import { userController } from "../controllers";

const userRoutes = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRole:
 *       type: string
 *       enum:
 *         - ADMIN
 *         - BARBER
 *         - CUSTOMER
 *       description: Papéis possíveis para um usuário no sistema
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do usuário
 *         name:
 *           type: string
 *           description: Nome completo do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário (único)
 *         password:
 *           type: string
 *           format: password
 *           description: Senha do usuário (armazenada com hash)
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do usuário
 *         name:
 *           type: string
 *           description: Nome completo do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *     UserInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Nome completo do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário (único)
 *         password:
 *           type: string
 *           format: password
 *           description: Senha do usuário
 *           minLength: 6
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *           default: CUSTOMER
 *           description: Papel do usuário no sistema
 *     UserUpdateInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nome completo do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário (único)
 *         password:
 *           type: string
 *           format: password
 *           description: Senha do usuário
 *           minLength: 6
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *           description: Papel do usuário no sistema
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         password:
 *           type: string
 *           format: password
 *           description: Senha do usuário
 *     LoginResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/UserResponse'
 *         token:
 *           type: string
 *           description: Token JWT para autenticação
 *         expiresIn:
 *           type: string
 *           description: Tempo de expiração do token
 */

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: API de gerenciamento de usuários e autenticação
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso proibido (apenas administradores)
 *       500:
 *         description: Erro no servidor
 */
userRoutes.get("/", userController.findAll.bind(userController));

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtém um usuário pelo ID
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Detalhes do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso proibido (apenas usuário proprietário ou administradores)
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro no servidor
 */
userRoutes.get("/:id", userController.findById.bind(userController));

/**
 * @swagger
 * /users/email/{email}:
 *   get:
 *     summary: Verifica se um email já está em uso
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         required: true
 *         description: Email a ser verificado
 *     responses:
 *       200:
 *         description: Resultado da verificação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   description: Indica se o email já está em uso
 *       500:
 *         description: Erro no servidor
 */
userRoutes.get("/email/:email", userController.checkEmail.bind(userController));

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Dados inválidos ou email já em uso
 *       500:
 *         description: Erro no servidor
 */
userRoutes.post("/", userController.create.bind(userController));

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateInput'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Dados inválidos ou email já em uso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso proibido (apenas usuário proprietário ou administradores)
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro no servidor
 */
userRoutes.put("/:id", userController.update.bind(userController));

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       204:
 *         description: Usuário removido com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso proibido (apenas usuário proprietário ou administradores)
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro no servidor
 */
userRoutes.delete("/:id", userController.delete.bind(userController));

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Realiza login de usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro no servidor
 */
userRoutes.post("/login", userController.login.bind(userController));

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Obtém os dados do usuário autenticado
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do perfil do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro no servidor
 */
userRoutes.get("/profile", userController.getProfile.bind(userController));

export { userRoutes }; 