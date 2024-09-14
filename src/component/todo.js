import React, { useEffect, useState } from "react";
import '../App.css';

export const Todo = () => {
  const [todoData, setTodoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [value, setValue] = useState("");  // For adding new todos
  const [editValue, setEditValue] = useState("");  // For editing existing todos
  const [editId, setEditId] = useState(null);  // Track which todo is being edited

  useEffect(() => {
    fetch("https://dummyjson.com/todos")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setTodoData(data.todos);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleClick = () => {
    if (value.trim()) {
      if (editId !== null) {
        // Update the existing todo
        setTodoData(prev =>
          prev.map(todo =>
            todo.id === editId ? { ...todo, todo: editValue } : todo
          )
        );
        setEditId(null); // Reset edit mode
      } else {
        // Add a new todo
        setTodoData(prev => [
          ...prev,
          { id: prev.length + 1, todo: value, complete: false }
        ]);
      }
      setValue(""); // Clear input field
      setEditValue(""); // Clear edit value
    }
  };

  const handleEdit = (id, currentValue) => {
    setEditId(id);
    setEditValue(currentValue);
  };

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  const handleEditInputChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleInputBlur = () => {
    if (editId !== null && editValue.trim()) {
      setTodoData(prev =>
        prev.map(todo =>
          todo.id === editId ? { ...todo, todo: editValue } : todo
        )
      );
      setEditId(null); // Exit edit mode
      setEditValue(""); // Clear the value
    }
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleInputBlur(); // Save changes on Enter key press
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="input-todo-div">
        <input
          type="text"
          value={value}
          className="input-todo"
          onChange={handleChange}
          onKeyPress={handleInputKeyPress}
        />
        <button onClick={handleClick}>{editId !== null ? 'Update' : 'Add'}</button>
      </div>
      <div>
        <ul>
          {todoData.map((data) => (
            <li key={data.id}>
              {editId === data.id ? (
                <>
                <input
                  type="text"
                  value={editValue}
                  onChange={handleEditInputChange}
                  onBlur={handleInputBlur}
                  onKeyPress={handleInputKeyPress}
                  autoFocus
                  />
                <button onClick={handleInputBlur} >Add</button>
                </>
              ) : (
                <span
                  onClick={() => handleEdit(data.id, data.todo)}
                  style={{ cursor: 'pointer', textDecoration: data.complete ? 'line-through' : 'none' }}
                >
                  {data.todo}
                </span>
              )}
          </li>
          ))}
        </ul>
      </div>
    </>
  );
};
