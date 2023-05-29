import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [longPressTodo, setLongPressTodo] = useState(null);

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      const timeStamp = new Date().toISOString();
      const todo = { timeStamp, text: newTodo, completed: false };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const handleDeleteTodo = (timeStamp) => {
    setTodos(todos.filter((todo) => todo.timeStamp !== timeStamp));
  };

  const handleCheckboxChange = (timeStamp) => {
    setTodos(
      todos.map((todo) =>
        todo.timeStamp === timeStamp
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  const handleMouseDown = (timeStamp) => {
    const timer = setTimeout(() => {
      handleLongPress(timeStamp);
    }, 500);
    setLongPressTimer(timer);
  };
  
  const handleMouseUp = () => {
    clearTimeout(longPressTimer);
    setLongPressTimer(null);
  };
  
  const handleLongPress = (timeStamp) => {
    handleDeleteTodo(timeStamp);
  };
  

  return (
    <div className="container">
      <h1>Todo List</h1>
      <div className="add-todo">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li
          key={todo.timeStamp}
          onMouseDown={() => handleMouseDown(todo.timeStamp)}
          onMouseUp={handleMouseUp}
          onTouchStart={() => handleMouseDown(todo.timeStamp)}
          onTouchEnd={handleMouseUp}
          onTouchCancel={handleMouseUp}
          className={`todo-item ${todo.completed ? 'completed' : ''} ${
            longPressTodo === todo.timeStamp ? 'long-press' : ''
          }`}
        >
        
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleCheckboxChange(todo.timeStamp)}
            />
            <span>{todo.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
