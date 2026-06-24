import React from 'react';
import { render, screen } from '@testing-library/react';
import AIPlaceholder from '../AIPlaceholder';

describe('AIPlaceholder', () => {
  it('renders the AI Suggestions placeholder UI', () => {
    render(<AIPlaceholder />);
    expect(screen.getByText(/AI Suggestions/i)).toBeInTheDocument();
    expect(screen.getByText(/Smart task suggestions/i)).toBeInTheDocument();
    expect(screen.getByText(/Coming Soon/i)).toBeInTheDocument();
    // Emoji icon present
    expect(screen.getByText('🤖')).toBeInTheDocument();
  });

  it('has accessible region and heading', () => {
    render(<AIPlaceholder />);
    const region = screen.getByRole('region', { name: /AI Suggestions Coming Soon/i });
    expect(region).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /AI Suggestions/i })).toBeInTheDocument();
  });

  it('has correct description and visual elements', () => {
    render(<AIPlaceholder />);
    expect(screen.getByText(/Smart task suggestions and productivity insights powered by AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Coming Soon/i)).toBeInTheDocument();
  });
});