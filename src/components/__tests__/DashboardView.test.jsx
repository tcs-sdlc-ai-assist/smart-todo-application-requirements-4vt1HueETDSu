import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import DashboardView from '../DashboardView';

// Mock taskService functions
jest.mock('../../services/taskService', () => {
  let tasks = [
    {
      id: 1,
      text: 'Today Task',
      completed: false,
      priority: 'medium',
      recurrence: 'none',
      dueDate: new Date().toISOString().slice(0, 10),
      details: 'Due today'
    },
    {
      id: 2,
      text: 'Upcoming Task',
      completed: false,
      priority: 'high',
      recurrence: 'weekly',
      dueDate: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 2);
        return d.toISOString().slice(0, 10);
      })(),
      details: 'Future'
    },
    {
      id: 3,
      text: 'Completed Task',
      completed: true,
      priority: 'low',
      recurrence: 'none',
      dueDate: (() => {
        const d = new Date();
        d.setDate(d.getDate() - 2);
        return d.toISOString().slice(0, 10);
      })(),
      details: 'Was due'
    }
  ];
  return {
    getTasksDueToday: jest.fn(() =>
      tasks.filter((t) => {
        const today = new Date();
        const due = new Date(t.dueDate);
        return (
          due.getFullYear() === today.getFullYear() &&
          due.getMonth() === today.getMonth() &&
          due.getDate() === today.getDate()
        );
      })
    ),
    getAllTasks: jest.fn(() => tasks.slice()),
    filterTasksByStatus: jest.fn((status) => {
      if (status === 'completed') return tasks.filter((t) => t.completed);
      if (status === 'active') return tasks.filter((t) => !t.completed);
      return tasks.slice();
    })
  };
});

describe('DashboardView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Today tasks by default', () => {
    render(<DashboardView />);
    expect(screen.getByText(/Today Tasks/i)).toBeInTheDocument();
    expect(screen.getByText('Today Task')).toBeInTheDocument();
    expect(screen.queryByText('Upcoming Task')).not.toBeInTheDocument();
    expect(screen.queryByText('Completed Task')).not.toBeInTheDocument();
  });

  it('navigates to Upcoming and shows upcoming tasks', async () => {
    render(<DashboardView />);
    fireEvent.click(screen.getByRole('button', { name: /Upcoming/i }));
    await waitFor(() => {
      expect(screen.getByText(/Upcoming Tasks/i)).toBeInTheDocument();
      expect(screen.getByText('Upcoming Task')).toBeInTheDocument();
      expect(screen.queryByText('Today Task')).not.toBeInTheDocument();
      expect(screen.queryByText('Completed Task')).not.toBeInTheDocument();
    });
  });

  it('navigates to Completed and shows completed tasks', async () => {
    render(<DashboardView />);
    fireEvent.click(screen.getByRole('button', { name: /Completed/i }));
    await waitFor(() => {
      expect(screen.getByText(/Completed Tasks/i)).toBeInTheDocument();
      expect(screen.getByText('Completed Task')).toBeInTheDocument();
      expect(screen.queryByText('Today Task')).not.toBeInTheDocument();
      expect(screen.queryByText('Upcoming Task')).not.toBeInTheDocument();
    });
  });

  it('shows empty state if no tasks in view', async () => {
    const { getTasksDueToday, getAllTasks, filterTasksByStatus } = require('../../services/taskService');
    getTasksDueToday.mockReturnValue([]);
    render(<DashboardView />);
    expect(screen.getByText(/No tasks found/i)).toBeInTheDocument();

    // Upcoming
    getAllTasks.mockReturnValue([]);
    fireEvent.click(screen.getByRole('button', { name: /Upcoming/i }));
    await waitFor(() => {
      expect(screen.getByText(/No tasks found/i)).toBeInTheDocument();
    });

    // Completed
    filterTasksByStatus.mockReturnValue([]);
    fireEvent.click(screen.getByRole('button', { name: /Completed/i }));
    await waitFor(() => {
      expect(screen.getByText(/No tasks found/i)).toBeInTheDocument();
    });
  });

  it('shows loading indicator while loading', async () => {
    // Simulate slow getAllTasks
    const { getAllTasks } = require('../../services/taskService');
    getAllTasks.mockImplementationOnce(() => {
      // Simulate delay
      return [
        {
          id: 99,
          text: 'Slow Task',
          completed: false,
          dueDate: new Date().toISOString().slice(0, 10)
        }
      ];
    });
    render(<DashboardView />);
    expect(screen.queryByText(/Loading/i)).not.toBeNull();
    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });
  });

  it('shows error if loading fails', async () => {
    const { getAllTasks } = require('../../services/taskService');
    getAllTasks.mockImplementationOnce(() => {
      throw new Error('fail');
    });
    render(<DashboardView />);
    fireEvent.click(screen.getByRole('button', { name: /Upcoming/i }));
    await waitFor(() => {
      expect(screen.getByText(/Failed to load dashboard tasks/i)).toBeInTheDocument();
    });
  });

  it('renders task details, due date, priority, and recurrence', () => {
    render(<DashboardView />);
    fireEvent.click(screen.getByRole('button', { name: /Upcoming/i }));
    expect(screen.getByText('Future')).toBeInTheDocument();
    expect(screen.getByText(/Due:/i)).toBeInTheDocument();
    expect(screen.getByText(/Priority:/i)).toBeInTheDocument();
    expect(screen.getByText(/Recurs:/i)).toBeInTheDocument();
  });

  it('renders checkboxes as readOnly and checked for completed', () => {
    render(<DashboardView />);
    fireEvent.click(screen.getByRole('button', { name: /Completed/i }));
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAttribute('readOnly');
  });

  it('has accessible region and headings', () => {
    render(<DashboardView />);
    expect(screen.getByRole('heading', { name: /Today Tasks/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Upcoming/i }));
    expect(screen.getByRole('heading', { name: /Upcoming Tasks/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Completed/i }));
    expect(screen.getByRole('heading', { name: /Completed Tasks/i })).toBeInTheDocument();
  });
});