const Todo = require("../models/todo.model");

async function createTodo(data) {
  const todo = new Todo({
    title: data.title,
    description: data.description,
    completed: data.completed,
    category: data.category, // PERBAIKAN 1: Menangkap category saat create
    owner: data.owner,
    created_by: data.created_by,
    updated_by: data.updated_by || data.created_by, // PERBAIKAN 2: updated_by langsung diisi saat create
  });
  return await todo.save();
}

async function getAllTodos(ownerId, queryOptions = {}) {
  const { page = 1, limit = 10, completed, sortBy = "created_at", order = "desc", search } = queryOptions;

  const filter = { owner: ownerId };

  if (completed !== undefined) {
    filter.completed = completed === "true" || completed === true;
  }

  // Menambahkan fitur pencarian berdasarkan title
  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const sortDirection = order === "asc" ? 1 : -1;
  const skip = (Number(page) - 1) * Number(limit);

  const [todos, totalItems] = await Promise.all([
    Todo.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(Number(limit))
      .populate("category", "name"), // Opsional agar data kategori ikut tampil saat GET
    Todo.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / Number(limit));

  return {
    todos,
    pagination: {
      currentPage: Number(page),
      totalPages,
      totalItems,
      itemsPerPage: Number(limit),
    },
  };
}

async function getAllTodosForAdmin(queryOptions = {}) {
  const { page = 1, limit = 10, completed, sortBy = "created_at", order = "desc", search } = queryOptions;

  const filter = {};

  if (completed !== undefined) {
    filter.completed = completed === "true" || completed === true;
  }

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const sortDirection = order === "asc" ? 1 : -1;
  const skip = (Number(page) - 1) * Number(limit);

  const [todos, totalItems] = await Promise.all([
    Todo.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(Number(limit))
      .populate("owner", "name email")
      .populate("category", "name"), // Opsional agar kategori tampil di admin
    Todo.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / Number(limit));

  return {
    todos,
    pagination: {
      currentPage: Number(page),
      totalPages,
      totalItems,
      itemsPerPage: Number(limit),
    },
  };
}

async function getTodoById(id) {
  return await Todo.findById(id).populate("category", "name");
}

async function updateTodo(id, data) {
  const updateFields = {};
  if (data.title !== undefined) updateFields.title = data.title;
  if (data.description !== undefined) updateFields.description = data.description;
  if (data.completed !== undefined) updateFields.completed = data.completed;
  if (data.archived !== undefined) updateFields.archived = data.archived;
  if (data.category !== undefined) updateFields.category = data.category; // PERBAIKAN 3: Menangkap category saat update
  if (data.updated_by !== undefined) updateFields.updated_by = data.updated_by;

  return await Todo.findByIdAndUpdate(
    id,
    updateFields,
    { new: true, runValidators: true }
  ).populate("category", "name");
}

async function deleteTodo(id) {
  return await Todo.findByIdAndDelete(id);
}

async function getSummaryStats() {
  const totalTodos = await Todo.countDocuments();
  const completedTodos = await Todo.countDocuments({ completed: true });
  const pendingTodos = totalTodos - completedTodos;

  return { totalTodos, completedTodos, pendingTodos };
}

module.exports = {
  createTodo,
  getAllTodos,
  getAllTodosForAdmin,
  getTodoById,
  updateTodo,
  deleteTodo,
  getSummaryStats,
};