import Joi from "joi";

export const createTaskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow(""),
  status: Joi.string().valid("pending", "done"),
  priority: Joi.string().valid("low", "medium", "high"),
  dueDate: Joi.date().required(),
  assignee: Joi.string().optional(),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().allow(""),
  status: Joi.string().valid("pending", "done"),
  priority: Joi.string().valid("low", "medium", "high"),
  dueDate: Joi.date(),
  assignee: Joi.string(),
}).min(1);
