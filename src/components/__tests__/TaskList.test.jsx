import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import TaskList from '../TaskList';

// Mock taskService functions
jest.mock('../../services/taskService', () => {
  let tasks = [
    {
      id: 1,
      text: 'Buy milk',
      completed: false,
      priority: 'medium',
      recurrence: 'none',
      dueDate: '2024-06-10',
      details: '2L whole milk'
    },
    {
      id: 2,
      text: 'Read book',
      completed: true,
      priority: 'high',
      recurrence: 'weekly',
      dueDate: '2024-06-11',
      details: ''
    },
    {
      id: 3,
      text: 'Write tests',
      completed: false,
      priority: 'low',
      recurrence: 'none',
      dueDate: '',
      details: 'For TaskList'
    }
  ];
  return {
    getAllTasks: jest.fn(() => tasks.slice()),
    searchTasks: jest.fn((q) =>
      tasks.filter((t) => t.text.toLowerCase().includes(q.trim().toLowerCase()))
    ),
    filterTasksByStatus: jest.fn((status) => {
      if (status === 'active') return tasks.filter((t) => !t.completed);
      if (status === 'completed') return tasks.filter((t) => t.completed);
      return tasks.slice();
    }),
    filterTasksByPriority: jest.fn((priority) =>
      tasks.filter((t) => t.priority === priority)
    ),
    deleteTask: jest.fn((id) => {
      tasks = tasks.filter((t) => t.id !== id);
      return true;
    }),
    toggleTaskCompleted: jest.fn((id) => {
      const idx = tasks.findIndex((t) => t.id === id);
      if (idx === -1) return { task: null, error: 'Task not found.' };
      tasks[idx] = { ...tasks[idx], completed: !tasks[idx].completed };
      return { task: tasks[idx], error: null };
    }),
    updateTask: jest.fn((id, updates) => {
      const idx = tasks.findIndex((t) => t.id === id);
      if (idx === -1) return { task: null, error: 'Task not found.' };
      tasks[idx] = { ...tasks[idx], ...updates };
      return { task: tasks[idx], error: null };
    }),
    addTask: jest.fn((data) => {
      const newTask = {
        id: Math.max(...tasks.map((t) => t.id)) + 1,
        completed: false,
        ...data
      };
      tasks.push(newTask);
      return { task: newTask, error: null };
    }
  };
});

describe('TaskList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all tasks by default', () => {
    render(<TaskList />);
    expect(screen.getByText(/Tasks/i)).toBeInTheDocument();
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    expect(screen.getByText('Read book')).toBeInTheDocument();
    expect(screen.getByText('Write tests')).toBeInTheDocument();
  });

  it('filters tasks by status (active)', async () => {
    render(<TaskList />);
    fireEvent.change(screen.getByDisplayValue('All Todos'), {
      target: { value: 'active' }
    });
    await waitFor(() => {
      expect(screen.getByText('Buy milk')).toBeInTheDocument();
      expect(screen.getByText('Write tests')).toBeInTheDocument();
      expect(screen.queryByText('Read book')).not.toBeInTheDocument();
    });
  });

  it('filters tasks by status (completed)', async () => {
    render(<TaskList />);
    fireEvent.change(screen.getByDisplayValue('All Todos'), {
      target: { value: 'completed' }
    });
    await waitFor(() => {
      expect(screen.getByText('Read book')).toBeInTheDocument();
      expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
      expect(screen.queryByText('Write tests')).not.toBeInTheDocument();
    });
  });

  it('filters tasks by priority', async () => {
    render(<TaskList />);
    fireEvent.change(screen.getByDisplayValue('All Priorities'), {
      target: { value: 'high' }
    });
    await waitFor(() => {
      expect(screen.getByText('Read book')).toBeInTheDocument();
      expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
      expect(screen.queryByText('Write tests')).not.toBeInTheDocument();
    });
  });

  it('searches tasks by text', async () => {
    render(<TaskList />);
    fireEvent.change(screen.getByPlaceholderText(/Search tasks/i), {
      target: { value: 'milk' }
    });
    await waitFor(() => {
      expect(screen.getByText('Buy milk')).toBeInTheDocument();
      expect(screen.queryByText('Read book')).not.toBeInTheDocument();
      expect(screen.queryByText('Write tests')).not.toBeInTheDocument();
    });
  });

  it('shows empty state if no tasks match filter', async () => {
    render(<TaskList />);
    fireEvent.change(screen.getByDisplayValue('All Priorities'), {
      target: { value: 'high' }
    });
    fireEvent.change(screen.getByPlaceholderText(/Search tasks/i), {
      target: { value: 'notfound' }
    });
    await waitFor(() => {
      expect(screen.getByText(/No tasks found/i)).toBeInTheDocument();
    });
  });

  it('can add a new task', async () => {
    render(<TaskList />);
    fireEvent.click(screen.getByText('+ Add Task'));
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'New Task' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Task/i }));
    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument();
    });
  });

  it('can edit a task', async () => {
    render(<TaskList />);
    fireEvent.click(screen.getAllByLabelText('Edit task')[0]);
    const input = screen.getByLabelText(/Title/i);
    fireEvent.change(input, { target: { value: 'Milk updated' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));
    await waitFor(() => {
      expect(screen.getByText('Milk updated')).toBeInTheDocument();
    });
  });

  it('can delete a task', async () => {
    render(<TaskList />);
    const deleteButtons = screen.getAllByLabelText('Delete task');
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => {
      expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
    });
  });

  it('can toggle task completed', async () => {
    render(<TaskList />);
    const checkboxes = screen.getAllByRole('checkbox');
    // Toggle "Buy milk" (first task, not completed)
    fireEvent.click(checkboxes[0]);
    await waitFor(() => {
      // Should now be completed (line-through)
      expect(screen.getByText('Buy milk')).toHaveStyle('text-decoration: line-through');
    });
  });

  it('shows error if deleteTask fails', async () => {
    const { deleteTask } = require('../../services/taskService');
    deleteTask.mockImplementationOnce(() => false);
    render(<TaskList />);
    const deleteButtons = screen.getAllByLabelText('Delete task');
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => {
      expect(screen.getByText(/Failed to delete task/i)).toBeInTheDocument();
    });
  });

  it('focuses Add Task button for accessibility', () => {
    render(<TaskList />);
    const addButton = screen.getByText('+ Add Task');
    addButton.focus();
    expect(document.activeElement).toBe(addButton);
  });

  it('shows loading indicator during async actions', async () => {
    render(<TaskList />);
    fireEvent.click(screen.getByText('+ Add Task'));
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Loading Task' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Task/i }));
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });
  });
});