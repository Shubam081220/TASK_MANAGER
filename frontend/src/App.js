import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const showNotification = (msg) => {
    const notification = new Notification('Task Manager', {
      body: msg,
    });
  };

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const handleAddTask = () => {
    if (!title || !description || !category || !dueDate) return;
    const newTask = {
      id: Date.now(),
      title,
      description,
      category,
      dueDate,
      timeSlot,
      isImportant,
      createdAt: new Date().toLocaleString(),
    };
    setTasks([newTask, ...tasks]);
    setTitle('');
    setDescription('');
    setCategory('');
    setDueDate('');
    setTimeSlot('');
    setIsImportant(false);
    showNotification('✅ New Task Added!');
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    showNotification('🗑️ Task Deleted!');
  };

  const filteredTasks = filter === 'All'
    ? tasks
    : tasks.filter(task => task.category === filter);

  return (
    <div className="app-container">
      <h1>📝 Task Manager</h1>

      <div className="input-group">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category (e.g., Work, Personal)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Time Slot (e.g. 2:00 PM - 4:00 PM)"
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
        />
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isImportant}
            onChange={() => setIsImportant(!isImportant)}
          />
          Mark as Important/Emergency
        </label>
        <button onClick={handleAddTask}>➕ Add Task</button>
      </div>

      <div className="filter-group">
        <label>Filter by Category: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          {[...new Set(tasks.map(task => task.category))].map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <ul className="task-list">
        {filteredTasks.map(task => (
          <li key={task.id}>
            <div className="task-info">
              <strong>{task.title}</strong> - {task.description}
              <div className="timestamp">{task.createdAt}</div>
              <div>📅 Due: {task.dueDate}</div>
              <div>🏷️ Category: {task.category}</div>
              {task.timeSlot && <div className="time-slot">🕒 {task.timeSlot}</div>}
              {task.isImportant && <div className="important-tag">❗ Important</div>}
            </div>
            <button className="delete-btn" onClick={() => handleDelete(task.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
