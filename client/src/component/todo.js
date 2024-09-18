import React, { useEffect, useState } from "react";
import '../App.css';

export const Todo = () => {
  const [todoData, setTodoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [value, setValue] = useState("");  // For adding new todos
  const [editValue, setEditValue] = useState("");  // For editing existing todos
  const [editId, setEditId] = useState(null);  // Track which todo is being edited

  // Fetch todos from local server
  useEffect(() => {
    fetch("http://localhost:8000/api/todos")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        setTodoData(data);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []); // Empty dependency array to run only once on mount

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleClick = () => {
    if (value.trim()) {
      if (editId !== null) {
        // Update the existing todo
        fetch(`http://localhost:8000/api/todos/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ todo: editValue, complete: false }),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(`Network response was not ok: ${res.statusText}`);
            }
            return res.json();
          })
          .then((updatedTodo) => {
            setTodoData((prevTodoData) =>
              prevTodoData.map((todo) =>
                todo._id === editId ? updatedTodo : todo
              )
            );
            setEditId(null);
            setEditValue("");
          })
          .catch((e) => {
            console.error("Error updating todo:", e);
            setError("Failed to update todo");
          });
      } else {
        // Add a new todo via POST request
        const newTodo = { todo: value, complete: false };

        fetch("http://localhost:8000/api/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTodo),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error('Network response was not ok');
            }
            return res.json();
          })
          .then((data) => {
            setTodoData((prevTodoData) => [...prevTodoData, data]);
            setValue(""); // Clear input field
          })
          .catch((err) => {
            console.error("Error adding todo:", err);
            setError("Failed to add todo");
          });
      }
    }
  };

  const handleEdit = (id, currentValue) => {
    setEditId(id);
    setEditValue(currentValue);
  };

  const handleEditInputChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleInputBlur = () => {
    if (editId !== null && editValue.trim()) {
      fetch(`http://localhost:8000/api/todos/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todo: editValue, complete: false }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Network response was not ok: ${res.statusText}`);
          }
          return res.json();
        })
        .then((updatedTodo) => {
          setTodoData((prevTodoData) =>
            prevTodoData.map((todo) =>
              todo._id === editId ? updatedTodo : todo
            )
          );
          setEditId(null);
          setEditValue("");
        })
        .catch((e) => {
          console.error("Error updating todo:", e);
          setError("Failed to update todo");
        });
    } else {
      setEditId(null); // Exit edit mode without changes
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
      <div className="p-4 flex justify-center gap-6">
        <input
          type="text"
          value={value}
          className="w-96 border border-blue-500 p-2"
          onChange={handleChange}
          onKeyPress={(e) => { if (e.key === 'Enter') handleClick() }}
        />
        <button className="bg-slate-500 px-4 font-bold rounded-md text-white" onClick={handleClick}>
          {editId !== null ? 'Update' : 'Add'}
        </button>
      </div>
      <div className="flex justify-center align-center">
        <div className="w-[700px] flex flex-col justify-center align-center">
          {todoData?.map((data) => (
            <li key={data._id} className="mb-4">
              {editId === data._id ? (
                <div className="flex justify-start gap-4">
                  <input
                    type="text"
                    value={editValue}
                    onChange={handleEditInputChange}
                    onBlur={handleInputBlur}
                    onKeyPress={handleInputKeyPress}
                    autoFocus
                    className="border border-blue-500 p-2 w-96"
                  />
                  <button
                    className="bg-slate-500 p-2 font-bold rounded-md text-white"
                    onClick={handleInputBlur}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <span
                  className="text-lg font-medium cursor-pointer"
                  onClick={() => handleEdit(data._id, data.todo)}
                  style={{
                    textDecoration: data.complete ? "line-through" : "none",
                  }}
                >
                  {data.todo}
                </span>
              )}
            </li>
          ))}
        </div>
      </div>
    </>
  );
};
