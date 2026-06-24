import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Tooltip from '../Tooltip';

describe('Tooltip', () => {
  it('renders child element', () => {
    render(
      <Tooltip content="Tooltip info">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('shows tooltip on mouse enter and hides on mouse leave', () => {
    render(
      <Tooltip content="Tooltip info">
        <button>Hover me</button>
      </Tooltip>
    );
    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);
    // Wait for delay (default 120ms)
    jest.advanceTimersByTime
      ? jest.advanceTimersByTime(130)
      : jest.runAllTimers && jest.runAllTimers();
    // Tooltip should appear
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Tooltip info')).toBeInTheDocument();
    fireEvent.mouseLeave(trigger);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows tooltip on focus and hides on blur', () => {
    render(
      <Tooltip content="Focus tooltip">
        <button>Focus me</button>
      </Tooltip>
    );
    const trigger = screen.getByText('Focus me');
    fireEvent.focus(trigger);
    jest.advanceTimersByTime
      ? jest.advanceTimersByTime(130)
      : jest.runAllTimers && jest.runAllTimers();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Focus tooltip')).toBeInTheDocument();
    fireEvent.blur(trigger);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('sets aria-describedby when visible', () => {
    render(
      <Tooltip content="Described tooltip">
        <button>Described</button>
      </Tooltip>
    );
    const trigger = screen.getByText('Described');
    fireEvent.mouseEnter(trigger);
    jest.advanceTimersByTime
      ? jest.advanceTimersByTime(130)
      : jest.runAllTimers && jest.runAllTimers();
    expect(trigger).toHaveAttribute('aria-describedby', 'tooltip-content');
    fireEvent.mouseLeave(trigger);
    expect(trigger).not.toHaveAttribute('aria-describedby');
  });

  it('supports custom placement', () => {
    render(
      <Tooltip content="Bottom tooltip" placement="bottom">
        <button>Bottom</button>
      </Tooltip>
    );
    const trigger = screen.getByText('Bottom');
    fireEvent.mouseEnter(trigger);
    jest.advanceTimersByTime
      ? jest.advanceTimersByTime(130)
      : jest.runAllTimers && jest.runAllTimers();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Bottom tooltip')).toBeInTheDocument();
  });

  it('supports custom delay', () => {
    render(
      <Tooltip content="Delayed tooltip" delay={300}>
        <button>Delay</button>
      </Tooltip>
    );
    const trigger = screen.getByText('Delay');
    fireEvent.mouseEnter(trigger);
    // Not visible before delay
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    jest.advanceTimersByTime
      ? jest.advanceTimersByTime(310)
      : jest.runAllTimers && jest.runAllTimers();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('renders tooltip content as JSX', () => {
    render(
      <Tooltip content={<span data-testid="jsx-content">JSX Content</span>}>
        <button>JSX</button>
      </Tooltip>
    );
    const trigger = screen.getByText('JSX');
    fireEvent.mouseEnter(trigger);
    jest.advanceTimersByTime
      ? jest.advanceTimersByTime(130)
      : jest.runAllTimers && jest.runAllTimers();
    expect(screen.getByTestId('jsx-content')).toBeInTheDocument();
  });

  it('applies tabIndex to child if not present', () => {
    render(
      <Tooltip content="TabIndex test">
        <span>TabIndex</span>
      </Tooltip>
    );
    const trigger = screen.getByText('TabIndex');
    expect(trigger).toHaveAttribute('tabIndex', '0');
  });

  it('preserves child tabIndex if set', () => {
    render(
      <Tooltip content="TabIndex test">
        <span tabIndex={5}>TabIndex</span>
      </Tooltip>
    );
    const trigger = screen.getByText('TabIndex');
    expect(trigger).toHaveAttribute('tabIndex', '5');
  });
});

// Setup/teardown for timers
beforeAll(() => {
  jest.useFakeTimers();
});
afterAll(() => {
  jest.useRealTimers();
});
afterEach(() => {
  jest.clearAllTimers && jest.clearAllTimers();
});