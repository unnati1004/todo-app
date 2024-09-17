import React, { useEffect, useState } from "react";
import '../App.css';

export const Todo = () => {
  const [todoData, setTodoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [value, setValue] = useState("");  // For adding new todos
  const [editValue, setEditValue] = useState("");  // For editing existing todos
  const [editId, setEditId] = useState(null);  // Track which todo is being edited

  // // Fetch todos from dummyjson.com
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

  // Fetch todos from local server
  // useEffect(() => {
  //   fetch("http://localhost:8000/api/todos")
  //     .then((res) => {
  //       if (!res.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return res.json();
  //     })
  //     .then((data) => {
  //       // Merge the data from the local server
  //       setTodoData(data.todos);
  //     })
  //     .catch((e) => {
  //       setError(e.message);
  //     });
  // }, [todoData]); 
  
  // Empty dependency array to run only once on mount

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
          body: JSON.stringify({ todo: editValue, complete: false }), // Ensure you are sending the correct data
        })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
          .then((updatedTodo) => {
            console.log("updated successfully");
            
            setTodoData((prev) =>
              prev.map((todo) =>
                todo.id === editId ? updatedTodo : todo
              )
            );
          })
          .catch((e) => setError(e.message));
          setEditId(null);
          setEditValue("");
      } else {
        // Add a new todo via POST request
        const newTodo = {id:new Date(), todo: value, complete: false };
  
        fetch("http://localhost:8000/api/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTodo),
        })
          .then((res) => res.json())
          .then((data) => {
            // After successfully adding to the server, add to local state
            console.log(data);
            
            setTodoData(prev => [...prev, {id:prev.length+1, todo: value, complete: false }]);
          })
          .catch((err) => {
            console.error("Error adding todo:", err);
          });
      }
      setValue(""); // Clear input field
      setEditValue(""); // Clear edit value
    }
  };

  const handleEdit = (id, currentValue) => {
    console.log(id,currentValue);
    
    setEditId(id);
    setEditValue(currentValue);
  };

  const handleEditInputChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleInputBlur = () => {
    if (editId !== null && editValue.trim()) {
      setTodoData((prev) =>
        prev.map((todo) =>
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
      <div className="p-4  flex justify-center gap-6">
        <input
          type="text"
          value={value}
          className="w-96 border border-blue-500 p-2 "
          onChange={handleChange}
          onKeyPress={handleInputKeyPress}
        />
        <button className="bg-slate-500 px-4 font-bold rounded-md text-white" onClick={handleClick}>{editId !== null ? 'Update' : 'Add'}</button>
      </div>
      <div className=" flex justify-center align-center">
        <div className="w-[700px] flex flex-col justify-center align-center">
          {todoData.map((data) => (
            <li key={data.id}>
              {editId === data.id ? (
                <div className="flex justify-start gap-30">
                  <input
                    type="text"
                    value={editValue}
                    onChange={handleEditInputChange}
                    onBlur={handleInputBlur}
                    onKeyPress={handleInputKeyPress}
                    autoFocus
                    className="border border-blue-500 p-4 w-96"
                  />
                  <button className="bg-slate-500 p-4 font-bold rounded-md text-white" onClick={handleInputBlur}>Save</button>
                </div>
              ) : (
                <span
                 className="text-lg font-medium"
                  onClick={() => handleEdit(data.id, data.todo)}
                  style={{ cursor: 'pointer', textDecoration: data.complete ? 'line-through' : 'none' }}
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
