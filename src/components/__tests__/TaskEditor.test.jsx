import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import TaskEditor from '../TaskEditor';

describe('TaskEditor', () => {
  const defaultProps = {
    onSave: jest.fn(),
    onCancel: jest.fn(),
    initialTask: undefined
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders new task form with default values', () => {
    render(<TaskEditor {...defaultProps} />);
    expect(screen.getByText(/New Task/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Details/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Due Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Recurrence/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tags/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Task/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('renders edit task form with initial values', () => {
    const initialTask = {
      id: 1,
      text: 'Edit me',
      details: 'Details here',
      dueDate: '2024-06-01',
      priority: 'high',
      recurrence: 'weekly',
      tags: ['work', 'urgent']
    };
    render(<TaskEditor {...defaultProps} initialTask={initialTask} />);
    expect(screen.getByDisplayValue('Edit me')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Details here')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-06-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('high')).toBeInTheDocument();
    expect(screen.getByDisplayValue('weekly')).toBeInTheDocument();
    expect(screen.getByDisplayValue('work, urgent')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
  });

  it('validates required title field', async () => {
    render(<TaskEditor {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Task/i }));
    expect(await screen.findByText(/Task title is required/i)).toBeInTheDocument();
    expect(defaultProps.onSave).not.toHaveBeenCalled();
  });

  it('calls onSave with correct data for new task', async () => {
    const onSave = jest.fn();
    render(<TaskEditor {...defaultProps} onSave={onSave} />);
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'My Task' } });
    fireEvent.change(screen.getByLabelText(/Details/i), { target: { value: 'Some details' } });
    fireEvent.change(screen.getByLabelText(/Due Date/i), { target: { value: '2024-06-10' } });
    fireEvent.change(screen.getByLabelText(/Priority/i), { target: { value: 'low' } });
    fireEvent.change(screen.getByLabelText(/Recurrence/i), { target: { value: 'daily' } });
    fireEvent.change(screen.getByLabelText(/Tags/i), { target: { value: 'home, test' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Task/i }));
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'My Task',
          details: 'Some details',
          dueDate: '2024-06-10',
          priority: 'low',
          recurrence: 'daily',
          tags: ['home', 'test']
        })
      );
    });
  });

  it('calls onSave with correct data for editing', async () => {
    const onSave = jest.fn();
    const initialTask = {
      id: 2,
      text: 'Old Task',
      details: 'Old details',
      dueDate: '2024-06-01',
      priority: 'medium',
      recurrence: 'none',
      tags: ['work']
    };
    render(<TaskEditor {...defaultProps} initialTask={initialTask} onSave={onSave} />);
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Updated Task' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 2,
          text: 'Updated Task'
        })
      );
    });
  });

  it('calls onCancel when Cancel button is clicked', () => {
    const onCancel = jest.fn();
    render(<TaskEditor {...defaultProps} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('disables buttons and shows Saving... when saving', async () => {
    const onSave = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 200)));
    render(<TaskEditor {...defaultProps} onSave={onSave} />);
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Save Test' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Task/i }));
    expect(screen.getByRole('button', { name: /Saving.../i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeDisabled();
    await waitFor(() => expect(onSave).toHaveBeenCalled());
  });

  it('shows error if onSave throws', async () => {
    const onSave = jest.fn(() => {
      throw new Error('Save failed');
    });
    render(<TaskEditor {...defaultProps} onSave={onSave} />);
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Fail Task' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Task/i }));
    expect(await screen.findByText(/Failed to save task/i)).toBeInTheDocument();
  });

  it('focuses title input on mount (accessibility)', () => {
    render(<TaskEditor {...defaultProps} />);
    const input = screen.getByLabelText(/Title/i);
    expect(document.activeElement).toBe(input);
  });
});