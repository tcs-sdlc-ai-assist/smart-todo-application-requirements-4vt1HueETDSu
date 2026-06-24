import React from 'react';
import { render, screen } from '@testing-library/react';
import CollaborationPlaceholder from '../CollaborationPlaceholder';

describe('CollaborationPlaceholder', () => {
  it('renders the Collaboration placeholder UI', () => {
    render(<CollaborationPlaceholder />);
    expect(screen.getByText(/Collaboration/i)).toBeInTheDocument();
    expect(screen.getByText(/Share tasks, assign responsibilities/i)).toBeInTheDocument();
    expect(screen.getByText(/Coming Soon/i)).toBeInTheDocument();
    // Emoji icon present
    expect(screen.getByText('🤝')).toBeInTheDocument();
  });

  it('has accessible region and heading', () => {
    render(<CollaborationPlaceholder />);
    const region = screen.getByRole('region', { name: /Collaboration Coming Soon/i });
    expect(region).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Collaboration/i })).toBeInTheDocument();
  });

  it('has correct description and visual elements', () => {
    render(<CollaborationPlaceholder />);
    expect(
      screen.getByText(/Share tasks, assign responsibilities, and work together in real time/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Collaboration features are coming soon/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Coming Soon/i)).toBeInTheDocument();
  });
});