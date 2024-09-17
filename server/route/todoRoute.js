// routes/todoRoutes.js
const express = require("express");
const Todo = require("../model/Todo"); // Import the Todo model

const router = express.Router();

// POST route to create a new todo
router.post('/todos', async (req, res) => {
    const { todo, complete } = req.body;
  
    if (!todo) {
      return res.status(400).json({ message: 'Todo content is required' });
    }
  
    try {
      const newTodo = new Todo({
        todo,
        complete
      });
  
      const savedTodo = await newTodo.save();
      res.status(201).json(savedTodo); // Respond with the created todo
    } catch (err) {
      console.error('Error adding todo:', err); // Log the error
      res.status(500).json({ message: 'Failed to add todo', error: err.message });
    }
  });

// GET route to retrieve all todos
router.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve tasks", error: err.message });
  }
});
// PUT route to update an existing todo by ID
router.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { todo, complete } = req.body;
    console.log(id,todo,complete);
    
    if (!todo) {
      return res.status(400).json({ message: 'Todo content is required' });
    }
  
    try {
      const updatedTodo = await Todo.findByIdAndUpdate(
        id,
        { todo, complete },
        { new: true, runValidators: true } // `new: true` returns the updated document, `runValidators: true` runs validators on the updated data
      );
  
      if (!updatedTodo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
  
      res.status(200).json(updatedTodo); // Respond with the updated todo
    } catch (err) {
      console.error('Error updating todo:', err); // Log the error
      res.status(500).json({ message: 'Failed to update todo', error: err.message });
    }
  });
  
module.exports = router; // Export the router
