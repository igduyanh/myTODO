import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todoapp';

app.use(cors());
app.use(express.json());

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Todo = mongoose.model('Todo', todoSchema);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error', err);
    process.exit(1);
  });

app.get('/api/todos', async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: 1 });
  res.json(todos);
});

app.post('/api/todos', async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required.' });
  const todo = await Todo.create({ title: title.trim() });
  res.status(201).json(todo);
});

app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const updated = await Todo.findByIdAndUpdate(id, { title, completed }, { new: true });
  if (!updated) return res.status(404).json({ error: 'Todo not found.' });
  res.json(updated);
});

app.patch('/api/todos/:id/toggle', async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findById(id);
  if (!todo) return res.status(404).json({ error: 'Todo not found.' });
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
});

app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const deleted = await Todo.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ error: 'Todo not found.' });
  res.json({ success: true });
});

app.delete('/api/todos', async (req, res) => {
  const deleted = await Todo.deleteMany({ completed: true });
  res.json({ deletedCount: deleted.deletedCount });
});

app.listen(PORT, () => console.log(`API server listening on http://localhost:${PORT}`));
