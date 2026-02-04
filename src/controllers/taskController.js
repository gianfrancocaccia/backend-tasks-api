const Task = require('../models/Task');

exports.createTask = async (req, res, next) => {
  try {
    const nuevaTarea = new Task(req.body);
    nuevaTarea.creador = req.user;
    await nuevaTarea.save();
    res.status(201).json(nuevaTarea);
  } catch (error) {
    next(error);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const tareas = await Task.find({ creador: req.user });
    res.json(tareas);
  } catch (error) {
    next(error);
  }
};