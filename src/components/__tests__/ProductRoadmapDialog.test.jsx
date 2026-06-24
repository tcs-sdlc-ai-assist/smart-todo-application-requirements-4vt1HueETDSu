import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductRoadmapDialog from '../ProductRoadmapDialog';

describe('ProductRoadmapDialog', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when open is false', () => {
    const { container } = render(<ProductRoadmapDialog open={false} onClose={onClose} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders dialog with roadmap content when open is true', () => {
    render(<ProductRoadmapDialog open={true} onClose={onClose} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Product Roadmap/i })).toBeInTheDocument();
    expect(screen.getByText(/Here’s what’s coming soon/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Suggestions/i)).toBeInTheDocument();
    expect(screen.getByText(/Collaboration/i)).toBeInTheDocument();
    expect(screen.getByText(/Integrations/i)).toBeInTheDocument();
    expect(screen.getByText(/Reminders & Recurring Tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/Your feedback shapes our roadmap/i)).toBeInTheDocument();
  });

  it('has accessible dialog attributes', () => {
    render(<ProductRoadmapDialog open={true} onClose={onClose} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
    const heading = screen.getByRole('heading', { name: /Product Roadmap/i });
    expect(heading.id).toBe(dialog.getAttribute('aria-labelledby'));
  });

  it('calls onClose when overlay is clicked', () => {
    render(<ProductRoadmapDialog open={true} onClose={onClose} />);
    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    render(<ProductRoadmapDialog open={true} onClose={onClose} />);
    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('does not call onClose when clicking inside dialog content', () => {
    render(<ProductRoadmapDialog open={true} onClose={onClose} />);
    const content = screen.getByText(/Here’s what’s coming soon/i);
    fireEvent.click(content);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('shows all feature icons', () => {
    render(<ProductRoadmapDialog open={true} onClose={onClose} />);
    expect(screen.getByText('🤖')).toBeInTheDocument();
    expect(screen.getByText('🤝')).toBeInTheDocument();
    expect(screen.getByText('🔗')).toBeInTheDocument();
    expect(screen.getByText('⏰')).toBeInTheDocument();
    expect(screen.getByText('🚀')).toBeInTheDocument();
  });

  it('renders feature descriptions', () => {
    render(<ProductRoadmapDialog open={true} onClose={onClose} />);
    expect(
      screen.getByText(/Get smart task suggestions and productivity insights powered by AI/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Share tasks, assign responsibilities, and work together in real time/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Connect with calendars, email, and your favorite tools/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Never miss a deadline with reminders and flexible recurrence options/i)
    ).toBeInTheDocument();
  });
});