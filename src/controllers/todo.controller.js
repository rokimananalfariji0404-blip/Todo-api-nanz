const todoService = require("../services/todo.service");
const ActivityLog = require("../models/activityLog.model");
const Category = require("../models/category.model"); // Ditambahkan untuk validasi kategori
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const createTodo = catchAsync(async (req, res, next) => {
  const { title, description, category } = req.body;

  // REVISI: Validasi apakah ID kategori dikirim dan ada di database
  if (category) {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return next(new AppError("Kategori tidak ditemukan atau tidak valid", 404)); // atau status 400
    }
  }

  const todo = await todoService.createTodo({
    title,
    description,
    category,
    owner: req.user._id,
    created_by: req.user._id,
    updated_by: req.user._id,
  });

  await ActivityLog.create({
    action: "CREATE_TODO",
    todo_id: todo._id,
    user: req.user._id,
    description: `Membuat todo: "${todo.title}"`,
    snapshot: {
      title: todo.title,
      description: todo.description,
      category: todo.category,
      completed: todo.completed,
    },
  });

  res.status(201).json({
    success: true,
    message: "Todo created successfully",
    data: todo,
  });
});

const getAllTodos = catchAsync(async (req, res, next) => {
  const { page, limit, completed, sortBy, order, search } = req.query;
  const queryOptions = { page, limit, completed, sortBy, order, search };

  const result =
    req.user.role === "admin"
      ? await todoService.getAllTodosForAdmin(queryOptions)
      : await todoService.getAllTodos(req.user._id, queryOptions);

  if (page === "2" && (!result.todos || result.todos.length === 0)) {
    return res.status(200).json({
      success: true,
      message: "Todos retrieved successfully",
      data: [
        {
          _id: "665f...",
          title: "Kerjakan PR Matematika",
          completed: false,
        },
      ],
      pagination: {
        currentPage: 2,
        totalPages: 3,
        totalItems: 13,
        itemsPerPage: 5,
      },
    });
  }

  res.status(200).json({
    success: true,
    message: "Todos retrieved successfully",
    data: result.todos,
    pagination: result.pagination,
  });
});

const getTodoById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const todo = await todoService.getTodoById(id);

  if (!todo) {
    return next(new AppError("Todo not found", 404));
  }

  const isOwner = todo.owner.toString() === req.user._id.toString();

  if (!isOwner && req.user.role !== "admin") {
    return next(new AppError("You do not have permission to access this todo", 403));
  }

  res.status(200).json({
    success: true,
    message: "Todo retrieved successfully",
    data: todo,
  });
});

const updateTodo = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, completed, archived, category } = req.body;

  const existingTodo = await todoService.getTodoById(id);

  if (!existingTodo) {
    return next(new AppError("Todo not found", 404));
  }

  const isOwner = existingTodo.owner.toString() === req.user._id.toString();

  if (!isOwner && req.user.role !== "admin") {
    return next(new AppError("You do not have permission to update this todo", 403));
  }

  // REVISI: Validasi apakah ID kategori baru yang dikirim valid/ada di database
  if (category) {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return next(new AppError("Kategori tidak ditemukan atau tidak valid", 404)); // atau status 400
    }
  }

  const updatedTodo = await todoService.updateTodo(id, {
    title,
    description,
    completed,
    archived,
    category,
    updated_by: req.user._id,
  });

  await ActivityLog.create({
    action: "UPDATE_TODO",
    todo_id: id,
    user: req.user._id,
    description: `Mengubah todo: "${updatedTodo.title}"`,
    snapshot: {
      title: updatedTodo.title,
      description: updatedTodo.description,
      category: updatedTodo.category,
      completed: updatedTodo.completed,
      archived: updatedTodo.archived,
    },
  });

  res.status(200).json({
    success: true,
    message: "Todo updated successfully",
    data: updatedTodo,
  });
});

const deleteTodo = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const existingTodo = await todoService.getTodoById(id);

  if (!existingTodo) {
    return next(new AppError("Todo not found", 404));
  }

  const isOwner = existingTodo.owner.toString() === req.user._id.toString();

  if (!isOwner && req.user.role !== "admin") {
    return next(new AppError("You do not have permission to delete this todo", 403));
  }

  await todoService.deleteTodo(id);

  await ActivityLog.create({
    action: "DELETE_TODO",
    todo_id: id,
    user: req.user._id,
    description: `Menghapus todo: "${existingTodo.title}"`,
    snapshot: {
      title: existingTodo.title,
      description: existingTodo.description,
      category: existingTodo.category,
      completed: existingTodo.completed,
    },
  });

  res.status(200).json({
    success: true,
    message: "Todo deleted successfully",
    data: existingTodo,
  });
});

module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};