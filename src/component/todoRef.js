import React, { useEffect, useState, useRef } from "react";
import '../App.css';

export const TodoRef = () => {
  const [todoData, setTodoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState("");  // General input state
  const [editId, setEditId] = useState(null);  // Track which todo is being edited
  const [isEditEnabled, setIsEditEnabled] = useState(false);  // Toggle edit mode

  // Ref for the edit input
  const editInputRef = useRef(null);

  useEffect(() => {
    fetch("https://dummyjson.com/todos")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
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

  const handleAddOrUpdate = () => {
    if (!inputValue.trim()) return;
    
    setTodoData(prev => {
      if (editId !== null) {
        return prev.map(todo =>
          todo.id === editId ? { ...todo, todo: inputValue } : todo
        );
      } else {
        return [...prev, { id: prev.length + 1, todo: inputValue, complete: false }];
      }
    });

    resetInput();
  };

  const handleEdit = (id, currentValue) => {
    if (!isEditEnabled) return;
    setEditId(id);
    setInputValue(currentValue);
    editInputRef.current?.focus();  // Focus input when editing
  };

  const resetInput = () => {
    setInputValue("");
    setEditId(null);
  };

  const toggleEditMode = () => setIsEditEnabled(prev => !prev);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="input-todo-div">
        <input
          type="text"
          value={inputValue}
          className="input-todo"
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddOrUpdate()}
          ref={editId !== null ? editInputRef : null}
        />
        <button onClick={handleAddOrUpdate}>
          {editId !== null ? 'Update' : 'Add'}
        </button>
      </div>

      <div>
        <button onClick={toggleEditMode}>
          {isEditEnabled ? 'Disable Edit Mode' : 'Enable Edit Mode'}
        </button>
      </div>

      <ul>
        {todoData.map((todo) => (
          <li key={todo.id}>
            {editId === todo.id ? (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleAddOrUpdate}
                ref={editInputRef}
              />
            ) : (
              <span
                onClick={() => handleEdit(todo.id, todo.todo)}
                style={{
                  cursor: isEditEnabled ? 'pointer' : 'default',
                  textDecoration: todo.complete ? 'line-through' : 'none'
                }}
              >
                {todo.todo}
              </span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};
