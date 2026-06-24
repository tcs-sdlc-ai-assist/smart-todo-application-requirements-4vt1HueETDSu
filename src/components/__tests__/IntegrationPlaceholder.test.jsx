import React from 'react';
import { render, screen } from '@testing-library/react';
import IntegrationPlaceholder from '../IntegrationPlaceholder';

describe('IntegrationPlaceholder', () => {
  it('renders the Integrations placeholder UI', () => {
    render(<IntegrationPlaceholder />);
    expect(screen.getByText(/Integrations/i)).toBeInTheDocument();
    expect(screen.getByText(/Connect your favorite tools/i)).toBeInTheDocument();
    expect(screen.getByText(/Coming Soon/i)).toBeInTheDocument();
    // Emoji icon present
    expect(screen.getByText('🔗')).toBeInTheDocument();
  });

  it('has accessible region and heading', () => {
    render(<IntegrationPlaceholder />);
    const region = screen.getByRole('region', { name: /Integrations Coming Soon/i });
    expect(region).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Integrations/i })).toBeInTheDocument();
  });

  it('has correct description and visual elements', () => {
    render(<IntegrationPlaceholder />);
    expect(
      screen.getByText(/Connect your favorite tools and automate your workflow/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Integrations with calendars, email, and more are coming soon/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Coming Soon/i)).toBeInTheDocument();
  });
});