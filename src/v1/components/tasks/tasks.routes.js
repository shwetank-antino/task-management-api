import express from 'express';
import { createTask, getTaskById, getAllTasks, updateTask, deleteTask, getTaskStats } from './tasks.controller.js';
import { createTaskSchema, updateTaskSchema} from "./task.validator.js";
import { authenticate } from '../../../middleware/auth-handler.js';
import { validate } from '../../../middleware/validate.js';

const router = express.Router();

router.use(authenticate);

router.get('/stats', getTaskStats);

router.route('/')
.get(getAllTasks)
.post(validate(createTaskSchema), createTask);

router.route('/:id')
.get(getTaskById)
.patch(validate(updateTaskSchema), updateTask)
.delete(deleteTask);

export default router;