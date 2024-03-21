import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';

const TaskTracker = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      { id: 1, title: 'Engage Jupiter Express for outer solar system travel', status: 'todo' },
      { id: 2, title: 'Requesting available flights is now taking > 5 seconds', status: 'in progress' },
      { id: 3, title: 'Register with the Mars Ministry of Revenue', status: 'done' },
      { id: 4, title: 'Homepage footer uses an inline style - should use a class', status: 'done' },
    ];
  });

  const [newTask, setNewTask] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTaskToTodo = () => {
    if (newTask.trim()) {
      const existingTask = tasks.find(task => task.title.toLowerCase() === newTask.toLowerCase());
      if (existingTask) {
        setError('Task with this title already exists!');
        return;
      }
      const task = {
        id: tasks.length + 1,
        title: newTask,
        status: 'todo',
      };
      setTasks([...tasks, task]);
      setNewTask('');
      setError('');
    } else {
      setError('Task title cannot be empty!');
    }
  };

  const moveTask = (id, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const editTask = (id, newTitle) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Insert task summary"
          style={{ padding: '8px', fontSize: '16px', flex: '1' }}
        />
        <button onClick={addTaskToTodo} style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add to Todo</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
        <Column
          title="TO DO"
          tasks={tasks.filter((task) => task.status === 'todo')}
          moveTask={moveTask}
          deleteTask={deleteTask}
          editTask={editTask}
          nextStatus="in progress"
          bgColor="#f0f0f0"
        />
        <Column
          title="IN PROGRESS"
          tasks={tasks.filter((task) => task.status === 'in progress')}
          moveTask={moveTask}
          deleteTask={deleteTask}
          editTask={editTask}
          nextStatus="done"
          bgColor="#f0f0f0"
          greenButton
        />
        <Column
          title="DONE"
          tasks={tasks.filter((task) => task.status === 'done')}
          moveTask={moveTask}
          deleteTask={deleteTask}
          bgColor="#cfc"
        />
      </div>
    </div>
  );
};

const Column = ({ title, tasks, moveTask, deleteTask, editTask, nextStatus, bgColor, greenButton }) => (
  <div style={{ border: '1px solid #ccc', padding: '8px', width: '33.33%', backgroundColor: bgColor, borderRadius: '8px' }}>
    <h2 style={{ textTransform: 'uppercase', marginTop: 0 }}>{title} {tasks.length}</h2>
    {tasks.map((task) => (
      <Task
        key={task.id}
        task={task}
        moveTask={moveTask}
        deleteTask={deleteTask}
        editTask={editTask}
        nextStatus={nextStatus}
        greenButton={greenButton}
      />
    ))}
  </div>
);

const Task = ({ task, moveTask, deleteTask, editTask, nextStatus, greenButton }) => {
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleClick = () => {
    moveTask(task.id, nextStatus);
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    editTask(task.id, editedTitle);
    setEditing(false);
  };

  return (
    <div style={{ position: 'relative', backgroundColor: '#fff', padding: '16px', borderRadius: '8px', marginBottom: '8px' }}>
      {editing ? (
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onBlur={handleSave}
          autoFocus
        />
      ) : (
        <span style={{ marginBottom: '8px', fontSize: '16px', cursor: 'pointer' }} onClick={handleEdit}>{task.title}</span>
      )}
      {task.status !== 'done' && (
        <div style={{ marginTop: '8px' }}>
          <button
            style={{ backgroundColor: greenButton ? '#4CAF50' : '#f0f0f0', color: greenButton ? '#fff' : '#000', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}
            onClick={handleClick}
          >
            {greenButton ? 'Done' : 'In Progress'}
          </button>
        </div>
      )}
      <button
        style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
        onClick={handleDelete}
        >
        <MdClose style={{ color: '#ccc' }} />
      </button>
    </div>
    );
};

export default TaskTracker;
