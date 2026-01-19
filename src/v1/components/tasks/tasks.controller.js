import mongoose from "mongoose";
import User from "../../../models/user.model.js";
import Task from "../../../models/task.model.js";


export async function createTask(req, res) {
    const { title, description, status, priority, dueDate, assignee } = req.body;
    if (!title || !dueDate) {
        return res.status(400).json({ message: 'Title and Due Date are required' });
    }
    try{
        let assignedUser = null;

        if (assignee) {
            if(!mongoose.Types.ObjectId.isValid(assignee)) {
                return res.status(400).json({ message: 'Invalid assignee ID' });
            }

            assignedUser = await User.findById(assignee);
            if (!assignedUser) {
                return res.status(404).json({ message: 'Assignee user not found' });
            }
        }

        const newTask = new Task({
            title,
            description,
            status,
            priority,
            dueDate,
            createdBy: req.user.id,
            assignee: assignee || null,
        });
        await newTask.save();
        res.status(201).json({ message: 'Task created successfully', task: newTask
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getTaskById(req, res) {
    const { id } = req.params;
    try{
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const isAdmin = req.user.role === 'admin';
        const isCreator = task.createdBy.toString() === req.user.id;
        const isAssignee = task.assignee && task.assignee.toString() === req.user.id;

        if (!isAdmin && !isCreator && !isAssignee) {
            return res.status(403).json({
                message: "Forbidden: You do not have access to this task",
            });
        }

        res.status(200).json({ task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getAllTasks(req, res) {
    try{
        const { status, priority, search } = req.query;
        const query = {};

        if (req.user.role !== 'admin') {
            query.$and = [
              {
                $or: [
                  {createdBy: req.user.id}, 
                  {assignee: req.user.id}
                ],
              },
            ];
        }

        if (status) {
            query.status = status;
        }
        if (priority) {
            query.priority = priority;
        }
        if (search) {
            const searchCondition = { 
              $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ],
          };

          if(query.$and){
            query.$and.push(searchCondition);
          } else {
            query.$and = [searchCondition];
          }
        }
        const tasks = await Task.find(query);
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function updateTask(req, res) {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isAdmin = req.user.role === "admin";
    const isCreator = task.createdBy.toString() === req.user.id;
    const isAssignee =
      task.assignee && task.assignee.toString() === req.user.id;

    // Unauthorized
    if (!isAdmin && !isCreator && !isAssignee) {
      return res.status(403).json({
        message: "Forbidden: You cannot update this task",
      });
    }

    // Assignee can update ONLY status
    if (isAssignee && !isAdmin && !isCreator) {
      if (!req.body.status) {
        return res.status(400).json({
          message: "Assignee can only update task status",
        });
      }

      task.status = req.body.status;
    }

    // Creator/Admin can update everything
    if (isAdmin || isCreator) {
      const allowedFields = [
        "title",
        "description",
        "status",
        "priority",
        "dueDate",
        "assignee",
      ];

      if (req.body.assignee !== undefined) {
        if (!mongoose.Types.ObjectId.isValid(req.body.assignee)) {
          return res.status(400).json({
            message: "Invalid assignee ID",
          });
        }

        const assignedUser = await User.findById(req.body.assignee);
        if (!assignedUser) {
          return res.status(404).json({
            message: "Assignee user not found",
          });
        }
      }

      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          task[field] = req.body[field];
        }
      });
    }

    await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteTask(req, res) {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const isAdmin = req.user.role === "admin";
    const isCreator = task.createdBy.toString() === req.user.id;

    if (!isAdmin && !isCreator) {
      return res.status(403).json({
        message: "Forbidden: You cannot delete this task",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getTaskStats(req, res) {
  try {
    const matchStage = {};

    // Non-admin → only own tasks
    if (req.user.role !== "admin") {
      matchStage.$or = [
        { createdBy: req.user.id },
        { assignee: req.user.id },
      ];
    }

    const stats = await Task.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $eq: ["$status", "done"] }, 1, 0],
            },
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
            },
          },
          lowPriority: {
            $sum: {
              $cond: [{ $eq: ["$priority", "low"] }, 1, 0],
            },
          },
          mediumPriority: {
            $sum: {
              $cond: [{ $eq: ["$priority", "medium"] }, 1, 0],
            },
          },
          highPriority: {
            $sum: {
              $cond: [{ $eq: ["$priority", "high"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const result = stats[0] || {
      total: 0,
      completed: 0,
      pending: 0,
      lowPriority: 0,
      mediumPriority: 0,
      highPriority: 0,
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}