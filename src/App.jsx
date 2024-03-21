import React, { useState } from 'react';

const TaskTracker = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Learn React', status: 'todo' },
    { id: 2, title: 'Build a project', status: 'in progress' },
    { id: 3, title: 'Deploy to production', status: 'done' },
  ]);

  const [newTask, setNewTask] = useState('');

  const addTask = (status) => {
    if (newTask.trim()) {
      const task = {
        id: tasks.length + 1,
        title: newTask,
        status,
      };
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  const moveTask = (id, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <div>
      <h1>Task Tracker</h1>
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Insert task's summury"
      />
      <Column
        title="Todo"
        tasks={tasks.filter((task) => task.status === 'todo')}
        addTask={() => addTask('todo')}
        moveTask={moveTask}
      />
      <Column
        title="In Progress"
        tasks={tasks.filter((task) => task.status === 'in progress')}
        addTask={() => addTask('in progress')}
        moveTask={moveTask}
      />
      <Column
        title="Done"
        tasks={tasks.filter((task) => task.status === 'done')}
        addTask={() => addTask('done')}
        moveTask={moveTask}
      />
    </div>
  );
};

const Column = ({ title, tasks, addTask, moveTask }) => (
  <div>
    <h2>{title}</h2>
    <button onClick={addTask}>Add Task</button>
    {tasks.map((task) => (
      <Task
        key={task.id}
        task={task}
        moveTask={moveTask}
        nextStatus={
          task.status === 'todo'
            ? 'in progress'
            : task.status === 'in progress'
            ? 'done'
            : 'todo'
        }
      />
    ))}
  </div>
);

const Task = ({ task, moveTask, nextStatus }) => (
  <div>
    <span>{task.title}</span>
    <button onClick={() => moveTask(task.id, nextStatus)}>
      {nextStatus === 'todo'
        ? 'Mark as Todo'
        : nextStatus === 'in progress'
        ? 'Mark as In Progress'
        : 'Mark as Done'}
    </button>
  </div>
);

export default TaskTracker;
